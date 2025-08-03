import { isIndia } from '../../../utils/countries';

// Form validation utility functions
export const validateStep = (step, formData) => {
  const errors = {};

  switch (step) {
    case 1: // Company Information
      if (!formData.businessVertical) errors.businessVertical = 'Business vertical is required';
      if (!formData.companyName) errors.companyName = 'Company name is required';
      if (!formData.countryOrigin) errors.countryOrigin = 'Country of origin is required';
      if (!formData.contactPersonName) errors.contactPersonName = 'Name of person incharge is required';
      if (!formData.designation) errors.designation = 'Designation is required';
      if (!formData.email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
      if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
      if (!formData.yearEstablished) errors.yearEstablished = 'Year of establishment is required';
      if (!formData.businessDescription) errors.businessDescription = 'Business description is required';
      
      // Conditional validation based on country of origin
      if (formData.countryOrigin === 'IN') {
        if (!formData.registrationNumber) errors.registrationNumber = 'Company registration number is required';
      } else if (formData.countryOrigin && formData.countryOrigin !== 'IN') {
        if (!formData.incorporationCertificate) errors.incorporationCertificate = 'Company incorporation certificate is required';
      }
      break;

    case 2: // Address Details
      if (!formData.registeredAddress) errors.registeredAddress = 'Registered address is required';
      if (!formData.registeredCity) errors.registeredCity = 'City is required';
      if (!formData.registeredCountry) errors.registeredCountry = 'Country is required';
      if (!formData.registeredState) errors.registeredState = 'State is required';
      if (!formData.registeredPincode) errors.registeredPincode = 'PIN/Postal code is required';
      
      if (!formData.sameAsRegistered) {
        if (!formData.supplyAddress) errors.supplyAddress = 'Supply address is required';
        if (!formData.supplyCity) errors.supplyCity = 'Supply city is required';
        if (!formData.supplyCountry) errors.supplyCountry = 'Supply country is required';
        if (!formData.supplyState) errors.supplyState = 'Supply state is required';
        if (!formData.supplyPincode) errors.supplyPincode = 'Supply PIN/Postal code is required';
      }
      break;

    case 3: // Bank Information
      if (!formData.bankName) errors.bankName = 'Bank name is required';
      if (!formData.branchName) errors.branchName = 'Branch name is required';
      if (!formData.accountNumber) errors.accountNumber = 'Account number is required';
      if (!formData.confirmAccountNumber) errors.confirmAccountNumber = 'Please confirm account number';
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        errors.confirmAccountNumber = 'Account numbers do not match';
      }
      if (!formData.accountType) errors.accountType = 'Account type is required';
      if (!formData.bankAddress) errors.bankAddress = 'Bank address is required';
      if (!formData.bankProof) errors.bankProof = 'Bank proof document is required';
      
      if (formData.registeredCountry === 'IN') {
        if (!formData.ifscCode) errors.ifscCode = 'IFSC code is required';
        else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
          errors.ifscCode = 'Invalid IFSC code format';
        }
      } else {
        if (!formData.swiftCode) errors.swiftCode = 'Swift code is required';
        else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(formData.swiftCode)) {
          errors.swiftCode = 'Invalid Swift code format';
        }
      }
      break;

    case 4: // Categorization
      if (!formData.supplierType) errors.supplierType = 'Supplier type is required';
      if (!formData.supplierGroup) errors.supplierGroup = 'Supplier group is required';
      
      // Only validate supplier category for Indian vendors
      if (isIndia(formData.countryOrigin) && !formData.supplierCategory) {
        errors.supplierCategory = 'Supplier category is required';
      }
      
      if (!formData.annualTurnover) errors.annualTurnover = 'Annual turnover is required';
      if (!formData.productsServices) errors.productsServices = 'Products/services offered is required';
      if (!formData.industrySector) errors.industrySector = 'Industry sector is required';
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
      
      if (formData.registeredCountry === 'IN') {
        if (!formData.panNumber) errors.panNumber = 'PAN number is required';
        else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
          errors.panNumber = 'Invalid PAN format';
        }
        if (!formData.gstNumber) errors.gstNumber = 'GST number is required';
        else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber)) {
          errors.gstNumber = 'Invalid GST format';
        }
        if (!formData.natureOfAssessee) errors.natureOfAssessee = 'Nature of assessee is required';
        if (!formData.placeOfSupply) errors.placeOfSupply = 'Place of supply is required';
      } else {
        if (!formData.businessLicense) errors.businessLicense = 'Business license is required';
      }
      break;

    case 6: // Agreements
      const requiredAgreements = ['nda', 'sqa', 'fourM', 'codeOfConduct', 'complianceAgreement', 'selfDeclaration'];
      const agreementErrors = {};
      
      requiredAgreements.forEach(agreement => {
        if (!formData.agreements?.[agreement]) {
          agreementErrors[agreement] = 'This agreement must be accepted';
        }
      });
      
      if (Object.keys(agreementErrors).length > 0) {
        errors.agreements = agreementErrors;
      }
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