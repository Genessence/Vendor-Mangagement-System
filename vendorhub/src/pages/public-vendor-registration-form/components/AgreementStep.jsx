import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AgreementStep = ({ formData, updateFormData, errors, onGeneratePDF }) => {
  const agreements = [
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement (NDA)',
      description: `I agree to maintain confidentiality of all proprietary information shared by Amber Enterprises India Limited.\n\nThis includes but not limited to:\n• Technical specifications and designs\n• Business strategies and plans\n• Customer information and data\n• Financial information\n• Any other confidential materials`,
      required: true
    },
    {
      id: 'sqa',
      title: 'Supplier Quality Agreement (SQA)',
      description: `I commit to maintaining the highest quality standards as specified by Amber Enterprises India Limited.\n\nThis includes:\n• Adherence to quality specifications\n• Implementation of quality control processes\n• Regular quality audits and inspections\n• Immediate notification of quality issues\n• Continuous improvement initiatives`,
      required: true
    },
    {
      id: 'fourM',
      title: '4M Change Control Agreement',
      description: `I agree to notify Amber Enterprises India Limited of any changes in the 4M parameters:\n\n• Man (Personnel changes)\n• Machine (Equipment modifications)\n• Material (Raw material changes)\n• Method (Process modifications)\n\nAll changes must be approved before implementation.`,
      required: true
    },
    {
      id: 'codeOfConduct',
      title: 'Code of Conduct',
      description: `I agree to adhere to the ethical business practices and code of conduct of Amber Enterprises India Limited.\n\nThis includes:\n• Fair business practices\n• Anti-corruption policies\n• Environmental responsibility\n• Labor standards compliance\n• Health and safety regulations`,
      required: true
    },
    {
      id: 'complianceAgreement',
      title: 'Compliance Agreement',
      description: `I confirm compliance with all applicable laws, regulations, and industry standards.\n\nThis includes:\n• Local and international trade laws\n• Environmental regulations\n• Labor laws and worker rights\n• Tax and financial regulations\n• Industry-specific compliance requirements`,
      required: true
    },
    {
      id: 'selfDeclaration',
      title: 'Self Declaration',
      description: `I hereby declare that:\n\n• All information provided in this registration is true and accurate\n• I have the authority to enter into this agreement\n• My organization has the capability to fulfill the requirements\n• I will promptly notify of any material changes\n• I understand the consequences of providing false information`,
      required: true
    }
  ];

  const handleAgreementChange = (agreementId, checked) => {
    updateFormData({
      agreements: {
        ...formData.agreements,
        [agreementId]: checked
      }
    });
  };

  const allAgreementsAccepted = agreements.every(agreement => 
    formData.agreements?.[agreement.id] === true
  );

  const handleGeneratePDF = () => {
    if (allAgreementsAccepted) {
      onGeneratePDF();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Digital Agreements</h2>
        <p className="text-text-secondary">
          Please review and accept the following agreements to complete your vendor registration.
        </p>
      </div>

      {/* Agreement Cards */}
      <div className="space-y-6">
        {agreements.map((agreement) => (
          <div key={agreement.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  checked={formData.agreements?.[agreement.id] || false}
                  onChange={(e) => handleAgreementChange(agreement.id, e.target.checked)}
                  error={errors.agreements?.[agreement.id]}
                  required={agreement.required}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {agreement.title}
                  {agreement.required && <span className="text-error ml-1">*</span>}
                </h3>
                
                <div className="bg-muted/30 p-4 rounded-lg mb-4">
                  <pre className="text-sm text-text-secondary whitespace-pre-wrap font-sans">
                    {agreement.description}
                  </pre>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  {formData.agreements?.[agreement.id] ? (
                    <div className="flex items-center space-x-2 text-success">
                      <Icon name="CheckCircle" size={16} />
                      <span>Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-text-secondary">
                      <Icon name="Circle" size={16} />
                      <span>Pending acceptance</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agreement Summary */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Agreement Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {agreements.map((agreement) => (
            <div key={agreement.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <span className="text-sm font-medium text-foreground">{agreement.title}</span>
              {formData.agreements?.[agreement.id] ? (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-xs">Accepted</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-text-secondary">
                  <Icon name="Circle" size={16} />
                  <span className="text-xs">Pending</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* PDF Generation */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground mb-1">Generate Agreement PDF</h4>
              <p className="text-sm text-text-secondary">
                Once all agreements are accepted, you can generate a PDF copy for your records.
              </p>
            </div>
            
            <Button
              variant={allAgreementsAccepted ? "default" : "outline"}
              onClick={handleGeneratePDF}
              disabled={!allAgreementsAccepted}
              iconName="Download"
              iconPosition="left"
            >
              Generate PDF
            </Button>
          </div>
          
          {!allAgreementsAccepted && (
            <div className="mt-3 text-sm text-warning">
              Please accept all required agreements to generate the PDF.
            </div>
          )}
        </div>
      </div>

      {/* Legal Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <Icon name="Info" size={12} color="white" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Legal Information</h4>
            <p className="text-sm text-blue-800">
              By accepting these agreements, you are entering into a legally binding contract with 
              Amber Enterprises India Limited. Please ensure you have the authority to accept these 
              terms on behalf of your organization. These agreements will remain in effect throughout 
              your business relationship with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementStep;