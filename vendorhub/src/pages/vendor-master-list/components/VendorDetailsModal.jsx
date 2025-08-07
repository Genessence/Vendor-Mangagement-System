import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VendorDetailsModal = ({ vendor, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !vendor) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Building2' },
    { id: 'contact', label: 'Contact', icon: 'Phone' },
    { id: 'business', label: 'Business', icon: 'Briefcase' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
      inactive: { bg: 'bg-muted', text: 'text-text-secondary', label: 'Inactive' },
      rejected: { bg: 'bg-error/10', text: 'text-error', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Company Name</label>
                  <div className="text-lg font-semibold text-foreground mt-1">{vendor.company_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Vendor Code</label>
                  <div className="font-mono text-primary font-medium mt-1">{vendor.vendor_code || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Status</label>
                  <div className="mt-1">{getStatusBadge(vendor.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Registration Date</label>
                  <div className="text-foreground mt-1">{formatDate(vendor.created_at)}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Category</label>
                  <div className="text-foreground mt-1">{vendor.supplier_category || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Vendor Type</label>
                  <div className="text-foreground mt-1 capitalize">{vendor.supplier_type?.replace('_', ' ') || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Country</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-foreground">{vendor.country_origin || 'N/A'}</span>
                    {vendor.msme_status === 'msme' && (
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-medium">
                        MSME
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Annual Turnover</label>
                  <div className="text-foreground font-medium mt-1">{formatCurrency(vendor.annual_turnover || 0)}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Contact Person</label>
                  <div className="text-foreground mt-1">{vendor.contact_person_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Email Address</label>
                  <div className="text-foreground mt-1">
                    <a href={`mailto:${vendor.email || ''}`} className="text-primary hover:underline">
                      {vendor.email || 'N/A'}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                  <div className="text-foreground mt-1">
                    <a href={`tel:${vendor.phone || ''}`} className="text-primary hover:underline">
                      {vendor.phone || 'N/A'}
                    </a>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Registered Address</label>
                  <div className="text-foreground mt-1">{vendor.address || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Website</label>
                  <div className="text-foreground mt-1">
                    {vendor.website ? (
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {vendor.website}
                      </a>
                    ) : (
                      <span className="text-text-secondary">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Business Vertical</label>
                  <div className="text-foreground mt-1">{vendor.business_vertical || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">GST Number</label>
                  <div className="font-mono text-foreground mt-1">{vendor.gst_number || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">PAN Number</label>
                  <div className="font-mono text-foreground mt-1">{vendor.pan_number || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">MSME Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      vendor.msme_status === 'msme' ?'bg-accent/10 text-accent' :'bg-muted text-text-secondary'
                    }`}>
                      {vendor.msme_status === 'msme' ? 'MSME Certified' : 'Non-MSME'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Bank Name</label>
                  <div className="text-foreground mt-1">{vendor.bank_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Account Number</label>
                  <div className="font-mono text-foreground mt-1">****{vendor.account_number?.slice(-4) || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">IFSC Code</label>
                  <div className="font-mono text-foreground mt-1">{vendor.ifsc_code || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Currency</label>
                  <div className="text-foreground mt-1">{vendor.currency || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendor.documents?.map((doc, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-micro">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{doc.name || 'N/A'}</div>
                      <div className="text-sm text-text-secondary">PDF Document</div>
                      <div className="text-xs text-text-secondary mt-1">Uploaded on {formatDate(doc.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="ghost" size="sm" iconName="Eye" iconSize={14}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Download" iconSize={14}>
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              {[
                {
                  date: '2024-07-20',
                  action: 'Vendor Approved',
                  user: 'Sarah Johnson',
                  status: 'success',
                  description: 'Final approval completed. Vendor code assigned.'
                },
                {
                  date: '2024-07-18',
                  action: 'Level 2 Review',
                  user: 'Michael Chen',
                  status: 'info',
                  description: 'Documents verified and approved for final stage.'
                },
                {
                  date: '2024-07-15',
                  action: 'Level 1 Review',
                  user: 'Emily Davis',
                  status: 'info',
                  description: 'Initial review completed. Forwarded to Level 2.'
                },
                {
                  date: '2024-07-10',
                  action: 'Registration Submitted',
                  user: 'System',
                  status: 'default',
                  description: 'Vendor registration form submitted with all required documents.'
                }
              ].map((event, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    event.status === 'success' ? 'bg-success' :
                    event.status === 'info'? 'bg-primary' : 'bg-text-secondary'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-foreground">{event.action}</div>
                      <div className="text-sm text-text-secondary">{formatDate(event.date)}</div>
                    </div>
                    <div className="text-sm text-text-secondary mt-1">{event.description}</div>
                    <div className="text-xs text-text-secondary mt-1">by {event.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-200" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-200 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-lg shadow-medium w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{vendor.company_name || 'N/A'}</h2>
                <div className="text-sm text-text-secondary mt-1">
                  Vendor Code: <span className="font-mono text-primary">{vendor.vendor_code || 'N/A'}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-micro whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {renderTabContent()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="default" iconName="Edit" iconPosition="left">
                Edit Vendor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorDetailsModal;