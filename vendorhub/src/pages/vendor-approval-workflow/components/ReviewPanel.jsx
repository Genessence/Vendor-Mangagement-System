import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import IndianVendorQuestionnaire from './IndianVendorQuestionnaire';
import ForeignVendorQuestionnaire from './ForeignVendorQuestionnaire';

const ReviewPanel = ({ application, onClose, onApprove, onReject, onRequestChanges }) => {
  const [activeTab, setActiveTab] = useState('supplier');
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  
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
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'questionnaire', label: 'Questionnaire', icon: 'ClipboardList' }
  ];

  const rejectionReasons = [
    { value: 'incomplete_documents', label: 'Incomplete Documents' },
    { value: 'invalid_information', label: 'Invalid Information' },
    { value: 'compliance_issues', label: 'Compliance Issues' },
    { value: 'duplicate_vendor', label: 'Duplicate Vendor' },
    { value: 'other', label: 'Other (specify)' }
  ];

  // Check if vendor is Indian
  const isIndianVendor = application.country === 'IN' || application.countryOrigin === 'IN';

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

    // For approve and request_changes, validate questionnaire
    const questionnaireErrors = validateQuestionnaire();
    if (Object.keys(questionnaireErrors).length > 0) {
      setQuestionnaireErrors(questionnaireErrors);
      alert('Please complete all questionnaire fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      switch (action) {
        case 'approve':
          await onApprove(application.id, questionnaireData);
          break;
        case 'request_changes':
          await onRequestChanges(application.id, questionnaireData);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
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
      alert('Please specify the custom rejection reason');
      return;
    }

    setIsProcessing(true);
    
    try {
      await onReject(application.id, rejectionReason, customReason, remarks);
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
              <p className="text-card-foreground font-medium">{application.companyName}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Business Vertical</label>
              <p className="text-card-foreground">{application.businessVertical}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Category</label>
              <p className="text-card-foreground">{application.category}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Supplier Type</label>
              <p className="text-card-foreground">{application.supplierType}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Contact Details</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary">Contact Person</label>
              <p className="text-card-foreground font-medium">{application.contactPerson}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Email</label>
              <p className="text-card-foreground">{application.email}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Phone</label>
              <p className="text-card-foreground">{application.phone}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Country</label>
              <p className="text-card-foreground">{application.country}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-card-foreground mb-3">Addresses</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-text-secondary">Registered Address</label>
            <p className="text-card-foreground">{application.registeredAddress}</p>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Supply Address</label>
            <p className="text-card-foreground">{application.supplyAddress}</p>
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
              <p className="text-card-foreground font-medium">{application.bankDetails?.bankName}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Account Number</label>
              <p className="text-card-foreground">{application.bankDetails?.accountNumber}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Account Type</label>
              <p className="text-card-foreground">{application.bankDetails?.accountType}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">IFSC/Swift Code</label>
              <p className="text-card-foreground font-mono">{application.bankDetails?.ifscCode}</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-card-foreground mb-3">Additional Details</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-secondary">Branch</label>
              <p className="text-card-foreground">{application.bankDetails?.branch}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Currency</label>
              <p className="text-card-foreground">{application.bankDetails?.currency}</p>
            </div>
            <div>
              <label className="text-sm text-text-secondary">Bank Proof</label>
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-primary" />
                <a href="#" className="text-primary hover:underline">
                  {application.bankDetails?.proofDocument}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {application.documents?.map((doc, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-card-foreground">{doc.name}</h5>
                <p className="text-xs text-text-secondary">{doc.type}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{doc.size}</span>
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
    </div>
  );

  const renderAgreements = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {application.agreements?.map((agreement, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox 
                checked={agreement.signed} 
                disabled 
                className="pointer-events-none"
              />
              <div>
                <h5 className="font-medium text-card-foreground">{agreement.name}</h5>
                <p className="text-sm text-text-secondary">{agreement.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                agreement.signed ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}>
                {agreement.signed ? 'Signed' : 'Pending'}
              </span>
              {agreement.signed && (
                <Button variant="ghost" size="sm">
                  <Icon name="Download" size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Application History</h3>
      <div className="space-y-3">
        {application.history?.map((event, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{event.action}</p>
              <p className="text-xs text-text-secondary">{event.timestamp}</p>
              {event.remarks && (
                <p className="text-sm text-text-secondary mt-1">{event.remarks}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionnaire = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isIndianVendor ? 'Indian Vendor' : 'Foreign Vendor'} Questionnaire
        </h3>
        <p className="text-sm text-text-secondary">
          Please complete the questionnaire to proceed with the approval process.
        </p>
      </div>
      
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
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'supplier': return renderSupplierInfo();
      case 'bank': return renderBankDetails();
      case 'documents': return renderDocuments();
      case 'agreements': return renderAgreements();
      case 'history': return renderHistory();
      case 'questionnaire': return renderQuestionnaire();
      default: return renderSupplierInfo();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-200 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-medium w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{application.companyName}</h2>
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
              <span>Complete the questionnaire before taking action</span>
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
    </div>
  );
};

export default ReviewPanel;