import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VendorHeader = ({ vendor, onEdit, onStatusChange, userRole }) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-error text-error-foreground';
      case 'suspended':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  // Export functionality
  const handleExportData = async (format) => {
    try {
      setShowExportDropdown(false);
      
      let endpoint = '';
      let filename = '';
      
      if (format === 'pdf') {
        endpoint = `http://localhost:8000/api/v1/vendors/${vendor.id}/export/pdf`;
        filename = `vendor_${vendor.vendorCode}_export_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (format === 'excel') {
        endpoint = `http://localhost:8000/api/v1/vendors/${vendor.id}/export/excel`;
        filename = `vendor_${vendor.vendorCode}_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      }

      // Call backend API to generate file
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      // Get the file blob
      const fileBlob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message (you can replace this with a toast notification)
      console.log(`${format.toUpperCase()} export completed successfully`);
      
    } catch (error) {
      console.error('Export failed:', error);
      
      // Fallback to JSON export if backend export fails
      try {
        console.log('Falling back to JSON export...');
        const exportData = {
          vendorInfo: {
            id: vendor.id,
            vendorCode: vendor.vendorCode,
            companyName: vendor.companyName,
            legalName: vendor.legalName,
            status: vendor.status,
            email: vendor.email,
            phone: vendor.phone,
            alternativePhone: vendor.alternativePhone,
            city: vendor.city,
            state: vendor.state,
            country: vendor.country,
            postalCode: vendor.postalCode,
            registrationDate: vendor.registrationDate,
            category: vendor.category,
            businessType: vendor.businessType,
            industry: vendor.industry,
            subIndustry: vendor.subIndustry,
            yearEstablished: vendor.yearEstablished,
            panNumber: vendor.panNumber,
            gstNumber: vendor.gstNumber,
            cinNumber: vendor.cinNumber,
            msmeNumber: vendor.msmeNumber,
            natureOfAssessee: vendor.natureOfAssessee,
            registeredAddress: vendor.registeredAddress,
            supplyAddress: vendor.supplyAddress,
            employeeCount: vendor.employeeCount,
            annualRevenue: vendor.annualRevenue,
            businessVertical: vendor.businessVertical,
            supplierCategory: vendor.supplierCategory,
            supplierType: vendor.supplierType,
            currencyCode: vendor.currencyCode,
            msmeStatus: vendor.msmeStatus,
            contactPerson: vendor.contactPerson,
            designation: vendor.designation,
            website: vendor.website,
            linkedin: vendor.linkedin,
            creditRating: vendor.creditRating,
            paymentTerms: vendor.paymentTerms,
            deliveryTerms: vendor.deliveryTerms,
            qualityRating: vendor.qualityRating
          },
          exportDate: new Date().toISOString(),
          exportedBy: userRole
        };

        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${vendor.vendorCode}_${vendor.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log('JSON export completed successfully');
      } catch (jsonError) {
        console.error('JSON export also failed:', jsonError);
        // Show error message (you can replace this with a toast notification)
      }
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6 shadow-subtle">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Vendor Basic Info */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Building2" size={32} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-semibold text-foreground truncate">
                {vendor.companyName}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendor.status)}`}>
                {vendor.status}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Hash" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Vendor Code:</span>
                <span className="font-medium text-foreground">{vendor.vendorCode}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Email:</span>
                <span className="font-medium text-foreground truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Phone:</span>
                <span className="font-medium text-foreground">{vendor.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Location:</span>
                <span className="font-medium text-foreground">{vendor.city}, {vendor.country}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Registered:</span>
                <span className="font-medium text-foreground">{vendor.registrationDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Tag" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Category:</span>
                <span className="font-medium text-foreground">{vendor.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-auto">
          {(userRole === 'Admin' || userRole === 'Approver') && (
            <>
              <Button
                variant="default"
                iconName="Edit"
                iconPosition="left"
                onClick={onEdit}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
                onClick={onStatusChange}
                className="w-full sm:w-auto"
              >
                Change Status
              </Button>
            </>
          )}
          
          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              iconName="Download"
              iconPosition="left"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="w-full sm:w-auto"
            >
              Export Data
            </Button>
            
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExportData('pdf')}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground flex items-center space-x-2"
                  >
                    <Icon name="FileText" size={16} />
                    <span>Export as PDF</span>
                  </button>
                  <button
                    onClick={() => handleExportData('excel')}
                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground flex items-center space-x-2"
                  >
                    <Icon name="FileSpreadsheet" size={16} />
                    <span>Export as Excel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showExportDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowExportDropdown(false)}
        />
      )}
    </div>
  );
};

export default VendorHeader;