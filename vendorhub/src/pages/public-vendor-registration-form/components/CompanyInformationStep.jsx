import React, { useState, useMemo } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { countries, filterCountries, getCountryByCode, isIndia } from '../../../utils/countries';
import { getPhoneCode, getPhonePlaceholder } from '../../../utils/phoneCodes';

const CompanyInformationStep = ({ formData, updateFormData, errors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Filter countries based on search term
  const filteredCountries = useMemo(() => {
    return filterCountries(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleFileChange = (field, file) => {
    updateFormData({ [field]: file });
  };

  const handleCountrySelect = (countryCode) => {
    handleInputChange('countryOrigin', countryCode);
    setIsCountryDropdownOpen(false);
    setSearchTerm('');
  };

  const isIndiaSelected = isIndia(formData.countryOrigin);
  const selectedCountry = getCountryByCode(formData.countryOrigin);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Company Information</h2>
        <p className="text-text-secondary">Please provide your company's basic information and contact details.</p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <span className="font-medium">💡 Tip:</span> When you select a country, the phone number field will automatically be formatted with the appropriate country code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Business Vertical"
            type="text"
            value="Amber Enterprises India Limited"
            disabled={true}
            description="Fixed business vertical for all vendors"
            className="bg-gray-50"
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

        {/* Custom Country Dropdown with Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-foreground mb-2">
            Country of Origin <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.countryOrigin ? 'border-red-500' : 'border-gray-300'
              } ${formData.countryOrigin ? 'text-foreground' : 'text-gray-500'}`}
            >
              {selectedCountry ? selectedCountry.label : 'Select a country'}
            </button>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {isCountryDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  autoFocus
                />
              </div>

              {/* Country List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.value}
                      type="button"
                      onClick={() => handleCountrySelect(country.value)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                        formData.countryOrigin === country.value ? 'bg-primary text-white hover:bg-primary-dark' : ''
                      }`}
                    >
                      {country.label}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No countries found</div>
                )}
              </div>
            </div>
          )}

          {errors.countryOrigin && (
            <p className="mt-1 text-sm text-red-600">{errors.countryOrigin}</p>
          )}
        </div>

        {isIndiaSelected ? (
          <Input
            label="Company Registration Number"
            type="text"
            placeholder="Enter registration number"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            error={errors.registrationNumber}
            required
          />
        ) : (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Incorporation Certificate <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="incorporation-certificate"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a PDF file</span>
                    <input
                      id="incorporation-certificate"
                      name="incorporation-certificate"
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={(e) => handleFileChange('incorporationCertificate', e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
            </div>
            {formData.incorporationCertificate && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {formData.incorporationCertificate.name}
              </p>
            )}
            {errors.incorporationCertificate && (
              <p className="mt-2 text-sm text-red-600">{errors.incorporationCertificate}</p>
            )}
          </div>
        )}

        <Input
          label="Name of Person Incharge"
          type="text"
          placeholder="Enter name of person incharge"
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
          placeholder={getPhonePlaceholder(formData.countryOrigin)}
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          error={errors.phoneNumber}
          required
          description={
            formData.countryOrigin 
              ? `Country code: ${getPhoneCode(formData.countryOrigin)}${formData.phoneNumber && formData.phoneNumber.startsWith(getPhoneCode(formData.countryOrigin)) ? ' ✓ Auto-formatted' : ''}`
              : 'Select a country to see the phone code'
          }
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

      {/* Click outside to close dropdown */}
      {isCountryDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsCountryDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default CompanyInformationStep;