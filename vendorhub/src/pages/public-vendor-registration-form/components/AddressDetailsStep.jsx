import React, { useState, useMemo } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { countries, filterCountries, getCountryByCode, isIndia } from '../../../utils/countries';
import { getStateOptions } from '../../../utils/states';

const AddressDetailsStep = ({ formData, updateFormData, errors }) => {
  const [registeredCountrySearch, setRegisteredCountrySearch] = useState('');
  const [supplyCountrySearch, setSupplyCountrySearch] = useState('');
  const [isRegisteredCountryOpen, setIsRegisteredCountryOpen] = useState(false);
  const [isSupplyCountryOpen, setIsSupplyCountryOpen] = useState(false);

  // Filter countries based on search terms
  const filteredRegisteredCountries = useMemo(() => {
    return filterCountries(registeredCountrySearch);
  }, [registeredCountrySearch]);

  const filteredSupplyCountries = useMemo(() => {
    return filterCountries(supplyCountrySearch);
  }, [supplyCountrySearch]);

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleRegisteredCountrySelect = (countryCode) => {
    handleInputChange('registeredCountry', countryCode);
    setIsRegisteredCountryOpen(false);
    setRegisteredCountrySearch('');
  };

  const handleSupplyCountrySelect = (countryCode) => {
    handleInputChange('supplyCountry', countryCode);
    setIsSupplyCountryOpen(false);
    setSupplyCountrySearch('');
  };

  const handleSameAsRegistered = (checked) => {
    if (checked) {
      updateFormData({
        sameAsRegistered: true,
        supplyAddress: formData.registeredAddress,
        supplyCity: formData.registeredCity,
        supplyState: formData.registeredState,
        supplyCountry: formData.registeredCountry,
        supplyPincode: formData.registeredPincode
      });
    } else {
      updateFormData({
        sameAsRegistered: false,
        supplyAddress: '',
        supplyCity: '',
        supplyState: '',
        supplyCountry: '',
        supplyPincode: ''
      });
    }
  };

  const isRegisteredIndian = isIndia(formData.registeredCountry);
  const isSupplyIndian = isIndia(formData.supplyCountry);
  const registeredCountry = getCountryByCode(formData.registeredCountry);
  const supplyCountry = getCountryByCode(formData.supplyCountry);

  const registeredStateOptions = getStateOptions(formData.registeredCountry);
  const supplyStateOptions = getStateOptions(formData.supplyCountry);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Address Details</h2>
        <p className="text-text-secondary">Provide your registered office and supply address information.</p>
        {formData.countryOrigin && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">💡 Tip:</span> The country has been automatically filled from your Company Information. 
              You can change it if needed, or proceed with the pre-filled selection.
            </p>
          </div>
        )}
      </div>

      {/* Registered Address */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Registered Office Address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Address Line 1"
              type="text"
              placeholder="Enter address line 1"
              value={formData.registeredAddress}
              onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
              error={errors.registeredAddress}
              required
            />
          </div>

          <Input
            label="City"
            type="text"
            placeholder="Enter city"
            value={formData.registeredCity}
            onChange={(e) => handleInputChange('registeredCity', e.target.value)}
            error={errors.registeredCity}
            required
          />

          {/* Registered Country Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">
              Country <span className="text-red-500">*</span>
              {formData.registeredCountry && (
                <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  ✓ Auto-filled from Company Information
                </span>
              )}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRegisteredCountryOpen(!isRegisteredCountryOpen)}
                className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.registeredCountry ? 'border-red-500' : 'border-gray-300'
                } ${formData.registeredCountry ? 'text-foreground' : 'text-gray-500'} ${
                  formData.registeredCountry && formData.registeredCountry === formData.countryOrigin 
                    ? 'bg-green-50 border-green-300' 
                    : ''
                }`}
              >
                {registeredCountry ? registeredCountry.label : 'Select a country'}
              </button>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {isRegisteredCountryOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={registeredCountrySearch}
                    onChange={(e) => setRegisteredCountrySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredRegisteredCountries.length > 0 ? (
                    filteredRegisteredCountries.map((country) => (
                      <button
                        key={country.value}
                        type="button"
                        onClick={() => handleRegisteredCountrySelect(country.value)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                          formData.registeredCountry === country.value ? 'bg-primary text-white hover:bg-primary-dark' : ''
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

            {errors.registeredCountry && (
              <p className="mt-1 text-sm text-red-600">{errors.registeredCountry}</p>
            )}
          </div>

          {registeredStateOptions.length > 0 ? (
            <Select
              label={isRegisteredIndian ? "State" : "State/Province"}
              options={registeredStateOptions}
              value={formData.registeredState}
              onChange={(value) => handleInputChange('registeredState', value)}
              error={errors.registeredState}
              searchable
              required
            />
          ) : (
            <Input
              label="State/Province"
              type="text"
              placeholder="Enter state or province"
              value={formData.registeredState}
              onChange={(e) => handleInputChange('registeredState', e.target.value)}
              error={errors.registeredState}
              required
            />
          )}

          <Input
            label={isRegisteredIndian ? "PIN Code" : "Postal Code"}
            type="text"
            placeholder={isRegisteredIndian ? "Enter PIN code" : "Enter postal code"}
            value={formData.registeredPincode}
            onChange={(e) => handleInputChange('registeredPincode', e.target.value)}
            error={errors.registeredPincode}
            required
          />
        </div>
      </div>

      {/* Supply Address */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Supply Address</h3>
          <Checkbox
            label="Same as registered address"
            checked={formData.sameAsRegistered}
            onChange={(e) => handleSameAsRegistered(e.target.checked)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Address Line 1"
              type="text"
              placeholder="Enter address line 1"
              value={formData.supplyAddress}
              onChange={(e) => handleInputChange('supplyAddress', e.target.value)}
              error={errors.supplyAddress}
              disabled={formData.sameAsRegistered}
              required
            />
          </div>

          <Input
            label="City"
            type="text"
            placeholder="Enter city"
            value={formData.supplyCity}
            onChange={(e) => handleInputChange('supplyCity', e.target.value)}
            error={errors.supplyCity}
            disabled={formData.sameAsRegistered}
            required
          />

          {/* Supply Country Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">
              Country <span className="text-red-500">*</span>
              {formData.supplyCountry && (
                <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  ✓ Auto-filled from Company Information
                </span>
              )}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => !formData.sameAsRegistered && setIsSupplyCountryOpen(!isSupplyCountryOpen)}
                disabled={formData.sameAsRegistered}
                className={`w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.supplyCountry ? 'border-red-500' : 'border-gray-300'
                } ${formData.supplyCountry ? 'text-foreground' : 'text-gray-500'} ${
                  formData.sameAsRegistered ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  formData.supplyCountry && formData.supplyCountry === formData.countryOrigin && !formData.sameAsRegistered
                    ? 'bg-green-50 border-green-300' 
                    : ''
                }`}
              >
                {supplyCountry ? supplyCountry.label : 'Select a country'}
              </button>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {isSupplyCountryOpen && !formData.sameAsRegistered && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={supplyCountrySearch}
                    onChange={(e) => setSupplyCountrySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredSupplyCountries.length > 0 ? (
                    filteredSupplyCountries.map((country) => (
                      <button
                        key={country.value}
                        type="button"
                        onClick={() => handleSupplyCountrySelect(country.value)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                          formData.supplyCountry === country.value ? 'bg-primary text-white hover:bg-primary-dark' : ''
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

            {errors.supplyCountry && (
              <p className="mt-1 text-sm text-red-600">{errors.supplyCountry}</p>
            )}
          </div>

          {supplyStateOptions.length > 0 ? (
            <Select
              label={isSupplyIndian ? "State" : "State/Province"}
              options={supplyStateOptions}
              value={formData.supplyState}
              onChange={(value) => handleInputChange('supplyState', value)}
              error={errors.supplyState}
              disabled={formData.sameAsRegistered}
              searchable
              required
            />
          ) : (
            <Input
              label="State/Province"
              type="text"
              placeholder="Enter state or province"
              value={formData.supplyState}
              onChange={(e) => handleInputChange('supplyState', e.target.value)}
              error={errors.supplyState}
              disabled={formData.sameAsRegistered}
              required
            />
          )}

          <Input
            label={isSupplyIndian ? "PIN Code" : "Postal Code"}
            type="text"
            placeholder={isSupplyIndian ? "Enter PIN code" : "Enter postal code"}
            value={formData.supplyPincode}
            onChange={(e) => handleInputChange('supplyPincode', e.target.value)}
            error={errors.supplyPincode}
            disabled={formData.sameAsRegistered}
            required
          />
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isRegisteredCountryOpen || isSupplyCountryOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsRegisteredCountryOpen(false);
            setIsSupplyCountryOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AddressDetailsStep;