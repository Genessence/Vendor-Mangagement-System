import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ApplicationCard from './components/ApplicationCard';
import ReviewPanel from './components/ReviewPanel';
import WorkflowStats from './components/WorkflowStats';
import FilterPanel from './components/FilterPanel';

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

  // Mock data for vendor applications
  const mockApplications = [
    {
      id: 'APP001',
      companyName: 'TechCorp Solutions Pvt Ltd',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh.kumar@techcorp.com',
      phone: '+91 98765 43210',
      country: 'India',
      category: 'Software',
      supplierType: 'MSME',
      businessVertical: 'Amber Enterprises India Limited',
      status: 'pending_level_1',
      urgency: 'high',
      submissionDate: '2025-01-20T10:30:00Z',
      documentsCompleted: 8,
      totalDocuments: 10,
      hasNewDocuments: true,
      hasComments: true,
      commentCount: 3,
      registeredAddress: '123 Tech Park, Sector 62, Noida, UP 201301',
      supplyAddress: '123 Tech Park, Sector 62, Noida, UP 201301',
      bankDetails: {
        bankName: 'HDFC Bank',
        accountNumber: '50100123456789',
        accountType: 'Current',
        ifscCode: 'HDFC0001234',
        branch: 'Noida Sector 62',
        currency: 'INR',
        proofDocument: 'cancelled_cheque.pdf'
      },
      documents: [
        { name: 'PAN Card', type: 'PDF', size: '245 KB' },
        { name: 'GST Certificate', type: 'PDF', size: '512 KB' },
        { name: 'MSME Certificate', type: 'PDF', size: '189 KB' },
        { name: 'Bank Proof', type: 'PDF', size: '324 KB' }
      ],
      agreements: [
        { name: 'Non-Disclosure Agreement', description: 'Confidentiality terms', signed: true },
        { name: 'Supplier Quality Agreement', description: 'Quality standards', signed: true },
        { name: '4M Agreement', description: 'Manufacturing terms', signed: false },
        { name: 'Code of Conduct', description: 'Ethical guidelines', signed: true }
      ],
      history: [
        {
          action: 'Application Submitted',
          description: 'Vendor completed registration form',
          user: 'System',
          role: 'System',
          timestamp: '20/01/2025 10:30 AM'
        },
        {
          action: 'Documents Uploaded',
          description: 'All required documents uploaded',
          user: 'Rajesh Kumar',
          role: 'Vendor',
          timestamp: '20/01/2025 11:15 AM'
        }
      ]
    },
    {
      id: 'APP002',
      companyName: 'Global Manufacturing Inc',
      contactPerson: 'Sarah Johnson',
      email: 'sarah.johnson@globalmanuf.com',
      phone: '+1 555 123 4567',
      country: 'United States',
      category: 'Raw Materials',
      supplierType: 'Large Enterprise',
      businessVertical: 'Amber Enterprises India Limited',
      status: 'pending_level_2',
      urgency: 'medium',
      submissionDate: '2025-01-18T14:20:00Z',
      documentsCompleted: 10,
      totalDocuments: 10,
      hasNewDocuments: false,
      hasComments: false,
      commentCount: 0,
      registeredAddress: '456 Industrial Ave, Detroit, MI 48201, USA',
      supplyAddress: '789 Supply Chain Blvd, Chicago, IL 60601, USA',
      bankDetails: {
        bankName: 'Chase Bank',
        accountNumber: 'US123456789012',
        accountType: 'Business Checking',
        ifscCode: 'CHASUS33XXX',
        branch: 'Detroit Main Branch',
        currency: 'USD',
        proofDocument: 'bank_letterhead.pdf'
      },
      documents: [
        { name: 'Business License', type: 'PDF', size: '445 KB' },
        { name: 'Tax Certificate', type: 'PDF', size: '612 KB' },
        { name: 'Insurance Certificate', type: 'PDF', size: '289 KB' },
        { name: 'Bank Letterhead', type: 'PDF', size: '524 KB' }
      ],
      agreements: [
        { name: 'Non-Disclosure Agreement', description: 'Confidentiality terms', signed: true },
        { name: 'Supplier Quality Agreement', description: 'Quality standards', signed: true },
        { name: '4M Agreement', description: 'Manufacturing terms', signed: true },
        { name: 'Code of Conduct', description: 'Ethical guidelines', signed: true }
      ],
      history: [
        {
          action: 'Application Submitted',
          description: 'Vendor completed registration form',
          user: 'System',
          role: 'System',
          timestamp: '18/01/2025 02:20 PM'
        },
        {
          action: 'Level 1 Approved',
          description: 'First level approval completed',
          user: 'Amit Sharma',
          role: 'Level 1 Approver',
          timestamp: '19/01/2025 09:45 AM'
        }
      ]
    },
    {
      id: 'APP003',
      companyName: 'Precision Engineering Ltd',
      contactPerson: 'Michael Chen',
      email: 'michael.chen@precision.com',
      phone: '+65 9876 5432',
      country: 'Singapore',
      category: 'Equipment',
      supplierType: 'SME',
      businessVertical: 'Amber Enterprises India Limited',
      status: 'pending_level_1',
      urgency: 'low',
      submissionDate: '2025-01-22T09:15:00Z',
      documentsCompleted: 6,
      totalDocuments: 8,
      hasNewDocuments: false,
      hasComments: true,
      commentCount: 1,
      registeredAddress: '12 Marina Bay Street, Singapore 018982',
      supplyAddress: '12 Marina Bay Street, Singapore 018982',
      bankDetails: {
        bankName: 'DBS Bank',
        accountNumber: 'SG987654321098',
        accountType: 'Corporate Account',
        ifscCode: 'DBSSSGSGXXX',
        branch: 'Marina Bay Branch',
        currency: 'SGD',
        proofDocument: 'bank_statement.pdf'
      },
      documents: [
        { name: 'Company Registration', type: 'PDF', size: '345 KB' },
        { name: 'Tax Registration', type: 'PDF', size: '412 KB' },
        { name: 'Quality Certificates', type: 'PDF', size: '689 KB' }
      ],
      agreements: [
        { name: 'Non-Disclosure Agreement', description: 'Confidentiality terms', signed: true },
        { name: 'Supplier Quality Agreement', description: 'Quality standards', signed: false },
        { name: '4M Agreement', description: 'Manufacturing terms', signed: false },
        { name: 'Code of Conduct', description: 'Ethical guidelines', signed: true }
      ],
      history: [
        {
          action: 'Application Submitted',
          description: 'Vendor completed registration form',
          user: 'System',
          role: 'System',
          timestamp: '22/01/2025 09:15 AM'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(mockApplications);
      setFilteredApplications(mockApplications);
      
      // Calculate stats
      const pendingLevel1 = mockApplications.filter(app => app.status === 'pending_level_1').length;
      const pendingLevel2 = mockApplications.filter(app => app.status === 'pending_level_2').length;
      const approvedToday = 5; // Mock data
      const rejectedWeek = 2; // Mock data
      
      setStats({
        pendingLevel1,
        pendingLevel2,
        approvedToday,
        rejectedWeek
      });
      
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...applications];

    if (filters.search) {
      filtered = filtered.filter(app =>
        app.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.urgency) {
      filtered = filtered.filter(app => app.urgency === filters.urgency);
    }

    if (filters.category) {
      filtered = filtered.filter(app => app.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.country) {
      filtered = filtered.filter(app => app.country === filters.country);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'submission_date_asc':
          return new Date(a.submissionDate) - new Date(b.submissionDate);
        case 'submission_date_desc':
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        case 'urgency_desc':
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'company_name_asc':
          return a.companyName.localeCompare(b.companyName);
        case 'company_name_desc':
          return b.companyName.localeCompare(a.companyName);
        default:
          return new Date(b.submissionDate) - new Date(a.submissionDate);
      }
    });

    setFilteredApplications(filtered);
  }, [applications, filters]);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowReviewPanel(true);
  };

  const handleQuickAction = async (application, action) => {
    if (action === 'approve') {
      // Quick approve logic
      console.log('Quick approving:', application.id);
      // In real app, this would call an API
    }
  };

  const handleApprove = async (applicationId, remarks) => {
    console.log('Approving application:', applicationId, 'with remarks:', remarks);
    // Update application status
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: app.status === 'pending_level_1' ? 'pending_level_2' : 'approved' }
        : app
    ));
  };

  const handleReject = async (applicationId, reason, customReason, remarks) => {
    console.log('Rejecting application:', applicationId, 'reason:', reason, 'remarks:', remarks);
    // Update application status
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected' }
        : app
    ));
  };

  const handleRequestChanges = async (applicationId, remarks) => {
    console.log('Requesting changes for application:', applicationId, 'remarks:', remarks);
    // In real app, this would send notification to vendor
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-60">
            <div className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-text-secondary">Loading approval workflow...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-60">
          <div className="p-6">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Vendor Approval Workflow</h1>
                <p className="text-text-secondary">
                  Review and process vendor applications through the approval pipeline
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/vendor-master-list')}
                >
                  <Icon name="List" size={16} className="mr-2" />
                  View All Vendors
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/public-vendor-registration-form')}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
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
                  <Icon name="FileX" size={48} className="text-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Applications Found</h3>
                  <p className="text-text-secondary mb-4">
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
                    <p className="text-sm text-text-secondary">
                      Showing {filteredApplications.length} of {applications.length} applications
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        onViewDetails={handleViewDetails}
                        onQuickAction={handleQuickAction}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
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