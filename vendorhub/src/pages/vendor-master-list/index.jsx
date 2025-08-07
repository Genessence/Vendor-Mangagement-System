import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';

import Button from '../../components/ui/Button';
import VendorFilters from './components/VendorFilters';
import VendorTable from './components/VendorTable';
import BulkActions from './components/BulkActions';
import TablePagination from './components/TablePagination';
import VendorDetailsModal from './components/VendorDetailsModal';
import { API_BASE_URL } from '../../config/api';

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
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/vendors`);
        
        if (!response.ok) {
          if (response.status === 401) {
            // Handle authentication error
            setError('Authentication required. Please log in.');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setVendors(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Filter and sort vendors
  const filteredAndSortedVendors = useMemo(() => {
    if (!vendors || vendors.length === 0) return [];
    
    let filtered = vendors.filter(vendor => {
      const matchesSearch = !filters.search || 
        vendor.company_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.vendor_code?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.contact_person_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || vendor.status === filters.status;
      const matchesType = !filters.vendorType || vendor.supplier_type === filters.vendorType;
      const matchesCountry = !filters.country || vendor.country_origin?.toLowerCase() === filters.country.toLowerCase();
      const matchesCategory = !filters.category || vendor.supplier_category?.toLowerCase() === filters.category.toLowerCase();
      const matchesMsme = !filters.msmeStatus || vendor.msme_status === filters.msmeStatus;
      const matchesCode = !filters.vendorCode || vendor.vendor_code?.toLowerCase().includes(filters.vendorCode.toLowerCase());
      
      const matchesDateFrom = !filters.dateFrom || new Date(vendor.created_at) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || new Date(vendor.created_at) <= new Date(filters.dateTo);
      
      const matchesTurnoverMin = !filters.turnoverMin || (vendor.annual_turnover && vendor.annual_turnover >= parseInt(filters.turnoverMin));
      const matchesTurnoverMax = !filters.turnoverMax || (vendor.annual_turnover && vendor.annual_turnover <= parseInt(filters.turnoverMax));

      return matchesSearch && matchesStatus && matchesType && matchesCountry && 
             matchesCategory && matchesMsme && matchesCode && matchesDateFrom && 
             matchesDateTo && matchesTurnoverMin && matchesTurnoverMax;
    });

    // Sort vendors
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'created_at') {
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
  }, [vendors, filters, sortConfig]);

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
      setSelectedVendors(prev => [...prev, vendorId]);
    } else {
      setSelectedVendors(prev => prev.filter(id => id !== vendorId));
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
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleViewVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor) => {
    navigate(`/vendor-profile-details/${vendor.id}`);
  };

  const handleExportVendor = (vendor) => {
    // Export single vendor data
    const dataStr = JSON.stringify(vendor, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vendor-${vendor.vendor_code}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkExport = (format) => {
    const selectedVendorData = vendors.filter(vendor => selectedVendors.includes(vendor.id));
    
    if (format === 'json') {
      const dataStr = JSON.stringify(selectedVendorData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vendors-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleBulkStatusUpdate = (status) => {
    // TODO: Implement bulk status update API call
    console.log('Bulk status update:', status, selectedVendors);
  };

  const handleImportVendors = (file) => {
    // TODO: Implement vendor import functionality
    console.log('Import vendors from file:', file);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading vendors...</p>
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
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 text-xl mb-4">⚠️</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
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
                { label: 'Vendor Master List', path: '/vendor-master-list' }
              ]} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Vendor Master List</h1>
                  <p className="text-gray-600 mt-1">
                    Manage and view all registered vendors ({totalItems} total)
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => navigate('/public-vendor-registration-form')}>
                    Add New Vendor
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/vendor-approval-workflow')}>
                    Approval Workflow
                  </Button>
                </div>
              </div>

              <VendorFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {selectedVendors.length > 0 && (
              <BulkActions 
                selectedCount={selectedVendors.length}
                onExport={handleBulkExport}
                onStatusUpdate={handleBulkStatusUpdate}
                onImport={handleImportVendors}
              />
            )}

            <VendorTable 
              vendors={paginatedVendors}
              selectedVendors={selectedVendors}
              sortConfig={sortConfig}
              onVendorSelect={handleVendorSelect}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              onViewVendor={handleViewVendor}
              onEditVendor={handleEditVendor}
              onExportVendor={handleExportVendor}
            />

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
      </div>

      {selectedVendor && (
        <VendorDetailsModal 
          vendor={selectedVendor}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVendor(null);
          }}
        />
      )}
    </div>
  );
};

export default VendorMasterList;