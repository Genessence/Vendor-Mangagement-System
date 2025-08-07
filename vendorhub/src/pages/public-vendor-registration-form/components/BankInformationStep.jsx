import React, { useRef } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BankInformationStep = ({ formData, updateFormData, errors }) => {
  const fileInputRef = useRef(null);
  
  // Updated account types - removed "Cash Credit Account" for all countries
  const accountTypes = [
    { value: 'savings', label: 'Savings Account' },
    { value: 'current', label: 'Current Account' },
    { value: 'od', label: 'Overdraft Account' }
  ];

  const handleInputChange = (field, value) => {
    // Auto-uppercase IFSC and Swift codes
    if (field === 'ifscCode' || field === 'swiftCode') {
      value = value.toUpperCase();
    }
    updateFormData({ [field]: value });
  };

  const handleFileUpload = (field, file) => {
    updateFormData({ [field]: file });
  };

  const handleRemoveFile = (field) => {
    updateFormData({ [field]: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isIndian = formData.registeredCountry === 'IN';

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Bank Information</h2>
        <p className="text-text-secondary">
          Provide your banking details and upload required bank proof documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Bank Name"
          type="text"
          placeholder="Enter bank name"
          value={formData.bankName}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
          error={errors.bankName}
          required
        />

        <Input
          label="Branch Name"
          type="text"
          placeholder="Enter branch name"
          value={formData.branchName}
          onChange={(e) => handleInputChange('branchName', e.target.value)}
          error={errors.branchName}
          required
        />

        <Input
          label="Account Number"
          type="text"
          placeholder="Enter account number"
          value={formData.accountNumber}
          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
          error={errors.accountNumber}
          required
        />

        <Input
          label="Confirm Account Number"
          type="text"
          placeholder="Re-enter account number"
          value={formData.confirmAccountNumber}
          onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value)}
          error={errors.confirmAccountNumber}
          required
        />

        {isIndian ? (
          <>
            <Input
              label="IFSC Code"
              type="text"
              placeholder="Enter IFSC code"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange('ifscCode', e.target.value)}
              error={errors.ifscCode}
              required
            />

            <Select
              label="Account Type"
              options={accountTypes}
              value={formData.accountType}
              onChange={(value) => handleInputChange('accountType', value)}
              error={errors.accountType}
              required
            />
          </>
        ) : (
          <>
            <Input
              label="Swift Code"
              type="text"
              placeholder="Enter Swift code"
              value={formData.swiftCode}
              onChange={(e) => handleInputChange('swiftCode', e.target.value)}
              error={errors.swiftCode}
              required
            />

            <Select
              label="Account Type"
              options={accountTypes}
              value={formData.accountType}
              onChange={(value) => handleInputChange('accountType', value)}
              error={errors.accountType}
              required
            />
          </>
        )}

        <div className="md:col-span-2">
          <Input
            label="Bank Address"
            type="text"
            placeholder="Enter complete bank address"
            value={formData.bankAddress}
            onChange={(e) => handleInputChange('bankAddress', e.target.value)}
            error={errors.bankAddress}
            required
          />
        </div>

        {/* Bank Proof Upload */}
        <div className="md:col-span-2 bg-muted/30 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4">Bank Proof Document</h3>
          <p className="text-sm text-text-secondary mb-4">
            {isIndian 
              ? "Upload a cancelled cheque or bank statement (PDF, JPG, PNG - Max 5MB)"
              : "Upload signed and stamped letterhead or official bank document (PDF, JPG, PNG - Max 5MB)"
            }
          </p>
          
          <Input
            label={isIndian ? "Cancelled Cheque" : "Signed and Stamped Letter head"}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('bankProof', e.target.files[0])}
            error={errors.bankProof}
            required
            inputRef={fileInputRef}
          />
          {formData.bankProof && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-success">
              <span>✓ File uploaded: {formData.bankProof.name}</span>
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-error text-white rounded hover:bg-error/80"
                onClick={() => handleRemoveFile('bankProof')}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure account number matches exactly with your bank records</li>
              <li>• {isIndian ? 'IFSC code' : 'Swift code'} will be automatically validated</li>
              <li>• Bank proof document should be clear and readable</li>
              <li>• All payments will be processed to this account only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankInformationStep;