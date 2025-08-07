import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';

const VendorDetailsModal = ({ vendor, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [vendorDetails, setVendorDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vendor details when modal opens
  useEffect(() => {
    if (isOpen && vendor) {
      fetchVendorDetails();
      fetchDocuments();
      fetchApprovalHistory();
    }
  }, [isOpen, vendor]);

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}`);
      if (!response.ok) throw new Error('Failed to fetch vendor details');
      const data = await response.json();
      setVendorDetails(data);
    } catch (err) {
      console.error('Error fetching vendor details:', err);
      setError('Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await fetch(`${API_BASE_URL}/documents/vendor/${vendor.id}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        console.warn('Failed to fetch documents:', response.status);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const fetchApprovalHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(`${API_BASE_URL}/approvals/vendor/${vendor.id}/public`);
      if (response.ok) {
        const data = await response.json();
        setApprovalHistory(data);
      } else {
        console.warn('Failed to fetch approval history:', response.status);
      }
    } catch (err) {
      console.error('Error fetching approval history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

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
      draft: { bg: 'bg-muted', text: 'text-text-secondary', label: 'Draft' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
      under_review: { bg: 'bg-info/10', text: 'text-info', label: 'Under Review' },
      approved: { bg: 'bg-success/10', text: 'text-success', label: 'Approved' },
      rejected: { bg: 'bg-error/10', text: 'text-error', label: 'Rejected' },
      suspended: { bg: 'bg-muted', text: 'text-text-secondary', label: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCountryName = (countryCode) => {
    if (!countryCode) return 'N/A';
    
    const countries = {
      'IN': 'India', 'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada',
      'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan', 'CN': 'China',
      'BR': 'Brazil', 'MX': 'Mexico', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands'
    };
    
    return countries[countryCode.toUpperCase()] || countryCode;
  };

  const formatSupplierType = (supplierType) => {
    if (!supplierType) return 'N/A';
    
    if (typeof supplierType === 'object' && supplierType.value) {
      return supplierType.value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    if (typeof supplierType === 'string') {
      return supplierType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return 'N/A';
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-error py-8">
          <p>{error}</p>
          <Button onClick={fetchVendorDetails} className="mt-4">Retry</Button>
        </div>
      );
    }

    const vendorData = vendorDetails || vendor;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Company Name</label>
                  <div className="text-lg font-semibold text-foreground mt-1">{vendorData.company_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Vendor Code</label>
                  <div className="font-mono text-primary font-medium mt-1">{vendorData.vendor_code || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Status</label>
                  <div className="mt-1">{getStatusBadge(vendorData.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Registration Date</label>
                  <div className="text-foreground mt-1">{formatDate(vendorData.created_at)}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Category</label>
                  <div className="text-foreground mt-1">{vendorData.supplier_category || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Vendor Type</label>
                  <div className="text-foreground mt-1">{formatSupplierType(vendorData.supplier_type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Country</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-foreground">{getCountryName(vendorData.country_origin)}</span>
                    {vendorData.msme_status === 'msme' && (
                      <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-medium">
                        MSME
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Annual Turnover</label>
                  <div className="text-foreground font-medium mt-1">{formatCurrency(vendorData.annual_turnover)}</div>
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
                  <div className="text-foreground mt-1">{vendorData.contact_person_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Designation</label>
                  <div className="text-foreground mt-1">{vendorData.designation || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Email Address</label>
                  <div className="text-foreground mt-1">
                    <a href={`mailto:${vendorData.email || ''}`} className="text-primary hover:underline">
                      {vendorData.email || 'N/A'}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                  <div className="text-foreground mt-1">
                    <a href={`tel:${vendorData.phone_number || ''}`} className="text-primary hover:underline">
                      {vendorData.phone_number || 'N/A'}
                    </a>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Registered Address</label>
                  <div className="text-foreground mt-1">{vendorData.registered_address || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">City</label>
                  <div className="text-foreground mt-1">{vendorData.registered_city || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">State</label>
                  <div className="text-foreground mt-1">{vendorData.registered_state || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Website</label>
                  <div className="text-foreground mt-1">
                    {vendorData.website ? (
                      <a href={vendorData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {vendorData.website}
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
                  <div className="text-foreground mt-1">{vendorData.business_vertical || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Industry Sector</label>
                  <div className="text-foreground mt-1">{vendorData.industry_sector || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">GST Number</label>
                  <div className="font-mono text-foreground mt-1">{vendorData.gst_number || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">PAN Number</label>
                  <div className="font-mono text-foreground mt-1">{vendorData.pan_number || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">MSME Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      vendorData.msme_status === 'msme' ? 'bg-accent/10 text-accent' : 'bg-muted text-text-secondary'
                    }`}>
                      {vendorData.msme_status === 'msme' ? 'MSME Certified' : 'Non-MSME'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">MSME Category</label>
                  <div className="text-foreground mt-1">{vendorData.msme_category || 'N/A'}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Bank Name</label>
                  <div className="text-foreground mt-1">{vendorData.bank_name || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Account Number</label>
                  <div className="font-mono text-foreground mt-1">
                    {vendorData.account_number ? `****${vendorData.account_number.slice(-4)}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">IFSC Code</label>
                  <div className="font-mono text-foreground mt-1">{vendorData.ifsc_code || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Currency</label>
                  <div className="text-foreground mt-1">{vendorData.currency || vendorData.preferred_currency || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Year Established</label>
                  <div className="text-foreground mt-1">{vendorData.year_established || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Employee Count</label>
                  <div className="text-foreground mt-1">{vendorData.employee_count || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            {documentsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-micro">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="FileText" size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{doc.title || 'N/A'}</div>
                        <div className="text-sm text-text-secondary">{doc.document_type || 'Document'}</div>
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
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            {historyLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : approvalHistory.length > 0 ? (
              <div className="space-y-4">
                {approvalHistory.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      event.status === 'approved' ? 'bg-success' :
                      event.status === 'pending' ? 'bg-warning' :
                      event.status === 'rejected' ? 'bg-error' : 'bg-text-secondary'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-foreground">
                          {event.level.replace('_', ' ').toUpperCase()} Review
                        </div>
                        <div className="text-sm text-text-secondary">{formatDate(event.created_at)}</div>
                      </div>
                      <div className="text-sm text-text-secondary mt-1">
                        Status: {event.status.replace('_', ' ').toUpperCase()}
                      </div>
                      {event.comments && (
                        <div className="text-sm text-text-secondary mt-1">{event.comments}</div>
                      )}
                      {event.approved_at && (
                        <div className="text-xs text-text-secondary mt-1">
                          Approved on: {formatDate(event.approved_at)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                <Icon name="Clock" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No approval history available</p>
              </div>
            )}
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
                        ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-foreground'
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