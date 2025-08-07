// Form validation utility functions
import { isIndia } from '../../../utils/countries';

export const validateStep = (step, formData) => {
  const errors = {};

  switch (step) {
    case 1: // Company Information
      if (!formData.businessVertical) errors.businessVertical = 'Business vertical is required';
      if (!formData.companyName) errors.companyName = 'Company name is required';
      if (!formData.countryOrigin) errors.countryOrigin = 'Country of origin is required';
      
      // Conditional validation based on country
      if (isIndia(formData.countryOrigin)) {
        if (!formData.registrationNumber) errors.registrationNumber = 'Company registration number is required';
      } else {
        if (!formData.incorporationCertificate) errors.incorporationCertificate = 'Company incorporation certificate is required';
      }
      
      if (!formData.contactPersonName) errors.contactPersonName = 'Name of person in charge is required';
      if (!formData.email) errors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
      if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
      break;

    case 2: // Address Details
      if (!formData.registeredAddress) errors.registeredAddress = 'Registered address is required';
      if (!formData.registeredCity) errors.registeredCity = 'Registered city is required';
      if (!formData.registeredState) errors.registeredState = 'Registered state is required';
      if (!formData.registeredCountry) errors.registeredCountry = 'Registered country is required';
      if (!formData.registeredPincode) errors.registeredPincode = 'Registered pincode is required';
      
      if (!formData.supplyAddress) errors.supplyAddress = 'Supply address is required';
      if (!formData.supplyCity) errors.supplyCity = 'Supply city is required';
      if (!formData.supplyState) errors.supplyState = 'Supply state is required';
      if (!formData.supplyCountry) errors.supplyCountry = 'Supply country is required';
      if (!formData.supplyPincode) errors.supplyPincode = 'Supply pincode is required';
      break;

    case 3: // Bank Information
      if (!formData.bankName) errors.bankName = 'Bank name is required';
      if (!formData.accountNumber) errors.accountNumber = 'Account number is required';
      if (!formData.accountType) errors.accountType = 'Account type is required';
      if (!formData.branchName) errors.branchName = 'Branch name is required';
      if (!formData.bankAddress) errors.bankAddress = 'Bank address is required';
      if (!formData.bankProof) errors.bankProof = 'Bank proof document is required';
      
      // IFSC code validation only for Indian banks
      if (isIndia(formData.countryOrigin)) {
        if (!formData.ifscCode) errors.ifscCode = 'IFSC code is required';
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
          errors.ifscCode = 'Invalid IFSC code format';
        }
      } else {
        if (!formData.swiftCode) errors.swiftCode = 'Swift code is required';
      }
      break;

    case 4: // Supplier Categorization
      if (!formData.supplierType) errors.supplierType = 'Supplier type is required';
      if (!formData.supplierGroup) errors.supplierGroup = 'Supplier group is required';
      
      // Only validate supplier category for Indian vendors
      if (isIndia(formData.countryOrigin) && !formData.supplierCategory) {
        errors.supplierCategory = 'Supplier category is required';
      }
      
      if (!formData.annualTurnover) errors.annualTurnover = 'Annual turnover is required';
      if (!formData.industrySector) errors.industrySector = 'Industry sector is required';
      if (!formData.productsServices) errors.productsServices = 'Products/services offered is required';
      if (!formData.employeeCount) errors.employeeCount = 'Number of employees is required';
      
      // Only validate MSME fields for Indian vendors
      if (isIndia(formData.countryOrigin)) {
        if (!formData.msmeStatus) errors.msmeStatus = 'MSME status is required';
        
        if (formData.msmeStatus === 'registered') {
          if (!formData.msmeCategory) errors.msmeCategory = 'MSME category is required';
          if (!formData.msmeNumber) errors.msmeNumber = 'UDYAM registration number is required';
          if (!formData.msmeCertificate) errors.msmeCertificate = 'MSME certificate is required';
        } else if (formData.msmeStatus === 'not-registered') {
          if (!formData.msmeDeclaration) errors.msmeDeclaration = 'MSME declaration is required';
        }
      }
      break;

    case 5: // Compliance
      if (!formData.preferredCurrency) errors.preferredCurrency = 'Preferred currency is required';
      if (!formData.taxRegistrationNumber) errors.taxRegistrationNumber = 'Tax registration number is required';
      
      if (isIndia(formData.countryOrigin)) {
        if (!formData.panNumber) errors.panNumber = 'PAN number is required';
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
          errors.panNumber = 'Invalid PAN number format';
        }
        
        if (!formData.gstNumber) errors.gstNumber = 'GST number is required';
        else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
          errors.gstNumber = 'Invalid GST number format';
        }
      } else {
        if (!formData.vatNumber) errors.vatNumber = 'VAT number is required';
        if (!formData.businessLicense) errors.businessLicense = 'Business license is required';
      }
      
      // GTA Registration is required for both Indian and foreign vendors
      if (!formData.gtaRegistration) errors.gtaRegistration = 'GTA registration status is required';
      break;

    case 6: // Agreements
      // Helper function to check if supplier is ODM
      const isODMSupplier = () => {
        return formData.supplierGroup === 'odm-amber';
      };

      // Helper function to check if supplier is Indian
      const isIndianSupplier = () => {
        return isIndia(formData.countryOrigin);
      };

      // Define which agreements should be shown and validated
      const agreementsToValidate = [
        { id: 'nda', shouldShow: () => !isODMSupplier() },
        { id: 'sqa', shouldShow: () => isIndianSupplier() },
        { id: 'fourM', shouldShow: () => true },
        { id: 'codeOfConduct', shouldShow: () => true },
        { id: 'complianceAgreement', shouldShow: () => isIndianSupplier() },
        { id: 'selfDeclaration', shouldShow: () => true }
      ];

      // Validate only the agreements that should be shown
      agreementsToValidate.forEach(agreement => {
        if (agreement.shouldShow() && !formData.agreements?.[agreement.id]) {
          errors[`agreements.${agreement.id}`] = 'This agreement must be accepted';
        }
      });
      break;

    default:
      break;
  }

  return errors;
};

export const validateFileUpload = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
  if (!file) return 'File is required';
  
  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

export const canProceedToNextStep = (step, formData) => {
  const errors = validateStep(step, formData);
  return Object.keys(errors).length === 0;
};