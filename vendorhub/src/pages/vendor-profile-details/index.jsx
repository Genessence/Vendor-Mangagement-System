import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
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

const VendorProfileDetails = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [vendor, setVendor] = useState(null);

  // Mock user role - in real app this would come from auth context
  const userRole = 'Admin'; // Admin, Approver, Viewer

  // Mock vendor data collection - in real app this would be fetched from API
  const allVendors = [
    {
      id: 1,
      vendorCode: 'VND001',
      companyName: 'TechCorp Solutions Pvt Ltd',
      legalName: 'TechCorp Solutions Private Limited',
      status: 'Active',
      email: 'rajesh.kumar@techcorp.com',
      phone: '+91 98765 43210',
      alternativePhone: '+91 98765 43211',
      city: 'Gurgaon',
      state: 'Haryana',
      country: 'India',
      postalCode: '122015',
      registrationDate: '15/01/2024',
      category: 'Electronics',
      businessType: 'Private Limited Company',
      industry: 'Electronics',
      subIndustry: 'Electronics Manufacturing',
      yearEstablished: '2020',
      panNumber: 'AABCT1234C',
      gstNumber: '07AABCT1234C1Z5',
      cinNumber: 'U72200HR2020PTC123456',
      msmeNumber: 'UDYAM-HR-07-0012345',
      natureOfAssessee: 'Company',
      registeredAddress: `Plot 123, Sector 18\nGurgaon, Haryana 122015\nIndia`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '50-100',
      annualRevenue: '₹50-75 Crores',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Manufacturer',
      supplierType: 'Domestic',
      currencyCode: 'INR',
      msmeStatus: 'MSME Registered',
      contactPerson: 'Rajesh Kumar',
      designation: 'General Manager',
      website: 'https://techcorp.com',
      linkedin: 'https://linkedin.com/company/techcorp',
      creditRating: 'A+',
      paymentTerms: '30 Days',
      deliveryTerms: 'FOB Gurgaon',
      qualityRating: '4.8'
    },
    {
      id: 2,
      vendorCode: 'VND002',
      companyName: 'Global Manufacturing Inc',
      legalName: 'Global Manufacturing Incorporated',
      status: 'Active',
      email: 'john.smith@globalmanuf.com',
      phone: '+1 555 123 4567',
      alternativePhone: '+1 555 123 4568',
      city: 'Detroit',
      state: 'Michigan',
      country: 'USA',
      postalCode: '48201',
      registrationDate: '20/02/2024',
      category: 'Automotive',
      businessType: 'Corporation',
      industry: 'Automotive',
      subIndustry: 'Auto Parts Manufacturing',
      yearEstablished: '2015',
      panNumber: null,
      gstNumber: null,
      cinNumber: 'US-CORP-123456789',
      msmeNumber: null,
      natureOfAssessee: 'Corporation',
      registeredAddress: `1234 Industrial Blvd\nDetroit, MI 48201\nUSA`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '500-1000',
      annualRevenue: '$250-500 Million',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Supplier',
      supplierType: 'International',
      currencyCode: 'USD',
      msmeStatus: 'Not Applicable',
      contactPerson: 'John Smith',
      designation: 'Vice President',
      website: 'https://globalmanuf.com',
      linkedin: 'https://linkedin.com/company/globalmanuf',
      creditRating: 'AA',
      paymentTerms: '45 Days',
      deliveryTerms: 'FOB Detroit',
      qualityRating: '4.9'
    },
    {
      id: 3,
      vendorCode: 'VND003',
      companyName: 'Textile Innovations Ltd',
      legalName: 'Textile Innovations Limited',
      status: 'Pending',
      email: 'priya.sharma@textileinno.com',
      phone: '+91 87654 32109',
      alternativePhone: '+91 87654 32110',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      country: 'India',
      postalCode: '641014',
      registrationDate: '15/07/2024',
      category: 'Textiles',
      businessType: 'Private Limited Company',
      industry: 'Textiles',
      subIndustry: 'Textile Manufacturing',
      yearEstablished: '2019',
      panNumber: 'AABCT5678D',
      gstNumber: '33AABCT5678D1Z9',
      cinNumber: 'U17100TN2019PTC123456',
      msmeNumber: 'UDYAM-TN-33-0012345',
      natureOfAssessee: 'Company',
      registeredAddress: `45 Textile Park\nCoimbatore, Tamil Nadu 641014\nIndia`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '100-250',
      annualRevenue: '₹25-50 Crores',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Manufacturer',
      supplierType: 'Domestic',
      currencyCode: 'INR',
      msmeStatus: 'MSME Registered',
      contactPerson: 'Priya Sharma',
      designation: 'Managing Director',
      website: 'https://textileinno.com',
      linkedin: 'https://linkedin.com/company/textileinno',
      creditRating: 'A',
      paymentTerms: '30 Days',
      deliveryTerms: 'FOB Coimbatore',
      qualityRating: '4.6'
    },
    {
      id: 4,
      vendorCode: 'VND004',
      companyName: 'Chemical Dynamics GmbH',
      legalName: 'Chemical Dynamics Gesellschaft mit beschränkter Haftung',
      status: 'Active',
      email: 'hans.mueller@chemdyn.de',
      phone: '+49 30 12345678',
      alternativePhone: '+49 30 12345679',
      city: 'Berlin',
      state: 'Berlin',
      country: 'Germany',
      postalCode: '10115',
      registrationDate: '10/03/2024',
      category: 'Chemicals',
      businessType: 'GmbH',
      industry: 'Chemicals',
      subIndustry: 'Chemical Manufacturing',
      yearEstablished: '2012',
      panNumber: null,
      gstNumber: null,
      cinNumber: 'DE-GmbH-123456789',
      msmeNumber: null,
      natureOfAssessee: 'Company',
      registeredAddress: `Industriestraße 15\n10115 Berlin\nGermany`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '250-500',
      annualRevenue: '€180-250 Million',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Supplier',
      supplierType: 'International',
      currencyCode: 'EUR',
      msmeStatus: 'Not Applicable',
      contactPerson: 'Hans Mueller',
      designation: 'Operations Director',
      website: 'https://chemdyn.de',
      linkedin: 'https://linkedin.com/company/chemdyn',
      creditRating: 'AA-',
      paymentTerms: '60 Days',
      deliveryTerms: 'FOB Berlin',
      qualityRating: '4.7'
    },
    {
      id: 5,
      vendorCode: 'VND005',
      companyName: 'Precision Machinery Works',
      legalName: 'Precision Machinery Works Private Limited',
      status: 'Inactive',
      email: 'amit.patel@precisionmach.com',
      phone: '+91 79 2345 6789',
      alternativePhone: '+91 79 2345 6790',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      postalCode: '380015',
      registrationDate: '25/11/2023',
      category: 'Machinery',
      businessType: 'Private Limited Company',
      industry: 'Machinery',
      subIndustry: 'Precision Machinery Manufacturing',
      yearEstablished: '2017',
      panNumber: 'AABCP9876E',
      gstNumber: '24AABCP9876E1Z2',
      cinNumber: 'U29100GJ2017PTC123456',
      msmeNumber: null,
      natureOfAssessee: 'Company',
      registeredAddress: `78 Industrial Estate\nAhmedabad, Gujarat 380015\nIndia`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '100-250',
      annualRevenue: '₹75-100 Crores',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Manufacturer',
      supplierType: 'Domestic',
      currencyCode: 'INR',
      msmeStatus: 'Not Registered',
      contactPerson: 'Amit Patel',
      designation: 'CEO',
      website: 'https://precisionmach.com',
      linkedin: 'https://linkedin.com/company/precisionmach',
      creditRating: 'B+',
      paymentTerms: '45 Days',
      deliveryTerms: 'FOB Ahmedabad',
      qualityRating: '4.3'
    },
    {
      id: 6,
      vendorCode: 'VND006',
      companyName: 'Service Excellence Corp',
      legalName: 'Service Excellence Corporation Pte Ltd',
      status: 'Pending',
      email: 'lisa.wong@serviceexcel.com',
      phone: '+65 6123 4567',
      alternativePhone: '+65 6123 4568',
      city: 'Singapore',
      state: 'Singapore',
      country: 'Singapore',
      postalCode: '138567',
      registrationDate: '20/07/2024',
      category: 'Services',
      businessType: 'Private Limited',
      industry: 'Services',
      subIndustry: 'Business Services',
      yearEstablished: '2021',
      panNumber: null,
      gstNumber: null,
      cinNumber: 'SG-PTE-123456789',
      msmeNumber: null,
      natureOfAssessee: 'Company',
      registeredAddress: `123 Business Park\nSingapore 138567\nSingapore`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '25-50',
      annualRevenue: 'S$35-50 Million',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Service Provider',
      supplierType: 'International',
      currencyCode: 'SGD',
      msmeStatus: 'Not Applicable',
      contactPerson: 'Lisa Wong',
      designation: 'Regional Manager',
      website: 'https://serviceexcel.com',
      linkedin: 'https://linkedin.com/company/serviceexcel',
      creditRating: 'A-',
      paymentTerms: '30 Days',
      deliveryTerms: 'DDP Singapore',
      qualityRating: '4.5'
    },
    {
      id: 7,
      vendorCode: 'VND007',
      companyName: 'Electronics Hub India',
      legalName: 'Electronics Hub India Private Limited',
      status: 'Rejected',
      email: 'suresh.reddy@electronichub.in',
      phone: '+91 40 2345 6789',
      alternativePhone: '+91 40 2345 6790',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500081',
      registrationDate: '30/06/2024',
      category: 'Electronics',
      businessType: 'Private Limited Company',
      industry: 'Electronics',
      subIndustry: 'Electronics Distribution',
      yearEstablished: '2022',
      panNumber: 'AABCE1234F',
      gstNumber: '36AABCE1234F1Z8',
      cinNumber: 'U51900TG2022PTC123456',
      msmeNumber: 'UDYAM-TG-36-0012345',
      natureOfAssessee: 'Company',
      registeredAddress: `56 Hi-Tech City\nHyderabad, Telangana 500081\nIndia`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '10-25',
      annualRevenue: '₹15-25 Crores',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Distributor',
      supplierType: 'Domestic',
      currencyCode: 'INR',
      msmeStatus: 'MSME Registered',
      contactPerson: 'Suresh Reddy',
      designation: 'Director',
      website: 'https://electronichub.in',
      linkedin: 'https://linkedin.com/company/electronichub',
      creditRating: 'C+',
      paymentTerms: '15 Days',
      deliveryTerms: 'FOB Hyderabad',
      qualityRating: '3.8'
    },
    {
      id: 8,
      vendorCode: 'VND008',
      companyName: 'Auto Parts International',
      legalName: 'Auto Parts International Inc.',
      status: 'Active',
      email: 'michael.johnson@autoparts.com',
      phone: '+1 313 555 7890',
      alternativePhone: '+1 313 555 7891',
      city: 'Detroit',
      state: 'Michigan',
      country: 'USA',
      postalCode: '48226',
      registrationDate: '05/04/2024',
      category: 'Automotive',
      businessType: 'Corporation',
      industry: 'Automotive',
      subIndustry: 'Auto Parts Supply',
      yearEstablished: '2010',
      panNumber: null,
      gstNumber: null,
      cinNumber: 'US-CORP-987654321',
      msmeNumber: null,
      natureOfAssessee: 'Corporation',
      registeredAddress: `789 Motor City Drive\nDetroit, MI 48226\nUSA`,
      supplyAddress: `Same as Registered Address`,
      employeeCount: '250-500',
      annualRevenue: '$120-180 Million',
      businessVertical: 'Amber Enterprises India Limited',
      supplierCategory: 'Supplier',
      supplierType: 'International',
      currencyCode: 'USD',
      msmeStatus: 'Not Applicable',
      contactPerson: 'Michael Johnson',
      designation: 'Sales Director',
      website: 'https://autoparts.com',
      linkedin: 'https://linkedin.com/company/autoparts',
      creditRating: 'A+',
      paymentTerms: '30 Days',
      deliveryTerms: 'FOB Detroit',
      qualityRating: '4.6'
    }
  ];

  useEffect(() => {
    // Get vendor data from navigation state or find by ID
    let vendorData = location.state?.vendor;
    
    if (!vendorData && vendorId) {
      // Find vendor by ID from mock data
      vendorData = allVendors.find(v => v.id.toString() === vendorId.toString());
    }
    
    if (!vendorData && !vendorId) {
      // Fallback to first vendor if no ID and no state
      vendorData = allVendors[0];
    }

    setVendor(vendorData);

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [vendorId, location.state]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'company', label: 'Company Details', icon: 'Building2' },
    { id: 'bank', label: 'Bank Information', icon: 'CreditCard' },
    { id: 'documents', label: 'Documents', icon: 'FileText', badge: 15 },
    { id: 'compliance', label: 'Compliance', icon: 'Shield', badge: 2 },
    { id: 'agreements', label: 'Agreements', icon: 'FileSignature', badge: 1 },
    { id: 'activity', label: 'Activity History', icon: 'Activity' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  if (isLoading || !vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-60">
            <div className="p-6">
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-text-secondary">
                    {!vendor ? 'Vendor not found...' : 'Loading vendor profile...'}
                  </p>
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
            <Breadcrumb customItems={[
              { label: 'Home', path: '/dashboard-overview', icon: 'Home' },
              { label: 'Vendors', path: '/vendor-master-list', icon: 'Building2' },
              { label: vendor.companyName, path: `/vendor-profile-details/${vendor.id}`, icon: 'User' }
            ]} />

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

            <div className="min-h-96">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorProfileDetails;