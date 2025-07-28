import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const CategorizationStep = ({ formData, updateFormData, errors }) => {
  const supplierTypes = [
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'trader', label: 'Trader' },
    { value: 'service-provider', label: 'Service Provider' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'consultant', label: 'Consultant' }
  ];

  const supplierGroups = [
    { value: 'raw-materials', label: 'Raw Materials' },
    { value: 'components', label: 'Components & Parts' },
    { value: 'finished-goods', label: 'Finished Goods' },
    { value: 'services', label: 'Services' },
    { value: 'machinery', label: 'Machinery & Equipment' },
    { value: 'consumables', label: 'Consumables' },
    { value: 'packaging', label: 'Packaging Materials' }
  ];

  const supplierCategories = [
    { value: 'critical', label: 'Critical Supplier' },
    { value: 'strategic', label: 'Strategic Supplier' },
    { value: 'preferred', label: 'Preferred Supplier' },
    { value: 'approved', label: 'Approved Supplier' },
    { value: 'standard', label: 'Standard Supplier' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleFileUpload = (field, file) => {
    updateFormData({ [field]: file });
  };

  const handleMSMEChange = (value) => {
    updateFormData({ 
      msmeStatus: value,
      msmeDeclaration: false,
      msmeCertificate: null
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Supplier Categorization</h2>
        <p className="text-text-secondary">
          Help us categorize your business to streamline our procurement process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Supplier Type"
          description="Select the type that best describes your business"
          options={supplierTypes}
          value={formData.supplierType}
          onChange={(value) => handleInputChange('supplierType', value)}
          error={errors.supplierType}
          required
        />

        <Select
          label="Supplier Group"
          description="Select the primary category of products/services you provide"
          options={supplierGroups}
          value={formData.supplierGroup}
          onChange={(value) => handleInputChange('supplierGroup', value)}
          error={errors.supplierGroup}
          required
        />

        <Select
          label="Supplier Category"
          description="This will be assigned based on your business relationship"
          options={supplierCategories}
          value={formData.supplierCategory}
          onChange={(value) => handleInputChange('supplierCategory', value)}
          error={errors.supplierCategory}
          required
        />

        <Input
          label="Annual Turnover (₹)"
          type="number"
          placeholder="Enter annual turnover in INR"
          value={formData.annualTurnover}
          onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
          error={errors.annualTurnover}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Products/Services Offered"
            type="text"
            placeholder="Briefly describe the main products or services you offer"
            value={formData.productsServices}
            onChange={(e) => handleInputChange('productsServices', e.target.value)}
            error={errors.productsServices}
            required
          />
        </div>
      </div>

      {/* MSME Status Section */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">MSME Status</h3>
        <p className="text-sm text-text-secondary mb-4">
          Micro, Small & Medium Enterprises (MSME) registration provides various benefits under government schemes.
        </p>

        <div className="space-y-4">
          <Select
            label="MSME Registration Status"
            options={[
              { value: 'registered', label: 'MSME Registered' },
              { value: 'not-registered', label: 'Not MSME Registered' }
            ]}
            value={formData.msmeStatus}
            onChange={handleMSMEChange}
            error={errors.msmeStatus}
            required
          />

          {formData.msmeStatus === 'registered' && (
            <div className="space-y-4">
              <Input
                label="MSME Registration Number"
                type="text"
                placeholder="Enter MSME registration number"
                value={formData.msmeNumber}
                onChange={(e) => handleInputChange('msmeNumber', e.target.value)}
                error={errors.msmeNumber}
                required
              />

              <Input
                label="MSME Certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('msmeCertificate', e.target.files[0])}
                error={errors.msmeCertificate}
                required
              />

              {formData.msmeCertificate && (
                <div className="text-sm text-success">
                  ✓ Certificate uploaded: {formData.msmeCertificate.name}
                </div>
              )}
            </div>
          )}

          {formData.msmeStatus === 'not-registered' && (
            <Checkbox
              label="I declare that my enterprise is not registered under MSME and I understand that I will not be eligible for MSME benefits"
              checked={formData.msmeDeclaration}
              onChange={(e) => handleInputChange('msmeDeclaration', e.target.checked)}
              error={errors.msmeDeclaration}
              required
            />
          )}
        </div>
      </div>

      {/* Additional Classifications */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Additional Classifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Industry Sector"
            type="text"
            placeholder="e.g., Automotive, Electronics, Textiles"
            value={formData.industrySector}
            onChange={(e) => handleInputChange('industrySector', e.target.value)}
            error={errors.industrySector}
            required
          />

          <Input
            label="Number of Employees"
            type="number"
            placeholder="Enter total number of employees"
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
            error={errors.employeeCount}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Key Certifications"
              type="text"
              placeholder="e.g., ISO 9001, ISO 14001, OHSAS 18001 (comma separated)"
              value={formData.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              error={errors.certifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorizationStep;