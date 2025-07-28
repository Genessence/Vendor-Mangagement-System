import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';

import Button from '../../components/ui/Button';
import VendorFilters from './components/VendorFilters';
import VendorTable from './components/VendorTable';
import BulkActions from './components/BulkActions';
import TablePagination from './components/TablePagination';
import VendorDetailsModal from './components/VendorDetailsModal';

const VendorMasterList = () => {
  const navigate = useNavigate();
  
  // State management
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    vendorType: '',
    country: '',
    category: '',
    msmeStatus: '',
    vendorCode: '',
    dateFrom: '',
    dateTo: '',
    turnoverMin: '',
    turnoverMax: ''
  });
  
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'registrationDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock vendor data
  const mockVendors = [
    {
      id: 1,
      vendorCode: 'VND001',
      companyName: 'TechCorp Solutions Pvt Ltd',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh.kumar@techcorp.com',
      phone: '+91 98765 43210',
      address: 'Plot 123, Sector 18, Gurgaon, Haryana 122015',
      website: 'https://techcorp.com',
      category: 'Electronics',
      vendorType: 'manufacturer',
      country: 'India',
      status: 'active',
      msmeStatus: 'msme',
      registrationDate: '2024-01-15',
      approvalStage: 'approved',
      annualTurnover: 50000000,
      gstNumber: '07AABCT1234C1Z5',
      panNumber: 'AABCT1234C',
      bankName: 'HDFC Bank',
      accountNumber: '50100123456789',
      ifscCode: 'HDFC0001234',
      currency: 'INR',
      documents: ['GST Certificate', 'PAN Card', 'Bank Statement', 'MSME Certificate']
    },
    {
      id: 2,
      vendorCode: 'VND002',
      companyName: 'Global Manufacturing Inc',
      contactPerson: 'John Smith',
      email: 'john.smith@globalmanuf.com',
      phone: '+1 555 123 4567',
      address: '1234 Industrial Blvd, Detroit, MI 48201, USA',
      website: 'https://globalmanuf.com',
      category: 'Automotive',
      vendorType: 'supplier',
      country: 'USA',
      status: 'active',
      msmeStatus: 'non_msme',
      registrationDate: '2024-02-20',
      approvalStage: 'approved',
      annualTurnover: 250000000,
      gstNumber: null,
      panNumber: null,
      bankName: 'Chase Bank',
      accountNumber: '12345678901234',
      ifscCode: 'CHASUS33',
      currency: 'USD',
      documents: ['Tax Certificate', 'Bank Letterhead', 'Company Registration']
    },
    {
      id: 3,
      vendorCode: 'VND003',
      companyName: 'Textile Innovations Ltd',
      contactPerson: 'Priya Sharma',
      email: 'priya.sharma@textileinno.com',
      phone: '+91 87654 32109',
      address: '45 Textile Park, Coimbatore, Tamil Nadu 641014',
      website: 'https://textileinno.com',
      category: 'Textiles',
      vendorType: 'manufacturer',
      country: 'India',
      status: 'pending',
      msmeStatus: 'msme',
      registrationDate: '2024-07-15',
      approvalStage: 'level_2',
      annualTurnover: 25000000,
      gstNumber: '33AABCT5678D1Z9',
      panNumber: 'AABCT5678D',
      bankName: 'State Bank of India',
      accountNumber: '30123456789012',
      ifscCode: 'SBIN0001234',
      currency: 'INR',
      documents: ['GST Certificate', 'PAN Card', 'MSME Certificate', 'Quality Certificate']
    },
    {
      id: 4,
      vendorCode: 'VND004',
      companyName: 'Chemical Dynamics GmbH',
      contactPerson: 'Hans Mueller',
      email: 'hans.mueller@chemdyn.de',
      phone: '+49 30 12345678',
      address: 'Industriestraße 15, 10115 Berlin, Germany',
      website: 'https://chemdyn.de',
      category: 'Chemicals',
      vendorType: 'supplier',
      country: 'Germany',
      status: 'active',
      msmeStatus: 'non_msme',
      registrationDate: '2024-03-10',
      approvalStage: 'approved',
      annualTurnover: 180000000,
      gstNumber: null,
      panNumber: null,
      bankName: 'Deutsche Bank',
      accountNumber: 'DE89370400440532013000',
      ifscCode: 'DEUTDEFF',
      currency: 'EUR',
      documents: ['VAT Certificate', 'Bank Confirmation', 'ISO Certificate']
    },
    {
      id: 5,
      vendorCode: 'VND005',
      companyName: 'Precision Machinery Works',
      contactPerson: 'Amit Patel',
      email: 'amit.patel@precisionmach.com',
      phone: '+91 79 2345 6789',
      address: '78 Industrial Estate, Ahmedabad, Gujarat 380015',
      website: 'https://precisionmach.com',
      category: 'Machinery',
      vendorType: 'manufacturer',
      country: 'India',
      status: 'inactive',
      msmeStatus: 'non_msme',
      registrationDate: '2023-11-25',
      approvalStage: 'approved',
      annualTurnover: 75000000,
      gstNumber: '24AABCP9876E1Z2',
      panNumber: 'AABCP9876E',
      bankName: 'ICICI Bank',
      accountNumber: '123456789012345',
      ifscCode: 'ICIC0001234',
      currency: 'INR',
      documents: ['GST Certificate', 'PAN Card', 'Factory License', 'Quality Certificate']
    },
    {
      id: 6,
      vendorCode: 'VND006',
      companyName: 'Service Excellence Corp',
      contactPerson: 'Lisa Wong',
      email: 'lisa.wong@serviceexcel.com',
      phone: '+65 6123 4567',
      address: '123 Business Park, Singapore 138567',
      website: 'https://serviceexcel.com',
      category: 'Services',
      vendorType: 'service_provider',
      country: 'Singapore',
      status: 'pending',
      msmeStatus: 'non_msme',
      registrationDate: '2024-07-20',
      approvalStage: 'level_1',
      annualTurnover: 35000000,
      gstNumber: null,
      panNumber: null,
      bankName: 'DBS Bank',
      accountNumber: '1234567890',
      ifscCode: 'DBSSSG0001',
      currency: 'SGD',
      documents: ['Business Registration', 'Tax Certificate', 'Service Agreement']
    },
    {
      id: 7,
      vendorCode: 'VND007',
      companyName: 'Electronics Hub India',
      contactPerson: 'Suresh Reddy',
      email: 'suresh.reddy@electronichub.in',
      phone: '+91 40 2345 6789',
      address: '56 Hi-Tech City, Hyderabad, Telangana 500081',
      website: 'https://electronichub.in',
      category: 'Electronics',
      vendorType: 'distributor',
      country: 'India',
      status: 'rejected',
      msmeStatus: 'msme',
      registrationDate: '2024-06-30',
      approvalStage: 'rejected',
      annualTurnover: 15000000,
      gstNumber: '36AABCE1234F1Z8',
      panNumber: 'AABCE1234F',
      bankName: 'Axis Bank',
      accountNumber: '987654321098765',
      ifscCode: 'UTIB0001234',
      currency: 'INR',
      documents: ['GST Certificate', 'PAN Card', 'MSME Certificate']
    },
    {
      id: 8,
      vendorCode: 'VND008',
      companyName: 'Auto Parts International',
      contactPerson: 'Michael Johnson',
      email: 'michael.johnson@autoparts.com',
      phone: '+1 313 555 7890',
      address: '789 Motor City Drive, Detroit, MI 48226, USA',
      website: 'https://autoparts.com',
      category: 'Automotive',
      vendorType: 'supplier',
      country: 'USA',
      status: 'active',
      msmeStatus: 'non_msme',
      registrationDate: '2024-04-05',
      approvalStage: 'approved',
      annualTurnover: 120000000,
      gstNumber: null,
      panNumber: null,
      bankName: 'Bank of America',
      accountNumber: '1234567890123456',
      ifscCode: 'BOFAUS3N',
      currency: 'USD',
      documents: ['Tax ID Certificate', 'Bank Statement', 'Quality Certification']
    }
  ];

  // Filter and sort vendors
  const filteredAndSortedVendors = useMemo(() => {
    let filtered = mockVendors.filter(vendor => {
      const matchesSearch = !filters.search || 
        vendor.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.vendorCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || vendor.status === filters.status;
      const matchesType = !filters.vendorType || vendor.vendorType === filters.vendorType;
      const matchesCountry = !filters.country || vendor.country.toLowerCase() === filters.country.toLowerCase();
      const matchesCategory = !filters.category || vendor.category.toLowerCase() === filters.category.toLowerCase();
      const matchesMsme = !filters.msmeStatus || vendor.msmeStatus === filters.msmeStatus;
      const matchesCode = !filters.vendorCode || vendor.vendorCode.toLowerCase().includes(filters.vendorCode.toLowerCase());
      
      const matchesDateFrom = !filters.dateFrom || new Date(vendor.registrationDate) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(vendor.registrationDate) <= new Date(filters.dateTo);
      
      const matchesTurnoverMin = !filters.turnoverMin || vendor.annualTurnover >= parseInt(filters.turnoverMin);
      const matchesTurnoverMax = !filters.turnoverMax || vendor.annualTurnover <= parseInt(filters.turnoverMax);

      return matchesSearch && matchesStatus && matchesType && matchesCountry && 
             matchesCategory && matchesMsme && matchesCode && matchesDateFrom && 
             matchesDateTo && matchesTurnoverMin && matchesTurnoverMax;
    });

    // Sort vendors
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'registrationDate') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [filters, sortConfig]);

  // Pagination
  const totalItems = filteredAndSortedVendors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredAndSortedVendors.slice(startIndex, startIndex + itemsPerPage);

  // Event handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      vendorType: '',
      country: '',
      category: '',
      msmeStatus: '',
      vendorCode: '',
      dateFrom: '',
      dateTo: '',
      turnoverMin: '',
      turnoverMax: ''
    });
    setCurrentPage(1);
  };

  const handleVendorSelect = (vendorId, isSelected) => {
    if (isSelected) {
      setSelectedVendors([...selectedVendors, vendorId]);
    } else {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedVendors(paginatedVendors.map(vendor => vendor.id));
    } else {
      setSelectedVendors([]);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor) => {
    navigate('/vendor-profile-details', { state: { vendor } });
  };

  const handleExportVendor = (vendor) => {
    // Mock export functionality
    console.log('Exporting vendor:', vendor.vendorCode);
    // In real app, this would trigger a download
  };

  const handleBulkExport = (format) => {
    console.log(`Bulk exporting ${selectedVendors.length} vendors as ${format}`);
    // Mock bulk export
  };

  const handleBulkStatusUpdate = (status) => {
    console.log(`Updating ${selectedVendors.length} vendors to status: ${status}`);
    // Mock bulk status update
    setSelectedVendors([]);
  };

  const handleImportVendors = (file) => {
    console.log('Importing vendors from file:', file.name);
    // Mock import functionality
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedVendors([]);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedVendors([]);
  };

  // Clear selection when filters change
  useEffect(() => {
    setSelectedVendors([]);
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-60 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Vendor Master List</h1>
                <p className="text-text-secondary mt-1">
                  Manage and view all registered vendors with comprehensive filtering and search capabilities
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => navigate('/vendor-approval-workflow')}
                  iconName="Clock"
                  iconPosition="left"
                  iconSize={16}
                >
                  Pending Approvals
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/public-vendor-registration-form')}
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add Vendor
                </Button>
              </div>
            </div>

            {/* Filters */}
            <VendorFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            {/* Bulk Actions */}
            <BulkActions
              selectedCount={selectedVendors.length}
              onBulkExport={handleBulkExport}
              onBulkStatusUpdate={handleBulkStatusUpdate}
              onImportVendors={handleImportVendors}
            />

            {/* Vendor Table */}
            <VendorTable
              vendors={paginatedVendors}
              selectedVendors={selectedVendors}
              onVendorSelect={handleVendorSelect}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              sortConfig={sortConfig}
              onViewVendor={handleViewVendor}
              onEditVendor={handleEditVendor}
              onExportVendor={handleExportVendor}
            />

            {/* Pagination */}
            <div className="mt-6">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Vendor Details Modal */}
      <VendorDetailsModal
        vendor={selectedVendor}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVendor(null);
        }}
      />
    </div>
  );
};

export default VendorMasterList;