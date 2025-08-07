import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ApplicationCard from './components/ApplicationCard';
import ReviewPanel from './components/ReviewPanel';
import WorkflowStats from './components/WorkflowStats';
import FilterPanel from './components/FilterPanel';
import { API_BASE_URL } from '../../config/api';

const VendorApprovalWorkflow = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    urgency: '',
    category: '',
    country: '',
    sortBy: 'submission_date_desc'
  });
  const [stats, setStats] = useState({
    pendingLevel1: 0,
    pendingLevel2: 0,
    approvedToday: 0,
    rejectedWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendor applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/vendors?status=pending`);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication required. Please log in.');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setApplications(data);
        setFilteredApplications(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Fetch workflow statistics from API
  useEffect(() => {
    const fetchWorkflowStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/approvals/workflow-stats`);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication required for stats');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const statsData = await response.json();
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching workflow stats:', err);
        // Fallback to calculated stats from applications
        if (applications.length > 0) {
          const pendingLevel1 = applications.filter(app => app.status === 'pending').length;
          const pendingLevel2 = applications.filter(app => app.status === 'pending_level_2').length;
          const approvedToday = applications.filter(app => {
            const today = new Date().toDateString();
            const approvedDate = new Date(app.approved_at || app.created_at).toDateString();
            return app.status === 'approved' && approvedDate === today;
          }).length;
          const rejectedWeek = applications.filter(app => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const rejectedDate = new Date(app.updated_at || app.created_at);
            return app.status === 'rejected' && rejectedDate >= weekAgo;
          }).length;
          
          setStats({
            pendingLevel1,
            pendingLevel2,
            approvedToday,
            rejectedWeek
          });
        }
      }
    };

    fetchWorkflowStats();
  }, [applications]); // Re-fetch when applications change to get updated stats

  useEffect(() => {
    // Apply filters
    let filtered = [...applications];

    if (filters.search) {
      filtered = filtered.filter(app =>
        app.company_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.contact_person_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(app => app.supplier_category?.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.country) {
      filtered = filtered.filter(app => app.country_origin === filters.country);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'submission_date_asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'submission_date_desc':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'company_name_asc':
          return a.company_name?.localeCompare(b.company_name || '');
        case 'company_name_desc':
          return b.company_name?.localeCompare(a.company_name || '');
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredApplications(filtered);
  }, [applications, filters]);

  const handleViewDetails = async (application) => {
    try {
      // Fetch detailed vendor information
      const response = await fetch(`${API_BASE_URL}/vendors/${application.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const detailedVendor = await response.json();
      
      // Fetch vendor documents
      const documentsResponse = await fetch(`${API_BASE_URL}/documents/vendor/${application.id}`);
      const documents = documentsResponse.ok ? await documentsResponse.json() : [];
      
      // Fetch vendor approval history
      const historyResponse = await fetch(`${API_BASE_URL}/approvals/vendor/${application.id}/public`);
      const history = historyResponse.ok ? await historyResponse.json() : [];
      
      // Combine all data
      const detailedApplication = {
        ...detailedVendor,
        documents: documents,
        history: history
      };
      
      setSelectedApplication(detailedApplication);
      setShowReviewPanel(true);
    } catch (err) {
      console.error('Error fetching vendor details:', err);
      // Fallback to basic application data
      setSelectedApplication(application);
      setShowReviewPanel(true);
    }
  };



  const handleApprove = async (applicationId, remarks) => {
    console.log('Approving application:', applicationId, 'with remarks:', remarks);
    
    try {
      // Call the approval API
      const response = await fetch(`${API_BASE_URL}/approvals/vendor/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`  // Temporarily disabled for testing
        },
        body: JSON.stringify({
          level: 'final',
          status: 'approved',
          comments: remarks || 'Approved through questionnaire process'
        })
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to approve vendor';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status text
          errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      // Update application status in local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved', approved_at: new Date().toISOString() }
          : app
      ));
      
      // Refresh workflow stats
      const statsResponse = await fetch(`${API_BASE_URL}/approvals/workflow-stats`);
      if (statsResponse.ok) {
        const updatedStats = await statsResponse.json();
        setStats(updatedStats);
      }
      
      // Show success message
      alert(`Successfully approved vendor!`);
      
    } catch (error) {
      console.error('Approval failed:', error);
      alert(`Failed to approve vendor: ${error.message}`);
    }
  };

  const handleReject = async (applicationId, reason, customReason, remarks) => {
    console.log('Rejecting application:', applicationId, 'reason:', reason, 'remarks:', remarks);
    
    try {
      // Call the approval API with rejected status
      const response = await fetch(`${API_BASE_URL}/approvals/vendor/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`  // Temporarily disabled for testing
        },
        body: JSON.stringify({
          level: 'final',
          status: 'rejected',
          comments: `Rejected: ${reason}${remarks ? ` - ${remarks}` : ''}`
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reject vendor');
      }
      
      const result = await response.json();
      
      // Update application status in local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected' }
          : app
      ));
      
      // Refresh workflow stats
      const statsResponse = await fetch(`${API_BASE_URL}/approvals/workflow-stats`);
      if (statsResponse.ok) {
        const updatedStats = await statsResponse.json();
        setStats(updatedStats);
      }
      
      // Show success message
      alert(`Successfully rejected vendor!`);
      
    } catch (error) {
      console.error('Rejection failed:', error);
      alert(`Failed to reject vendor: ${error.message}`);
    }
  };

  const handleRequestChanges = async (applicationId, remarks) => {
    console.log('Requesting changes for application:', applicationId, 'remarks:', remarks);
    
    try {
      // Call the approval API with pending status and comments requesting changes
      const response = await fetch(`${API_BASE_URL}/approvals/vendor/${applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`  // Temporarily disabled for testing
        },
        body: JSON.stringify({
          level: 'level_1',
          status: 'pending',
          comments: `Changes requested: ${remarks || 'Please review and update required information'}`
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to request changes');
      }
      
      const result = await response.json();
      
      // Update application status in local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'pending_level_1' }
          : app
      ));
      
      // Refresh workflow stats
      const statsResponse = await fetch(`${API_BASE_URL}/approvals/workflow-stats`);
      if (statsResponse.ok) {
        const updatedStats = await statsResponse.json();
        setStats(updatedStats);
      }
      
      // Show success message
      alert(`Successfully requested changes from vendor!`);
      
    } catch (error) {
      console.error('Request changes failed:', error);
      alert(`Failed to request changes: ${error.message}`);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      urgency: '',
      category: '',
      country: '',
      sortBy: 'submission_date_desc'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading applications...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-red-600 text-xl mb-4">⚠️</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { label: 'Dashboard', path: '/dashboard-overview' },
                { label: 'Vendor Approval Workflow', path: '/vendor-approval-workflow' }
              ]} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Approval Workflow</h1>
                <p className="text-gray-600">
                  Review and process vendor applications through the approval pipeline
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/vendor-master-list')}
                >
                  View All Vendors
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/public-vendor-registration-form')}
                >
                  Invite Vendor
                </Button>
              </div>
            </div>

            {/* Workflow Statistics */}
            <WorkflowStats stats={stats} />

            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Applications List */}
            <div className="space-y-6">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-600 mb-4">
                    {Object.values(filters).some(value => value && value !== '') 
                      ? 'Try adjusting your filters to see more results.' :'No vendor applications are currently pending approval.'
                    }
                  </p>
                  {Object.values(filters).some(value => value && value !== '') && (
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {filteredApplications.length} of {applications.length} applications
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Panel Modal */}
      {showReviewPanel && selectedApplication && (
        <ReviewPanel
          application={selectedApplication}
          onClose={() => {
            setShowReviewPanel(false);
            setSelectedApplication(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
        />
      )}
    </div>
  );
};

export default VendorApprovalWorkflow;