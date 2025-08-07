import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { getCountryName } from '../../../utils/countries';
import IndianVendorQuestionnaire from './IndianVendorQuestionnaire';
import ForeignVendorQuestionnaire from './ForeignVendorQuestionnaire';

const ReviewPanel = ({ application, onClose, onApprove, onReject, onRequestChanges }) => {
  const [activeTab, setActiveTab] = useState('supplier');
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  
  // Questionnaire form data
  const [questionnaireData, setQuestionnaireData] = useState({
    supplierTermOfPayment: '',
    supplierPaymentMethod: '',
    supplierDeliveryTerms: '',
    supplierModeOfDelivery: '',
    supplierGroup: '',
    commodityCode: ''
  });
  const [questionnaireErrors, setQuestionnaireErrors] = useState({});

  const tabs = [
    { id: 'supplier', label: 'Supplier Info', icon: 'Building2' },
    { id: 'bank', label: 'Bank Details', icon: 'CreditCard' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'agreements', label: 'Agreements', icon: 'FileCheck' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const rejectionReasons = [
    { value: 'incomplete_documents', label: 'Incomplete Documents' },
    { value: 'invalid_information', label: 'Invalid Information' },
    { value: 'compliance_issues', label: 'Compliance Issues' },
    { value: 'duplicate_vendor', label: 'Duplicate Vendor' },
    { value: 'other', label: 'Other (specify)' }
  ];

  // Check if vendor is Indian
  const isIndianVendor = application.country_origin === 'IN';

  const updateQuestionnaireData = (updates) => {
    setQuestionnaireData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setQuestionnaireErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };

  const validateQuestionnaire = () => {
    const errors = {};
    if (!questionnaireData.supplierTermOfPayment) errors.supplierTermOfPayment = 'Required';
    if (!questionnaireData.supplierPaymentMethod) errors.supplierPaymentMethod = 'Required';
    if (!questionnaireData.supplierDeliveryTerms) errors.supplierDeliveryTerms = 'Required';
    if (!questionnaireData.supplierModeOfDelivery) errors.supplierModeOfDelivery = 'Required';
    if (!questionnaireData.supplierGroup) errors.supplierGroup = 'Required';
    if (!questionnaireData.commodityCode) errors.commodityCode = 'Required';
    return errors;
  };

  const handleAction = async (action) => {
    if (action === 'reject') {
      setShowRejectionForm(true);
      return;
    }

    if (action === 'approve') {
      // Show questionnaire first for approval
      setShowQuestionnaire(true);
      return;
    }

    // For request_changes, proceed directly
    setIsProcessing(true);
    
    try {
      await onRequestChanges(application.id, {});
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuestionnaireSubmit = async () => {
    // Validate questionnaire
    const questionnaireErrors = validateQuestionnaire();
    if (Object.keys(questionnaireErrors).length > 0) {
      setQuestionnaireErrors(questionnaireErrors);
      alert('Please complete all questionnaire fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Convert questionnaire data to a readable string format
      const questionnaireString = Object.entries(questionnaireData)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      await onApprove(application.id, `Questionnaire completed: ${questionnaireString}`);
      onClose();
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      alert('Please select a rejection reason');
      return;
    }

    if (rejectionReason === 'other' && !customReason.trim()) {
      alert('Please specify the custom reason');
      return;
    }

    setIsProcessing(true);
    
    try {
      const finalReason = rejectionReason === 'other' ? customReason : rejectionReason;
      await onReject(application.id, finalReason, remarks);
      onClose();
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSupplierInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Company Information</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary">Company Name</label>
              <p className="text-card-foreground font-medium">{application.company_name}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Business Vertical</label>
              <p className="text-card-foreground">{application.business_vertical}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Category</label>
              <p className="text-card-foreground">{application.supplier_category}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Supplier Type</label>
              <p className="text-card-foreground">{application.supplier_type}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Contact Details</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary">Contact Person</label>
              <p className="text-card-foreground font-medium">{application.contact_person_name}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Email</label>
              <p className="text-card-foreground">{application.email}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Phone</label>
              <p className="text-card-foreground">{application.phone_number}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Country</label>
              <p className="text-card-foreground">{getCountryName(application.country_origin)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-card-foreground mb-3">Addresses</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-text-secondary">Registered Address</label>
            <p className="text-card-foreground">{application.registered_address}</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Supply Address</label>
            <p className="text-card-foreground">{application.supply_address}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBankDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Bank Information</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary">Bank Name</label>
              <p className="text-card-foreground font-medium">{application.bank_name}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Account Number</label>
              <p className="text-card-foreground">{application.account_number}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Account Type</label>
              <p className="text-card-foreground">{application.account_type}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">IFSC/Swift Code</label>
              <p className="text-card-foreground font-mono">{application.ifsc_code || application.swift_code}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Additional Details</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary">Branch</label>
              <p className="text-card-foreground">{application.branch_name}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Currency</label>
              <p className="text-card-foreground">{application.currency}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Bank Proof</label>
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-primary" />
                <span className="text-card-foreground">Bank proof document uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {application.documents && application.documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {application.documents.map((doc, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-card-foreground">{doc.document_type}</h5>
                  <p className="text-xs text-text-secondary">{doc.filename}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {doc.expiry_date ? `Expires: ${new Date(doc.expiry_date).toLocaleDateString()}` : 'No expiry'}
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="Eye" size={14} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Download" size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No documents uploaded yet</p>
        </div>
      )}
    </div>
  );

  const renderAgreements = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Basic Agreements from vendor registration */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={application.nda} 
              disabled 
              className="pointer-events-none"
            />
            <div>
              <h5 className="font-medium text-card-foreground">Non-Disclosure Agreement (NDA)</h5>
              <p className="text-sm text-text-secondary">Confidentiality and non-disclosure terms</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.nda ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              {application.nda ? 'Signed' : 'Pending'}
            </span>
            {application.nda && (
              <Button variant="ghost" size="sm">
                <Icon name="Download" size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={application.sqa} 
              disabled 
              className="pointer-events-none"
            />
            <div>
              <h5 className="font-medium text-card-foreground">Supplier Quality Agreement (SQA)</h5>
              <p className="text-sm text-text-secondary">Quality standards and requirements</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.sqa ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              {application.sqa ? 'Signed' : 'Pending'}
            </span>
            {application.sqa && (
              <Button variant="ghost" size="sm">
                <Icon name="Download" size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={application.four_m} 
              disabled 
              className="pointer-events-none"
            />
            <div>
              <h5 className="font-medium text-card-foreground">4M Agreement</h5>
              <p className="text-sm text-text-secondary">Man, Machine, Material, Method standards</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.four_m ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              {application.four_m ? 'Signed' : 'Pending'}
            </span>
            {application.four_m && (
              <Button variant="ghost" size="sm">
                <Icon name="Download" size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={application.code_of_conduct} 
              disabled 
              className="pointer-events-none"
            />
            <div>
              <h5 className="font-medium text-card-foreground">Code of Conduct</h5>
              <p className="text-sm text-text-secondary">Ethical business practices</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.code_of_conduct ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              {application.code_of_conduct ? 'Signed' : 'Pending'}
            </span>
            {application.code_of_conduct && (
              <Button variant="ghost" size="sm">
                <Icon name="Download" size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={application.compliance_agreement} 
              disabled 
              className="pointer-events-none"
            />
            <div>
              <h5 className="font-medium text-card-foreground">Compliance Agreement</h5>
              <p className="text-sm text-text-secondary">Regulatory compliance requirements</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.compliance_agreement ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              {application.compliance_agreement ? 'Signed' : 'Pending'}
            </span>
            {application.compliance_agreement && (
              <Button variant="ghost" size="sm">
                <Icon name="Download" size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={application.self_declaration} 
              disabled 
              className="pointer-events-none"
            />
            <div>
              <h5 className="font-medium text-card-foreground">Self Declaration</h5>
              <p className="text-sm text-text-secondary">Vendor self-declaration form</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.self_declaration ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            }`}>
              {application.self_declaration ? 'Signed' : 'Pending'}
            </span>
            {application.self_declaration && (
              <Button variant="ghost" size="sm">
                <Icon name="Download" size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Application History</h3>
      {application.history && application.history.length > 0 ? (
        <div className="space-y-3">
          {application.history.map((event, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {event.status === 'approved' ? 'Approved' : 
                   event.status === 'rejected' ? 'Rejected' : 
                   event.status === 'pending' ? 'Under Review' : 'Status Updated'}
                </p>
                <p className="text-xs text-text-secondary">
                  {new Date(event.created_at).toLocaleString()}
                </p>
                {event.comments && (
                  <p className="text-sm text-text-secondary mt-1">{event.comments}</p>
                )}
                <p className="text-xs text-text-secondary mt-1">
                  Level: {event.level === 'level_1' ? 'Level 1' : 
                         event.level === 'final' ? 'Final' : event.level}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="Clock" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No approval history available</p>
        </div>
      )}
    </div>
  );



  const renderTabContent = () => {
    switch (activeTab) {
      case 'supplier': return renderSupplierInfo();
      case 'bank': return renderBankDetails();
      case 'documents': return renderDocuments();
      case 'agreements': return renderAgreements();
      case 'history': return renderHistory();
      default: return renderSupplierInfo();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-200 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-medium w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
                         <h2 className="text-xl font-semibold text-foreground">{application.company_name}</h2>
            <p className="text-sm text-text-secondary">Application Review - {application.status.replace('_', ' ')}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-6 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>

        {/* Action Panel */}
        <div className="border-t border-border p-6 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Info" size={16} />
              <span>Review the application and take appropriate action</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handleAction('request_changes')}
                disabled={isProcessing}
              >
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Request Changes
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
              >
                <Icon name="XCircle" size={16} className="mr-2" />
                Reject
              </Button>
              <Button
                variant="success"
                onClick={() => handleAction('approve')}
                disabled={isProcessing}
                loading={isProcessing}
              >
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionForm && (
        <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-medium w-full max-w-md">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Reject Application</h3>
              <p className="text-sm text-text-secondary mt-1">Please provide a reason for rejection</p>
            </div>
            
            <div className="p-6 space-y-4">
              <Select
                label="Rejection Reason *"
                placeholder="Select reason for rejection"
                options={rejectionReasons}
                value={rejectionReason}
                onChange={setRejectionReason}
              />
              
              {rejectionReason === 'other' && (
                <Input
                  label="Custom Reason *"
                  type="text"
                  placeholder="Specify the reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              )}

              <Input
                label="Additional Remarks"
                type="textarea"
                placeholder="Any additional comments..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            
            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectionForm(false);
                  setRejectionReason('');
                  setCustomReason('');
                  setRemarks('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
                loading={isProcessing}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

             {/* Questionnaire Modal */}
       {showQuestionnaire && (
         <div className="fixed inset-0 bg-black/50 z-300 flex items-center justify-center p-4">
           <div className="bg-surface rounded-lg shadow-medium w-full max-w-6xl max-h-[95vh] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {isIndianVendor ? 'Indian Vendor' : 'Foreign Vendor'} Questionnaire
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowQuestionnaire(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {isIndianVendor ? (
                <IndianVendorQuestionnaire
                  formData={questionnaireData}
                  updateFormData={updateQuestionnaireData}
                  errors={questionnaireErrors}
                />
              ) : (
                <ForeignVendorQuestionnaire
                  formData={questionnaireData}
                  updateFormData={updateQuestionnaireData}
                  errors={questionnaireErrors}
                />
              )}
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowQuestionnaire(false)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleQuestionnaireSubmit}
                disabled={isProcessing}
                loading={isProcessing}
              >
                Confirm Approval
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanel;