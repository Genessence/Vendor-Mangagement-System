import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddressDetailsStep = ({ formData, updateFormData, errors }) => {
  const countries = [
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'SG', label: 'Singapore' },
    { value: 'AE', label: 'United Arab Emirates' }
  ];

  const indianStates = [
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CG', label: 'Chhattisgarh' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'DH', label: 'Dadra and Nagar Haveli' },
    { value: 'DD', label: 'Daman and Diu' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'LA', label: 'Ladakh' },
    { value: 'LD', label: 'Lakshadweep' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PY', label: 'Puducherry' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TS', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UK', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
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

  const isIndian = formData.registeredCountry === 'IN';

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Address Details</h2>
        <p className="text-text-secondary">Provide your registered office and supply address information.</p>
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

          <Select
            label="Country"
            options={countries}
            value={formData.registeredCountry}
            onChange={(value) => handleInputChange('registeredCountry', value)}
            error={errors.registeredCountry}
            searchable
            required
          />

          {isIndian ? (
            <Select
              label="State"
              options={indianStates}
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
            label={isIndian ? "PIN Code" : "Postal Code"}
            type="text"
            placeholder={isIndian ? "Enter PIN code" : "Enter postal code"}
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

          <Select
            label="Country"
            options={countries}
            value={formData.supplyCountry}
            onChange={(value) => handleInputChange('supplyCountry', value)}
            error={errors.supplyCountry}
            disabled={formData.sameAsRegistered}
            searchable
            required
          />

          {formData.supplyCountry === 'IN' ? (
            <Select
              label="State"
              options={indianStates}
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
            label={formData.supplyCountry === 'IN' ? "PIN Code" : "Postal Code"}
            type="text"
            placeholder={formData.supplyCountry === 'IN' ? "Enter PIN code" : "Enter postal code"}
            value={formData.supplyPincode}
            onChange={(e) => handleInputChange('supplyPincode', e.target.value)}
            error={errors.supplyPincode}
            disabled={formData.sameAsRegistered}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsStep;