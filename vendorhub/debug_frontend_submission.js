// Debug script to test frontend form submission
// Run this in browser console on the registration form page

console.log('🔍 Frontend Form Submission Debug Tool');
console.log('=' .repeat(50));

// Mock form data that matches the frontend structure
const mockFormData = {
  // Company Information
  businessVertical: 'amber-enterprises',
  companyName: 'Test French Company',
  countryOrigin: 'FR',
  registrationNumber: 'FR123456789',
  incorporationCertificate: null,
  contactPersonName: 'Jean Dupont',
  designation: 'CEO',
  email: 'jean.dupont@testcompany.fr',
  phoneNumber: '+33123456789',
  website: 'https://www.testcompany.fr',
  yearEstablished: '2020',
  businessDescription: 'Technology solutions provider',

  // Address Details
  registeredAddress: '123 Rue de la Paix',
  registeredCity: 'Paris',
  registeredState: 'Île-de-France',
  registeredCountry: 'France',
  registeredPincode: '75001',
  sameAsRegistered: false,
  supplyAddress: '123 Rue de la Paix',
  supplyCity: 'Paris',
  supplyState: 'Île-de-France',
  supplyCountry: 'France',
  supplyPincode: '75001',

  // Bank Information
  bankName: 'BNP Paribas',
  branchName: 'Paris La Défense',
  accountNumber: '12345678901',
  confirmAccountNumber: '12345678901',
  accountType: 'Compte Professionnel',
  ifscCode: 'BNPAFRPPXXX',
  swiftCode: 'BNPAFRPPXXX',
  bankAddress: 'Paris, France',
  bankProof: null,

  // Categorization
  supplierType: 'service-provider',
  supplierGroup: 'technology',
  supplierCategory: 'software',
  annualTurnover: '5000000',
  productsServices: 'Software development, IT consulting',
  msmeStatus: 'not-registered',
  msmeCategory: '',
  msmeNumber: '',
  msmeCertificate: null,
  msmeDeclaration: false,
  industrySector: 'Technology',
  employeeCount: '50-100',
  certifications: 'ISO 9001, ISO 27001',

  // Compliance
  preferredCurrency: 'EUR',
  taxRegistrationNumber: 'FR12345678901',
  panNumber: '',
  gstNumber: '',
  natureOfAssessee: '',
  tanNumber: '',
  placeOfSupply: '',
  vatNumber: 'FR12345678901',
  businessLicense: '75001-2024-001234',
  complianceNotes: 'Compliant with French commercial law',
  creditRating: 'A+',
  insuranceCoverage: '€5,000,000',
  specialCertifications: 'ISO 9001:2015, ISO 14001:2015',
  gtaRegistration: 'yes',

  // Agreements
  agreements: {
    nda: true,
    sqa: true,
    fourM: true,
    codeOfConduct: true,
    complianceAgreement: true,
    selfDeclaration: true
  }
};

// Function to transform frontend data to backend format (matching handleSubmit logic)
function transformFormData(formData) {
  return {
    // Basic vendor information
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
    currency: formData.currency,
    
    // Supplier categorization
    supplier_type: formData.supplierType === 'service-provider' ? 'service_provider' : formData.supplierType,
    supplier_group: formData.supplierGroup,
    supplier_category: formData.supplierCategory === 'rw' ? 'rw-raw-material' : 
                     formData.supplierCategory === 'pk' ? 'pk-packaging' : 
                     formData.supplierCategory,
    annual_turnover: parseFloat(formData.annualTurnover),
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
}

// Test the transformation
console.log('📋 Original Form Data:');
console.log(mockFormData);

const transformedData = transformFormData(mockFormData);
console.log('\n🔄 Transformed Data:');
console.log(transformedData);

// Test API call
async function testSubmission() {
  const API_BASE_URL = 'http://localhost:8000/api/v1';
  
  try {
    console.log('\n🚀 Testing API submission...');
    console.log(`URL: ${API_BASE_URL}/vendors/public-registration`);
    
    const response = await fetch(`${API_BASE_URL}/vendors/public-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData)
    });

    console.log(`Response Status: ${response.status}`);
    console.log(`Response Headers:`, Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Submission successful!');
      console.log('Result:', result);
    } else {
      console.log('❌ Submission failed!');
      const errorData = await response.json();
      console.log('Error Details:', errorData);
      
      // Parse validation errors
      if (errorData.detail) {
        console.log('\n🔍 Validation Errors:');
        if (Array.isArray(errorData.detail)) {
          errorData.detail.forEach((error, index) => {
            console.log(`${index + 1}. Field: ${error.loc?.join(' -> ')}`);
            console.log(`   Error: ${error.msg}`);
            console.log(`   Type: ${error.type}`);
            console.log('---');
          });
        } else {
          console.log('Error:', errorData.detail);
        }
      }
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
}

// Run the test
testSubmission();

console.log('\n' + '=' .repeat(50));
console.log('Debug complete!'); 