import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { generateAndDownloadNDA, generateAndDownloadSQA, generateAndDownload4MDeclaration, generateAndDownloadCodeOfConduct, generateAndDownloadComplianceAgreement, generateAndDownloadSelfDeclaration } from '../../../utils/documentGenerator';
import { isIndia } from '../../../utils/countries.js';

const AgreementStep = ({ formData, updateFormData, errors, onGeneratePDF }) => {
  // Helper function to check if supplier is ODM
  const isODMSupplier = () => {
    return formData.supplierGroup === 'odm-amber';
  };

  // Helper function to check if supplier is Indian
  const isIndianSupplier = () => {
    return isIndia(formData.countryOrigin);
  };

  const agreements = [
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement (NDA)',
      description: `I agree to maintain confidentiality of all proprietary information shared by Amber Enterprises India Limited.\n\nThis includes but not limited to:\n• Technical specifications and designs\n• Business strategies and plans\n• Customer information and data\n• Financial information\n• Any other confidential materials`,
      required: true,
      canGenerate: true,
      generateFunction: () => generateAndDownloadNDA(formData),
      shouldShow: () => !isODMSupplier() // Show when NOT ODM
    },
    {
      id: 'sqa',
      title: 'Supplier Quality Agreement (SQA)',
      description: `I commit to maintaining the highest quality standards as specified by Amber Enterprises India Limited.\n\nThis includes:\n• Adherence to quality specifications\n• Implementation of quality control processes\n• Regular quality audits and inspections\n• Immediate notification of quality issues\n• Continuous improvement initiatives`,
      required: true,
      canGenerate: true,
      generateFunction: () => generateAndDownloadSQA(formData),
      shouldShow: () => isIndianSupplier() // Show when Indian supplier
    },
    {
      id: 'fourM',
      title: '4M Change Control Agreement',
      description: `I agree to notify Amber Enterprises India Limited of any changes in the 4M parameters:\n\n• Man (Personnel changes)\n• Machine (Equipment modifications)\n• Material (Raw material changes)\n• Method (Process modifications)\n\nAll changes must be approved before implementation.`,
      required: true,
      canGenerate: true,
      generateFunction: () => generateAndDownload4MDeclaration(formData),
      shouldShow: () => true // Always show
    },
    {
      id: 'codeOfConduct',
      title: 'Code of Conduct',
      description: `I agree to adhere to the ethical business practices and code of conduct of Amber Enterprises India Limited.\n\nThis includes:\n• Fair business practices\n• Anti-corruption policies\n• Environmental responsibility\n• Labor standards compliance\n• Health and safety regulations`,
      required: true,
      canGenerate: true,
      generateFunction: () => generateAndDownloadCodeOfConduct(formData),
      shouldShow: () => true // Always show
    },
    {
      id: 'complianceAgreement',
      title: 'Compliance Agreement',
      description: `I confirm compliance with all applicable laws, regulations, and industry standards.\n\nThis includes:\n• Local and international trade laws\n• Environmental regulations\n• Labor laws and worker rights\n• Tax and financial regulations\n• Industry-specific compliance requirements`,
      required: true,
      canGenerate: true,
      generateFunction: () => generateAndDownloadComplianceAgreement(formData),
      shouldShow: () => isIndianSupplier() // Show when Indian supplier
    },
    {
      id: 'selfDeclaration',
      title: 'Self Declaration',
      description: `I hereby declare that:\n\n• All information provided in this registration is true and accurate\n• I have the authority to enter into this agreement\n• My organization has the capability to fulfill the requirements\n• I will promptly notify of any material changes\n• I understand the consequences of providing false information`,
      required: true,
      canGenerate: true,
      generateFunction: () => generateAndDownloadSelfDeclaration(formData),
      shouldShow: () => true // Always show
    }
  ];

  // Filter agreements based on display constraints
  const visibleAgreements = agreements.filter(agreement => agreement.shouldShow());

  const handleAgreementChange = (agreementId, checked) => {
    const currentAgreements = formData.agreements || {};
    updateFormData({
      agreements: {
        ...currentAgreements,
        [agreementId]: checked
      }
    });
  };

  const handleGeneratePDF = (agreement) => {
    if (agreement.generateFunction) {
      agreement.generateFunction();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Agreements & Declarations</h2>
        <p className="text-text-secondary">
          Please review and accept the following agreements to complete your vendor registration.
        </p>
      </div>

      <div className="space-y-6">
        {visibleAgreements.map((agreement) => (
          <div key={agreement.id} className="bg-muted/30 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {agreement.title}
                  {agreement.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                <p className="text-sm text-text-secondary whitespace-pre-line">
                  {agreement.description}
                </p>
              </div>
              <div className="ml-4 flex items-center space-x-3">
                <Checkbox
                  id={agreement.id}
                  checked={formData.agreements?.[agreement.id] || false}
                  onCheckedChange={(checked) => handleAgreementChange(agreement.id, checked)}
                  required={agreement.required}
                />
                {agreement.canGenerate && formData.agreements?.[agreement.id] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGeneratePDF(agreement)}
                    className="flex items-center space-x-2"
                  >
                    <Icon name="Download" className="w-4 h-4" />
                    <span>Generate {agreement.title.split(' ')[0]}</span>
                  </Button>
                )}
              </div>
            </div>
            {errors[`agreements.${agreement.id}`] && (
              <p className="text-sm text-red-500 mt-2">{errors[`agreements.${agreement.id}`]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Display constraints info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-2">ℹ️ Agreement Display Rules:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• <strong>NDA:</strong> Shown for OEM and Other suppliers (not ODM)</li>
          <li>• <strong>SQA & Compliance Agreement:</strong> Shown for Indian suppliers only</li>
          <li>• <strong>4M, Code of Conduct & Self Declaration:</strong> Shown for all suppliers</li>
        </ul>
      </div>
    </div>
  );
};

export default AgreementStep;