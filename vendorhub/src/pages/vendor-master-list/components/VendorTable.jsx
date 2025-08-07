import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const VendorTable = ({ 
  vendors, 
  selectedVendors, 
  onVendorSelect, 
  onSelectAll, 
  onSort, 
  sortConfig,
  onViewVendor,
  onEditVendor,
  onExportVendor
}) => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (vendorId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(vendorId)) {
      newExpanded.delete(vendorId);
    } else {
      newExpanded.add(vendorId);
    }
    setExpandedRows(newExpanded);
  };

  const handleVendorClick = (vendor) => {
    navigate(`/vendor-profile-details/${vendor.id}`, { state: { vendor } });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
      inactive: { bg: 'bg-muted', text: 'text-text-secondary', label: 'Inactive' },
      rejected: { bg: 'bg-error/10', text: 'text-error', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getApprovalStageBadge = (stage) => {
    const stageConfig = {
      'level_1': { bg: 'bg-accent/10', text: 'text-accent', label: 'Level 1' },
      'level_2': { bg: 'bg-primary/10', text: 'text-primary', label: 'Level 2' },
      'approved': { bg: 'bg-success/10', text: 'text-success', label: 'Approved' },
      'rejected': { bg: 'bg-error/10', text: 'text-error', label: 'Rejected' }
    };

    const config = stageConfig[stage] || stageConfig.level_1;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedVendors.length === vendors.length && vendors.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('vendor_code')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Vendor Code</span>
                  {getSortIcon('vendor_code')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('company_name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Company Name</span>
                  {getSortIcon('company_name')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('supplier_category')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Category</span>
                  {getSortIcon('supplier_category')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('country_origin')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Country</span>
                  {getSortIcon('country_origin')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('created_at')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-micro"
                >
                  <span>Registration Date</span>
                  {getSortIcon('created_at')}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Approval Stage</span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <React.Fragment key={vendor.id}>
                <tr className="border-b border-border hover:bg-muted/50 transition-micro">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={(e) => onVendorSelect(vendor.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-medium text-primary">
                        {vendor.vendor_code}
                      </span>
                      <button
                        onClick={() => toggleRowExpansion(vendor.id)}
                        className="text-text-secondary hover:text-foreground transition-micro"
                      >
                        <Icon 
                          name={expandedRows.has(vendor.id) ? "ChevronDown" : "ChevronRight"} 
                          size={16} 
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div 
                        className="font-medium text-foreground hover:text-primary cursor-pointer transition-micro"
                        onClick={() => handleVendorClick(vendor)}
                      >
                        {vendor.company_name}
                      </div>
                      <div className="text-sm text-text-secondary">{vendor.contact_person_name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{vendor.supplier_category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-foreground">{vendor.country_origin}</span>
                      {vendor.msme_status === 'msme' && (
                        <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-medium">
                          MSME
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(vendor.status)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">
                      {formatDate(vendor.created_at)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getApprovalStageBadge(vendor.approvalStage)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewVendor(vendor)}
                        className="h-8 w-8"
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditVendor(vendor)}
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onExportVendor(vendor)}
                        className="h-8 w-8"
                      >
                        <Icon name="Download" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows.has(vendor.id) && (
                  <tr className="bg-muted/30">
                    <td colSpan="9" className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm text-text-secondary">
                            <div>Email: {vendor.email}</div>
                            <div>Phone: {vendor.phone_number}</div>
                            <div>Address: {vendor.registered_address}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Business Details</h4>
                          <div className="space-y-1 text-sm text-text-secondary">
                            <div>Type: {vendor.supplier_type}</div>
                            <div>Turnover: {formatCurrency(vendor.annual_turnover || 0)}</div>
                            <div>GST: {vendor.gst_number || 'N/A'}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Documents</h4>
                          <div className="flex flex-wrap gap-2">
                            {vendor.documents.map((doc, index) => (
                              <span
                                key={index}
                                className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="border-b border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={(e) => onVendorSelect(vendor.id, e.target.checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div 
                    className="font-medium text-foreground hover:text-primary cursor-pointer transition-micro"
                    onClick={() => handleVendorClick(vendor)}
                  >
                    {vendor.companyName}
                  </div>
                  <div className="text-sm text-text-secondary">{vendor.contactPerson}</div>
                  <div className="font-mono text-sm text-primary mt-1">{vendor.vendorCode}</div>
                </div>
              </div>
              <button
                onClick={() => toggleRowExpansion(vendor.id)}
                className="text-text-secondary hover:text-foreground transition-micro p-1"
              >
                <Icon 
                  name={expandedRows.has(vendor.id) ? "ChevronDown" : "ChevronRight"} 
                  size={20} 
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-text-secondary mb-1">Category</div>
                <div className="text-sm text-foreground">{vendor.category}</div>
              </div>
              <div>
                <div className="text-xs text-text-secondary mb-1">Country</div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-foreground">{vendor.country}</span>
                  {vendor.msmeStatus === 'msme' && (
                    <span className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-medium">
                      MSME
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusBadge(vendor.status)}
                {getApprovalStageBadge(vendor.approvalStage)}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewVendor(vendor)}
                  className="h-8 w-8"
                >
                  <Icon name="Eye" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditVendor(vendor)}
                  className="h-8 w-8"
                >
                  <Icon name="Edit" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onExportVendor(vendor)}
                  className="h-8 w-8"
                >
                  <Icon name="Download" size={14} />
                </Button>
              </div>
            </div>

            {/* Mobile Expanded Details */}
            {expandedRows.has(vendor.id) && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm text-text-secondary">
                      <div>Email: {vendor.email}</div>
                      <div>Phone: {vendor.phone}</div>
                      <div>Address: {vendor.address}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Business Details</h4>
                    <div className="space-y-1 text-sm text-text-secondary">
                      <div>Type: {vendor.vendorType}</div>
                      <div>Turnover: {formatCurrency(vendor.annualTurnover)}</div>
                      <div>Registration: {formatDate(vendor.registrationDate)}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {vendor.documents.map((doc, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorTable;