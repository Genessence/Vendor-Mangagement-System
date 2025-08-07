import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import VendorHeader from './components/VendorHeader';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import CompanyDetailsTab from './components/CompanyDetailsTab';
import BankInformationTab from './components/BankInformationTab';
import DocumentsTab from './components/DocumentsTab';
import ComplianceTab from './components/ComplianceTab';
import AgreementsTab from './components/AgreementsTab';
import ActivityHistoryTab from './components/ActivityHistoryTab';
import { API_BASE_URL } from '../../config/api';

const VendorProfileDetails = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user role - in real app this would come from auth context
  const userRole = 'Admin'; // Admin, Approver, Viewer

  // Fetch vendor data from API
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication required. Please log in.');
            return;
          }
          if (response.status === 404) {
            setError('Vendor not found.');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setVendor(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        setError('Failed to load vendor data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'company', label: 'Company Details', icon: 'Building2' },
    { id: 'bank', label: 'Bank Information', icon: 'CreditCard' },
    { id: 'documents', label: 'Documents', icon: 'FileText', badge: vendor?.document_count || 0 },
    { id: 'compliance', label: 'Compliance', icon: 'Shield', badge: vendor?.compliance_count || 0 },
    { id: 'agreements', label: 'Agreements', icon: 'FileSignature', badge: vendor?.agreement_count || 0 },
    { id: 'activity', label: 'Activity History', icon: 'Activity' }
  ];

  const handleEdit = () => {
    // Handle edit profile
    console.log('Edit profile clicked');
  };

  const handleStatusChange = () => {
    // Handle status change
    console.log('Status change clicked');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab vendor={vendor} />;
      case 'company':
        return <CompanyDetailsTab vendor={vendor} userRole={userRole} />;
      case 'bank':
        return <BankInformationTab vendor={vendor} />;
      case 'documents':
        return <DocumentsTab vendor={vendor} userRole={userRole} />;
      case 'compliance':
        return <ComplianceTab vendor={vendor} />;
      case 'agreements':
        return <AgreementsTab vendor={vendor} />;
      case 'activity':
        return <ActivityHistoryTab vendor={vendor} />;
      default:
        return <OverviewTab vendor={vendor} />;
    }
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
                <p className="text-gray-600">Loading vendor profile...</p>
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

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="text-gray-600 text-xl mb-4">📋</div>
                <p className="text-gray-600">Vendor not found...</p>
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
                { label: 'Vendors', path: '/vendor-master-list' },
                { label: vendor.company_name || 'Vendor Details', path: `/vendor-profile-details/${vendor.id}` }
              ]} 
            />
          </div>

          <VendorHeader 
            vendor={vendor}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
            userRole={userRole}
          />

          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          <div className="min-h-96 mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileDetails;