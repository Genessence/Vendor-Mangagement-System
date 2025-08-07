import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormHeader from './components/FormHeader';
import CompanyInformationStep from './components/CompanyInformationStep';
import AddressDetailsStep from './components/AddressDetailsStep';
import BankInformationStep from './components/BankInformationStep';
import CategorizationStep from './components/CategorizationStep';
import ComplianceStep from './components/ComplianceStep';
import AgreementStep from './components/AgreementStep';
import FormNavigation from './components/FormNavigation';
import { validateStep, canProceedToNextStep } from './components/FormValidation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { API_BASE_URL } from '../../config/api';
import { formatPhoneNumber } from '../../utils/phoneCodes';
import { isIndia } from '../../utils/countries';

const PublicVendorRegistrationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const totalSteps = 6;

  // Initialize form data with default values
  const [formData, setFormData] = useState({
    // Company Information
    businessVertical: 'amber-enterprises',
    companyName: '',
    countryOrigin: '',
    registrationNumber: '',
    incorporationCertificate: null,
    contactPersonName: '',
    designation: '',
    email: '',
    phoneNumber: '',
    website: '',
    yearEstablished: '',
    businessDescription: '',

    // Address Details
    registeredAddress: '',
    registeredCity: '',
    registeredState: '',
    registeredCountry: '', // Will be auto-populated from countryOrigin
    registeredPincode: '',
    sameAsRegistered: false,
    supplyAddress: '',
    supplyCity: '',
    supplyState: '',
    supplyCountry: '', // Will be auto-populated from countryOrigin
    supplyPincode: '',

    // Bank Information
    bankName: '',
    branchName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    accountType: '',
    ifscCode: '',
    swiftCode: '',
    bankAddress: '',
    bankProof: null,

    // Categorization
    supplierType: '',
    supplierGroup: '',
    supplierCategory: '',
    annualTurnover: '',
    productsServices: '',
    msmeStatus: '',
    msmeCategory: '',
    msmeNumber: '',
    msmeCertificate: null,
    msmeDeclaration: false,
    industrySector: '',
    employeeCount: '',
    certifications: '',

    // Compliance
    preferredCurrency: 'INR',
    taxRegistrationNumber: '',
    panNumber: '',
    gstNumber: '',
    natureOfAssessee: '',
    tanNumber: '',
    placeOfSupply: '',
    vatNumber: '',
    businessLicense: '',
    complianceNotes: '',
    creditRating: '',
    insuranceCoverage: '',
    specialCertifications: '',
    gtaRegistration: '',

    // Agreements
    agreements: {
      nda: false,
      sqa: false,
      fourM: false,
      codeOfConduct: false,
      complianceAgreement: false,
      selfDeclaration: false
    }
  });

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('vendorRegistrationForm');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Clear invalid supplier types that don't match backend enum
        const validSupplierTypes = ['manufacturer', 'supplier', 'service_provider', 'distributor'];
        if (parsedData.supplierType && !validSupplierTypes.includes(parsedData.supplierType)) {
          console.log('⚠️ Clearing invalid supplier type:', parsedData.supplierType);
          parsedData.supplierType = '';
        }
        
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vendorRegistrationForm', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (updates) => {
    setFormData(prev => {
      const newFormData = { ...prev, ...updates };
      
      // Auto-sync country selection from Company Information to Address Details
      if (updates.countryOrigin && updates.countryOrigin !== prev.countryOrigin) {
        // Update both registered and supply country to match the selected country origin
        newFormData.registeredCountry = updates.countryOrigin;
        newFormData.supplyCountry = updates.countryOrigin;
        
        // Clear state fields when country changes (as states are country-specific)
        newFormData.registeredState = '';
        newFormData.supplyState = '';
        
        // Clear supplier category and MSME fields for non-Indian countries
        if (!isIndia(updates.countryOrigin)) {
          newFormData.supplierCategory = '';
          newFormData.msmeStatus = '';
          newFormData.msmeCategory = '';
          newFormData.msmeNumber = '';
          newFormData.msmeCertificate = null;
          newFormData.msmeDeclaration = false;
        }
      }
      
      // Auto-format phone number when country origin changes
      if (updates.countryOrigin && updates.countryOrigin !== prev.countryOrigin) {
        newFormData.phoneNumber = formatPhoneNumber(updates.countryOrigin, newFormData.phoneNumber);
      }
      
      return newFormData;
    });
    
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleGeneratePDF = () => {
    // Mock PDF generation
    const pdfContent = `
      VENDOR REGISTRATION AGREEMENT
      
      Company: ${formData.companyName}
      Registration Number: ${formData.registrationNumber}
      Contact Person: ${formData.contactPersonName}
      Email: ${formData.email}
      
      AGREEMENTS ACCEPTED:
      ${Object.entries(formData.agreements)
        .filter(([_, accepted]) => accepted)
        .map(([agreement, _]) => `✓ ${agreement.toUpperCase()}`)
        .join('\n')}
      
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}
      
      This document serves as confirmation of digital agreement acceptance.
    `;

    // Create and download PDF (mock implementation)
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-agreement-${formData.companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);

    // Check for required fields
    const requiredFields = {
      business_vertical: formData.businessVertical,
      company_name: formData.companyName,
      country_origin: formData.countryOrigin,
      contact_person_name: formData.contactPersonName,
      email: formData.email,
      phone_number: formData.phoneNumber
    };

    // Validate supplier type
    const validSupplierTypes = ['manufacturer', 'supplier', 'service_provider', 'distributor'];
    if (formData.supplierType && !validSupplierTypes.includes(formData.supplierType)) {
      setErrors({ 
        submit: `Invalid supplier type: ${formData.supplierType}. Must be one of: ${validSupplierTypes.join(', ')}` 
      });
      return;
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setErrors({ 
        submit: `Missing required fields: ${missingFields.join(', ')}` 
      });
      return;
    }

    if (Object.keys(stepErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Prepare vendor data for submission
        const vendorData = {
          // Basic vendor information
          business_vertical: formData.businessVertical,
          company_name: formData.companyName,
          country_origin: formData.countryOrigin,
          registration_number: formData.countryOrigin === 'IN' ? formData.registrationNumber : null,
          incorporation_certificate_path: formData.countryOrigin !== 'IN' ? (formData.incorporationCertificate?.name || null) : null,
          contact_person_name: formData.contactPersonName,
          designation: formData.designation,
          email: formData.email,
          phone_number: formData.phoneNumber,
          website: formData.website,
          year_established: formData.yearEstablished ? parseInt(formData.yearEstablished) : null,
          business_description: formData.businessDescription,
          
          // Address information
          registered_address: formData.registeredAddress,
          registered_city: formData.registeredCity,
          registered_state: formData.registeredState,
          registered_country: formData.registeredCountry,
          registered_pincode: formData.registeredPincode,
          supply_address: formData.supplyAddress,
          supply_city: formData.supplyCity,
          supply_state: formData.supplyState,
          supply_country: formData.supplyCountry,
          supply_pincode: formData.supplyPincode,
          
          // Bank information
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          account_type: formData.accountType,
          ifsc_code: formData.ifscCode,
          branch_name: formData.branchName,
          currency: formData.preferredCurrency, // Use preferred currency as bank currency
          
          // Supplier categorization
          supplier_type: formData.supplierType, // Now directly matches backend enum values
          supplier_group: formData.supplierGroup,
          supplier_category: formData.supplierCategory === 'rw' ? 'rw-raw-material' : 
                           formData.supplierCategory === 'pk' ? 'pk-packaging' : 
                           formData.supplierCategory,
          annual_turnover: formData.annualTurnover ? parseFloat(formData.annualTurnover) : null,
          products_services: formData.productsServices,
          msme_status: formData.msmeStatus === 'registered' ? 'msme' : (formData.msmeStatus === 'not-registered' ? 'non_msme' : 'pending'),
          msme_category: formData.msmeCategory,
          msme_number: formData.msmeNumber,
          industry_sector: formData.industrySector,
          employee_count: formData.employeeCount,
          certifications: formData.specialCertifications,
          
          // Compliance information
          pan_number: formData.panNumber,
          gst_number: formData.gstNumber,
          preferred_currency: formData.preferredCurrency,
          tax_registration_number: formData.taxRegistrationNumber,
          vat_number: formData.vatNumber,
          business_license: formData.businessLicense,
          gta_registration: formData.gtaRegistration,
          compliance_notes: formData.complianceNotes,
          credit_rating: formData.creditRating,
          insurance_coverage: formData.insuranceCoverage,
          special_certifications: formData.specialCertifications,
          
          // Agreements
          nda: formData.agreements?.nda || false,
          sqa: formData.agreements?.sqa || false,
          four_m: formData.agreements?.fourM || false,
          code_of_conduct: formData.agreements?.codeOfConduct || false,
          compliance_agreement: formData.agreements?.complianceAgreement || false,
          self_declaration: formData.agreements?.selfDeclaration || false
        };

        // Log the data being sent for debugging
        console.log('📤 Sending vendor data:', vendorData);
        console.log('🔍 Supplier Type being sent:', vendorData.supplier_type);
        console.log('🔍 Form Data Supplier Type:', formData.supplierType);
        console.log('🌐 API URL:', `${API_BASE_URL}/vendors/public-registration`);

        // Call the backend API to create vendor
        const response = await fetch(`${API_BASE_URL}/vendors/public-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vendorData)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ API Error:', errorData);
          
          // Handle validation errors
          if (response.status === 422 && errorData.detail) {
            let errorMessage = 'Validation errors:\n';
            if (Array.isArray(errorData.detail)) {
              errorData.detail.forEach((error, index) => {
                const fieldPath = error.loc?.join(' -> ') || 'unknown';
                errorMessage += `${index + 1}. ${fieldPath}: ${error.msg}\n`;
              });
            } else {
              errorMessage += errorData.detail;
            }
            throw new Error(errorMessage);
          }
          
          throw new Error(errorData.detail || 'Failed to create vendor');
        }

        const createdVendor = await response.json();
        console.log('Vendor created successfully:', createdVendor);
        
        // Clear saved form data
        localStorage.removeItem('vendorRegistrationForm');
        
        // Show success modal
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Submission error:', error);
        setErrors({ submit: error.message || 'Failed to submit registration. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/company-user-login');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyInformationStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <AddressDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <BankInformationStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <CategorizationStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 5:
        return (
          <ComplianceStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 6:
        return (
          <AgreementStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            onGeneratePDF={handleGeneratePDF}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = canProceedToNextStep(currentStep, formData);

  return (
    <div className="min-h-screen bg-background">
      {/* Form Header */}
      <FormHeader currentStep={currentStep} totalSteps={totalSteps} />

      {/* Main Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
        {renderCurrentStep()}
        
        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-8 bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
              <div>
                <h4 className="font-medium text-error mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-error space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>• {typeof error === 'string' ? error : 'Please check this field'}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Navigation */}
      <FormNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        canProceed={canProceed}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-200 p-4">
          <div className="bg-surface rounded-lg shadow-medium max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} color="white" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                Registration Submitted Successfully!
              </h3>
              
              <p className="text-text-secondary mb-6">
                Thank you for registering with Amber Enterprises India Limited. 
                Your application has been submitted and is now under review. 
                You will receive an email notification once the approval process is complete.
              </p>
              
              <div className="bg-muted/30 p-4 rounded-lg mb-6">
                <div className="text-sm text-text-secondary">
                  <div className="flex justify-between mb-2">
                    <span>Application ID:</span>
                    <span className="font-mono font-medium">VR-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Submitted:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-warning font-medium">Under Review</span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="default"
                onClick={handleSuccessModalClose}
                fullWidth
              >
                Continue to Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicVendorRegistrationForm;