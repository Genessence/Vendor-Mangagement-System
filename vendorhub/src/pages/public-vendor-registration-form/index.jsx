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

    if (Object.keys(stepErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Prepare vendor data for submission
        const vendorData = {
          business_vertical: formData.businessVertical,
          company_name: formData.companyName,
          country_origin: formData.countryOrigin,
          registration_number: formData.countryOrigin === 'IN' ? formData.registrationNumber : null,
          incorporation_certificate_path: formData.countryOrigin !== 'IN' ? formData.incorporationCertificate?.name : null,
          contact_person_name: formData.contactPersonName,
          designation: formData.designation,
          email: formData.email,
          phone_number: formData.phoneNumber,
          website: formData.website,
          year_established: parseInt(formData.yearEstablished),
          business_description: formData.businessDescription,
          // Add other fields as needed
        };

        // Handle file upload for incorporation certificate
        if (formData.countryOrigin !== 'IN' && formData.incorporationCertificate) {
          const formDataFile = new FormData();
          formDataFile.append('file', formData.incorporationCertificate);
          formDataFile.append('document_type', 'incorporation_certificate');
          formDataFile.append('vendor_id', 'temp'); // Will be updated after vendor creation
          
          // Upload file first
          // const uploadResponse = await fetch(`${API_BASE_URL}/documents/upload/temp`, {
          //   method: 'POST',
          //   body: formDataFile,
          // });
          // const uploadResult = await uploadResponse.json();
          // vendorData.incorporation_certificate_path = uploadResult.file_path;
        }

        // Mock API submission for now
        console.log('Submitting vendor data:', vendorData);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear saved form data
        localStorage.removeItem('vendorRegistrationForm');
        
        // Show success modal
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Submission error:', error);
        setErrors({ submit: 'Failed to submit registration. Please try again.' });
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