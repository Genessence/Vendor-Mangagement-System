import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CompanyInformationStep = ({ formData, updateFormData, errors }) => {
  const businessVerticals = [
    { value: 'amber-enterprises', label: 'Amber Enterprises India Limited' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'technology', label: 'Technology' },
    { value: 'services', label: 'Services' },
    { value: 'retail', label: 'Retail' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Company Information</h2>
        <p className="text-text-secondary">Please provide your company's basic information and contact details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Select
            label="Business Vertical"
            description="Select the business vertical you'll be working with"
            options={businessVerticals}
            value={formData.businessVertical}
            onChange={(value) => handleInputChange('businessVertical', value)}
            error={errors.businessVertical}
            required
          />
        </div>

        <Input
          label="Company Name"
          type="text"
          placeholder="Enter your company name"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          error={errors.companyName}
          required
        />

        <Input
          label="Company Registration Number"
          type="text"
          placeholder="Enter registration number"
          value={formData.registrationNumber}
          onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
          error={errors.registrationNumber}
          required
        />

        <Input
          label="Contact Person Name"
          type="text"
          placeholder="Enter contact person name"
          value={formData.contactPersonName}
          onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
          error={errors.contactPersonName}
          required
        />

        <Input
          label="Designation"
          type="text"
          placeholder="Enter designation"
          value={formData.designation}
          onChange={(e) => handleInputChange('designation', e.target.value)}
          error={errors.designation}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          error={errors.phoneNumber}
          required
        />

        <Input
          label="Website URL"
          type="url"
          placeholder="https://www.example.com"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          error={errors.website}
        />

        <Input
          label="Year of Establishment"
          type="number"
          placeholder="YYYY"
          min="1900"
          max="2025"
          value={formData.yearEstablished}
          onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
          error={errors.yearEstablished}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Business Description"
            type="text"
            placeholder="Brief description of your business activities"
            value={formData.businessDescription}
            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
            error={errors.businessDescription}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInformationStep;