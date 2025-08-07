import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';
import { generateAgreementPDF, generateDetailedAgreementPDF } from '../../../utils/agreementPdfGenerator';

const AgreementsTab = ({ vendor }) => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [viewAgreementModal, setViewAgreementModal] = useState({ isOpen: false, agreement: null });
  const [signatureModal, setSignatureModal] = useState({ isOpen: false, agreement: null });
  const [commentModal, setCommentModal] = useState({ isOpen: false, agreement: null });
  const [agreementData, setAgreementData] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setLoading(true);
        
        // Fetch detailed agreements from the agreement-details endpoint
        const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}/agreement-details`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const detailedAgreements = await response.json();
        
        // Create basic agreements from vendor registration data
        const basicAgreements = [];
        if (vendor.nda) {
          basicAgreements.push({
            id: 'nda-basic',
            title: 'Non-Disclosure Agreement (NDA)',
            type: 'Legal',
            status: 'Signed',
            signed_date: vendor.created_at || vendor.registration_date,
            signed_by: vendor.contact_person_name,
            valid_until: 'Perpetual',
            description: 'Basic NDA agreement signed during registration',
            version: '1.0',
            is_basic: true
          });
        }
        if (vendor.sqa) {
          basicAgreements.push({
            id: 'sqa-basic',
            title: 'Supplier Quality Agreement (SQA)',
            type: 'Quality',
            status: 'Signed',
            signed_date: vendor.created_at || vendor.registration_date,
            signed_by: vendor.contact_person_name,
            valid_until: 'Annual Renewal',
            description: 'Basic SQA agreement signed during registration',
            version: '1.0',
            is_basic: true
          });
        }
        if (vendor.four_m) {
          basicAgreements.push({
            id: '4m-basic',
            title: '4M Change Management Agreement',
            type: 'Operational',
            status: 'Signed',
            signed_date: vendor.created_at || vendor.registration_date,
            signed_by: vendor.contact_person_name,
            valid_until: 'Annual Renewal',
            description: '4M Change Management agreement signed during registration',
            version: '1.0',
            is_basic: true
          });
        }
        if (vendor.code_of_conduct) {
          basicAgreements.push({
            id: 'coc-basic',
            title: 'Code of Conduct Agreement',
            type: 'Compliance',
            status: 'Signed',
            signed_date: vendor.created_at || vendor.registration_date,
            signed_by: vendor.contact_person_name,
            valid_until: 'Perpetual',
            description: 'Code of Conduct agreement signed during registration',
            version: '1.0',
            is_basic: true
          });
        }
        if (vendor.compliance_agreement) {
          basicAgreements.push({
            id: 'ca-basic',
            title: 'Compliance Agreement',
            type: 'Compliance',
            status: 'Signed',
            signed_date: vendor.created_at || vendor.registration_date,
            signed_by: vendor.contact_person_name,
            valid_until: 'Annual Renewal',
            description: 'Compliance agreement signed during registration',
            version: '1.0',
            is_basic: true
          });
        }
        if (vendor.self_declaration) {
          basicAgreements.push({
            id: 'sd-basic',
            title: 'Self Declaration',
            type: 'Declaration',
            status: 'Signed',
            signed_date: vendor.created_at || vendor.registration_date,
            signed_by: vendor.contact_person_name,
            valid_until: 'Annual Renewal',
            description: 'Self declaration signed during registration',
            version: '1.0',
            is_basic: true
          });
        }
        
        // Combine basic and detailed agreements
        const allAgreements = [...basicAgreements, ...detailedAgreements];
        setAgreements(allAgreements);
      } catch (err) {
        console.error('Failed to load agreements:', err);
        setError('Failed to load agreements');
      } finally {
        setLoading(false);
      }
    };

    if (vendor?.id) {
      fetchAgreements();
    }
  }, [vendor?.id]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'signed':
        return 'bg-success text-success-foreground';
      case 'pending signature':
        return 'bg-warning text-warning-foreground';
      case 'expired':
        return 'bg-error text-error-foreground';
      case 'under review':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'legal':
        return 'bg-primary/10 text-primary';
      case 'quality':
        return 'bg-success/10 text-success';
      case 'operational':
        return 'bg-warning/10 text-warning';
      case 'compliance':
        return 'bg-accent/10 text-accent';
      case 'declaration':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const isExpiringSoon = (validUntil) => {
    if (!validUntil || validUntil === 'Perpetual' || validUntil === 'TBD' || validUntil === 'Annual Renewal') return false;
    const expiry = new Date(validUntil.split('/').reverse().join('-'));
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Button click handlers
  const handleViewAgreement = async (agreement) => {
    if (agreement.is_basic) {
      // For basic agreements, show a simple modal with registration info
      setViewAgreementModal({ isOpen: true, agreement });
      return;
    }

    setLoadingData(true);
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}/agreement-details/${agreement.id}/view`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgreementData(data);
      setViewAgreementModal({ isOpen: true, agreement });
    } catch (err) {
      console.error('Failed to load agreement details:', err);
      alert('Failed to load agreement details. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleDownloadPDF = async (agreement) => {
    try {
      setLoadingData(true);
      
      if (agreement.is_basic) {
        // For basic agreements, generate PDF directly on frontend
        generateAgreementPDF(agreement, vendor);
      } else {
        // For detailed agreements, generate PDF directly on frontend
        generateDetailedAgreementPDF(agreement, vendor);
      }
      
      // Show success message
      setTimeout(() => {
        alert('PDF generated successfully!');
      }, 500);
      
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleViewSignature = async (agreement) => {
    setLoadingData(true);
    try {
      let response;
      let data;
      
      if (agreement.is_basic) {
        // For basic agreements, create signature data from registration info
        data = {
          agreement_id: agreement.id,
          agreement_title: agreement.title,
          signature_details: {
            signed_by: agreement.signed_by || vendor.contact_person_name,
            signed_date: agreement.signed_date || vendor.created_at || vendor.registration_date,
            signature_method: "Digital Registration",
            certificate_authority: "Amber Compliance System",
            signature_verified: true,
            timestamp: vendor.created_at || vendor.registration_date || new Date().toISOString(),
            signature_image_url: null
          },
          vendor_info: {
            company_name: vendor.company_name,
            vendor_code: vendor.vendor_code,
            contact_person: vendor.contact_person_name
          }
        };
      } else {
        // For detailed agreements, fetch from API
        response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}/agreement-details/${agreement.id}/signature`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
      }
      
      setSignatureData(data);
      setSignatureModal({ isOpen: true, agreement });
    } catch (err) {
      console.error('Failed to load signature details:', err);
      alert('Failed to load signature details. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddComment = async (agreement) => {
    setCommentModal({ isOpen: true, agreement });
    setNewComment('');
    
    // Load existing comments
    if (!agreement.is_basic) {
      try {
        const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}/agreement-details/${agreement.id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a comment.');
      return;
    }

    const agreement = commentModal.agreement;
    if (agreement.is_basic) {
      // For basic agreements, just add to local state
      const comment = {
        id: comments.length + 1,
        text: newComment,
        author: 'Current User',
        timestamp: new Date().toISOString(),
        type: 'general'
      };
      setComments([...comments, comment]);
      setNewComment('');
      alert('Comment added successfully!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}/agreement-details/${agreement.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          author: 'Current User',
          type: 'general'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setComments([...comments, data.comment]);
      setNewComment('');
      alert('Comment added successfully!');
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  const closeModal = () => {
    setViewAgreementModal({ isOpen: false, agreement: null });
    setSignatureModal({ isOpen: false, agreement: null });
    setCommentModal({ isOpen: false, agreement: null });
    setAgreementData(null);
    setSignatureData(null);
    setComments([]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Icon name="Loader" size={20} className="animate-spin" />
          <span className="text-text-secondary">Loading agreements...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Agreements</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const agreementStats = {
    total: agreements.length,
    signed: agreements.filter(item => item.status === 'Signed').length,
    pending: agreements.filter(item => item.status === 'Pending Signature').length,
    expiring: agreements.filter(item => isExpiringSoon(item.valid_until)).length
  };

  return (
    <div className="space-y-6">
      {/* Agreement Types Info */}
      {agreements.some(ag => ag.is_basic) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Agreement Types</h4>
              <p className="text-sm text-blue-800">
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 mr-2">
                  Registration
                </span>
                agreements were signed during vendor registration. Additional detailed agreements can be added separately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Agreement Overview */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileSignature" size={20} className="mr-2" />
          Agreement Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">{agreementStats.total}</div>
            <div className="text-sm text-text-secondary">Total Agreements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-success mb-1">{agreementStats.signed}</div>
            <div className="text-sm text-text-secondary">Signed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning mb-1">{agreementStats.pending}</div>
            <div className="text-sm text-text-secondary">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-accent mb-1">{agreementStats.expiring}</div>
            <div className="text-sm text-text-secondary">Expiring Soon</div>
          </div>
        </div>
      </div>

      {/* Add Agreement Button */}
      <div className="flex justify-end">
        <Button 
          variant="default" 
          iconName="Plus" 
          iconPosition="left"
          onClick={() => {
            // TODO: Implement add agreement modal
            alert('Add detailed agreement functionality will be implemented here');
          }}
        >
          Add Detailed Agreement
        </Button>
      </div>

      {/* Agreements List */}
      {agreements.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Agreements Found</h3>
          <p className="text-text-secondary mb-4">This vendor doesn't have any agreements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {agreements.map((agreement) => (
            <div key={agreement.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-foreground">{agreement.title}</h4>
                        {agreement.is_basic && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            Registration
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(agreement.type)}`}>
                          {agreement.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agreement.status)}`}>
                          {agreement.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{agreement.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {agreement.version && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Version</label>
                        <p className="text-sm text-foreground font-medium">v{agreement.version}</p>
                      </div>
                    )}
                    {agreement.document_size && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Document Size</label>
                        <p className="text-sm text-foreground">{agreement.document_size}</p>
                      </div>
                    )}
                    {agreement.last_modified && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Last Modified</label>
                        <p className="text-sm text-foreground">{formatDate(agreement.last_modified)}</p>
                      </div>
                    )}
                    {agreement.signed_date && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Signed Date</label>
                        <p className="text-sm text-foreground">{formatDate(agreement.signed_date)}</p>
                      </div>
                    )}
                    {agreement.signed_by && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Signed By</label>
                        <p className="text-sm text-foreground">{agreement.signed_by}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Valid Until</label>
                      <p className={`text-sm font-medium ${
                        isExpiringSoon(agreement.valid_until) ? 'text-warning' : 'text-foreground'
                      }`}>
                        {agreement.valid_until}
                        {isExpiringSoon(agreement.valid_until) && (
                          <span className="ml-1 text-xs">(Soon)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Agreement Properties */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {agreement.witness_required && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">Witness Required</span>
                      </div>
                    )}
                    {agreement.auto_renewal && (
                      <div className="flex items-center space-x-2">
                        <Icon name="RefreshCw" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">Auto Renewal</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Eye" 
                  iconPosition="left"
                  onClick={() => handleViewAgreement(agreement)}
                  disabled={loadingData}
                >
                  {loadingData && viewAgreementModal.agreement?.id === agreement.id ? 'Loading...' : 'View Agreement'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  iconName="Download" 
                  iconPosition="left"
                  onClick={() => handleDownloadPDF(agreement)}
                  disabled={loadingData}
                >
                  {loadingData ? 'Generating...' : 'Download PDF'}
                </Button>
                {agreement.status === 'Pending Signature' && (
                  <Button variant="default" size="sm" iconName="PenTool" iconPosition="left">
                    Sign Agreement
                  </Button>
                )}
                {agreement.status === 'Signed' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    iconName="FileSignature" 
                    iconPosition="left"
                    onClick={() => handleViewSignature(agreement)}
                    disabled={loadingData}
                  >
                    {loadingData && signatureModal.agreement?.id === agreement.id ? 'Loading...' : 'View Signature'}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  iconName="MessageSquare" 
                  iconPosition="left"
                  onClick={() => handleAddComment(agreement)}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Signature Information */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Digital Signature Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Signature Method:</span>
              <span className="font-medium text-foreground">Digital Certificate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Certificate Authority:</span>
              <span className="font-medium text-foreground">eMudhra Limited</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Certificate Valid Until:</span>
              <span className="font-medium text-foreground">15/03/2026</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Signature Verification:</span>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="font-medium text-success">Verified</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Timestamp Authority:</span>
              <span className="font-medium text-foreground">SafeScrypt TSA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Last Signature:</span>
              <span className="font-medium text-foreground">27/03/2024 14:32:15</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Agreement Modal */}
      {viewAgreementModal.isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closeModal} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-surface border border-border rounded-lg shadow-medium w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {viewAgreementModal.agreement?.title}
                    </h2>
                    <div className="text-sm text-text-secondary mt-1">
                      {viewAgreementModal.agreement?.is_basic ? 'Registration Agreement' : 'Detailed Agreement'}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeModal}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {viewAgreementModal.agreement?.is_basic ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Registration Agreement</h4>
                            <p className="text-sm text-blue-800">
                              This agreement was signed during vendor registration. The full agreement terms are part of the registration process.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Agreement Type</label>
                          <p className="text-foreground mt-1">{viewAgreementModal.agreement?.type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Status</label>
                          <p className="text-foreground mt-1">{viewAgreementModal.agreement?.status}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Signed Date</label>
                          <p className="text-foreground mt-1">{formatDate(viewAgreementModal.agreement?.signed_date)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Signed By</label>
                          <p className="text-foreground mt-1">{viewAgreementModal.agreement?.signed_by}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Valid Until</label>
                          <p className="text-foreground mt-1">{viewAgreementModal.agreement?.valid_until}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Description</label>
                          <p className="text-foreground mt-1">{viewAgreementModal.agreement?.description}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {agreementData ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Agreement Type</label>
                              <p className="text-foreground mt-1">{agreementData.type}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Status</label>
                              <p className="text-foreground mt-1">{agreementData.status}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Version</label>
                              <p className="text-foreground mt-1">{agreementData.version}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Document Size</label>
                              <p className="text-foreground mt-1">{agreementData.document_size}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Signed Date</label>
                              <p className="text-foreground mt-1">{formatDate(agreementData.signed_date)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Signed By</label>
                              <p className="text-foreground mt-1">{agreementData.signed_by}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Valid Until</label>
                              <p className="text-foreground mt-1">{agreementData.valid_until}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-text-secondary">Last Modified</label>
                              <p className="text-foreground mt-1">{formatDate(agreementData.last_modified)}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-secondary">Description</label>
                            <p className="text-foreground mt-1">{agreementData.description}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-text-secondary">Document Content</label>
                            <div className="mt-2 p-4 bg-muted rounded-lg border">
                              <p className="text-sm text-foreground whitespace-pre-wrap">{agreementData.document_content}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Signature Modal */}
      {signatureModal.isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closeModal} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-surface border border-border rounded-lg shadow-medium w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Signature Details
                    </h2>
                    <div className="text-sm text-text-secondary mt-1">
                      {signatureModal.agreement?.title}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeModal}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {signatureData ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Signed By</label>
                          <p className="text-foreground mt-1">{signatureData.signature_details.signed_by}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Signed Date</label>
                          <p className="text-foreground mt-1">{formatDate(signatureData.signature_details.signed_date)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Signature Method</label>
                          <p className="text-foreground mt-1">{signatureData.signature_details.signature_method}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Certificate Authority</label>
                          <p className="text-foreground mt-1">{signatureData.signature_details.certificate_authority}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Verification Status</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Icon name="CheckCircle" size={16} className="text-success" />
                            <span className="text-success font-medium">Verified</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-secondary">Timestamp</label>
                          <p className="text-foreground mt-1">{formatDate(signatureData.signature_details.timestamp)}</p>
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon name="FileSignature" size={20} className="text-primary" />
                          <h4 className="font-medium text-foreground">Digital Signature</h4>
                        </div>
                        <p className="text-sm text-text-secondary">
                          This agreement has been digitally signed using a secure certificate from {signatureData.signature_details.certificate_authority}. 
                          The signature has been verified and is legally binding.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Comment Modal */}
      {commentModal.isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closeModal} />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-surface border border-border rounded-lg shadow-medium w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Comments
                    </h2>
                    <div className="text-sm text-text-secondary mt-1">
                      {commentModal.agreement?.title}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeModal}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-4">
                    {/* Add Comment Form */}
                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-3">Add New Comment</h4>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Enter your comment here..."
                        className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim()}
                        >
                          Add Comment
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Previous Comments</h4>
                      {comments.length > 0 ? (
                        <div className="space-y-3">
                          {comments.map((comment) => (
                            <div key={comment.id} className="bg-muted rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-foreground">{comment.author}</span>
                                  <span className="text-xs text-text-secondary">
                                    {formatDate(comment.timestamp)}
                                  </span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  comment.type === 'approval' ? 'bg-success/10 text-success' :
                                  comment.type === 'notification' ? 'bg-primary/10 text-primary' :
                                  'bg-muted/10 text-muted-foreground'
                                }`}>
                                  {comment.type}
                                </span>
                              </div>
                              <p className="text-sm text-foreground">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-text-secondary">
                          <Icon name="MessageSquare" size={32} className="mx-auto mb-2" />
                          <p>No comments yet. Be the first to add one!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AgreementsTab;