import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ComplianceStep = ({ formData, updateFormData, errors }) => {
  const [currencySearch, setCurrencySearch] = useState('');

  const currencies = [
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'CHF', label: 'CHF - Swiss Franc' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
    { value: 'SGD', label: 'SGD - Singapore Dollar' },
    { value: 'AED', label: 'AED - UAE Dirham' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' }
  ];

  const natureOfAssessee = [
    { value: 'individual', label: 'Individual' },
    { value: 'huf', label: 'Hindu Undivided Family (HUF)' },
    { value: 'company', label: 'Company' },
    { value: 'firm', label: 'Firm/LLP' },
    { value: 'aop', label: 'Association of Persons (AOP)' },
    { value: 'body-of-individuals', label: 'Body of Individuals (BOI)' },
    { value: 'local-authority', label: 'Local Authority' },
    { value: 'artificial-juridical-person', label: 'Artificial Juridical Person' },
    { value: 'trust', label: 'Trust' },
    { value: 'society', label: 'Society' }
  ];

  const handleInputChange = (field, value) => {
    // Auto-uppercase PAN
    if (field === 'panNumber') {
      value = value.toUpperCase();
    }
    updateFormData({ [field]: value });
  };

  const isIndian = formData.registeredCountry === 'IN';

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Compliance Information</h2>
        <p className="text-text-secondary">
          Provide tax and regulatory compliance details as per your country's requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Preferred Currency"
          description="Select your preferred currency for transactions"
          options={currencies}
          value={formData.preferredCurrency}
          onChange={(value) => handleInputChange('preferredCurrency', value)}
          error={errors.preferredCurrency}
          searchable
          required
        />

        <Input
          label="Tax Registration Number"
          type="text"
          placeholder={isIndian ? "Enter TAN number" : "Enter tax registration number"}
          value={formData.taxRegistrationNumber}
          onChange={(e) => handleInputChange('taxRegistrationNumber', e.target.value)}
          error={errors.taxRegistrationNumber}
          required
        />
      </div>

      {/* India-specific fields */}
      {isIndian && (
        <div className="bg-muted/30 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">India-specific Compliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="PAN Number"
              type="text"
              placeholder="Enter PAN number"
              value={formData.panNumber}
              onChange={(e) => handleInputChange('panNumber', e.target.value)}
              error={errors.panNumber}
              maxLength={10}
              required
            />

            <Input
              label="GST Number"
              type="text"
              placeholder="Enter GST number"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              error={errors.gstNumber}
              maxLength={15}
              required
            />

            <Select
              label="Nature of Assessee"
              description="Select your tax assessee category"
              options={natureOfAssessee}
              value={formData.natureOfAssessee}
              onChange={(value) => handleInputChange('natureOfAssessee', value)}
              error={errors.natureOfAssessee}
              required
            />

            <Input
              label="TAN Number"
              type="text"
              placeholder="Enter TAN number (if applicable)"
              value={formData.tanNumber}
              onChange={(e) => handleInputChange('tanNumber', e.target.value.toUpperCase())}
              error={errors.tanNumber}
              maxLength={10}
            />

            <Select
              label="GTA Registration"
              description="Are you registered under Goods and Services Tax Act (GTA)?"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
              value={formData.gtaRegistration}
              onChange={(value) => handleInputChange('gtaRegistration', value)}
              error={errors.gtaRegistration}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Place of Supply"
                type="text"
                placeholder="Enter primary place of supply"
                value={formData.placeOfSupply}
                onChange={(e) => handleInputChange('placeOfSupply', e.target.value)}
                error={errors.placeOfSupply}
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* International compliance */}
      {!isIndian && (
        <div className="bg-muted/30 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">International Compliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="VAT/Sales Tax Number"
              type="text"
              placeholder="Enter VAT or sales tax number"
              value={formData.vatNumber}
              onChange={(e) => handleInputChange('vatNumber', e.target.value)}
              error={errors.vatNumber}
            />

            <Input
              label="Business License Number"
              type="text"
              placeholder="Enter business license number"
              value={formData.businessLicense}
              onChange={(e) => handleInputChange('businessLicense', e.target.value)}
              error={errors.businessLicense}
              required
            />

            <Select
              label="GTA Registration"
              description="Are you registered under Goods and Services Tax Act (GTA)?"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
              ]}
              value={formData.gtaRegistration}
              onChange={(value) => handleInputChange('gtaRegistration', value)}
              error={errors.gtaRegistration}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Regulatory Compliance Notes"
                type="text"
                placeholder="Any additional regulatory compliance information"
                value={formData.complianceNotes}
                onChange={(e) => handleInputChange('complianceNotes', e.target.value)}
                error={errors.complianceNotes}
              />
            </div>
          </div>
        </div>
      )}

      {/* Additional Compliance Information */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Credit Rating (if available)"
            type="text"
            placeholder="e.g., AAA, AA+, A1+"
            value={formData.creditRating}
            onChange={(e) => handleInputChange('creditRating', e.target.value)}
            error={errors.creditRating}
          />

          <Input
            label="Insurance Coverage Amount"
            type="number"
            placeholder="Enter coverage amount"
            value={formData.insuranceCoverage}
            onChange={(e) => handleInputChange('insuranceCoverage', e.target.value)}
            error={errors.insuranceCoverage}
          />

          <div className="md:col-span-2">
            <Input
              label="Special Certifications/Licenses"
              type="text"
              placeholder="List any special industry certifications or licenses"
              value={formData.specialCertifications}
              onChange={(e) => handleInputChange('specialCertifications', e.target.value)}
              error={errors.specialCertifications}
            />
          </div>
        </div>
      </div>

      {/* Information Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Compliance Verification</h4>
            <p className="text-sm text-amber-800">
              All compliance information will be verified during the approval process. 
              Please ensure all details are accurate and up-to-date. Supporting documents 
              may be requested for verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStep;