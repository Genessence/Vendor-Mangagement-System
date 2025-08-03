import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import jsPDF from 'jspdf';

const CategorizationStep = ({ formData, updateFormData, errors }) => {
  const [showMSMEDeclaration, setShowMSMEDeclaration] = useState(false);

  const supplierTypes = [
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'trader', label: 'Trader' },
    { value: 'service-provider', label: 'Service Provider' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'consultant', label: 'Consultant' }
  ];

  // Updated supplier groups as per requirements
  const supplierGroups = [
    { value: 'oem-customer', label: 'OEM-Customer Referred Supplier' },
    { value: 'odm-amber', label: 'ODM-Amber Developed Supplier' },
    { value: 'other', label: 'Other' }
  ];

  // Updated supplier categories as per requirements
  const supplierCategories = [
    { value: 'rw', label: 'RW-Raw Material' },
    { value: 'pk', label: 'PK-Packaging' },
    { value: 'consumables', label: 'Consumables' },
    { value: 'others', label: 'Others' }
  ];

  // MSME categories
  const msmeCategories = [
    { value: 'micro', label: 'Micro' },
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleFileUpload = (field, file) => {
    updateFormData({ [field]: file });
  };

  const handleMSMEChange = (value) => {
    updateFormData({ 
      msmeStatus: value,
      msmeDeclaration: false,
      msmeCertificate: null,
      msmeCategory: '',
      msmeNumber: ''
    });
  };

  const generateMSMEDeclarationPDF = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    const formattedTime = currentDate.toLocaleTimeString('en-GB');

    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font styles
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    
    // Company name and contact person
    doc.text(`${formData.contactPersonName} (${formData.companyName})`, 20, 30);
    
    // Title
    doc.setFontSize(14);
    doc.text('DECLARATION OF REGISTRATION IN NON MSME', 20, 50);
    
    // Reset font for body text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Declaration text
    const declarationText = `This is to certify that our company ${formData.companyName} located at ${formData.registeredAddress}, ${formData.registeredCity}, ${formData.registeredState}, ${formData.registeredCountry} and now has not registered under Micro, Small, Medium enterprises (MSME) development Act 2006 as on date of declaration.`;
    
    // Split text to fit page width
    const splitText = doc.splitTextToSize(declarationText, 170);
    doc.text(splitText, 20, 70);
    
    // Signature section
    doc.text('For and on behalf of', 20, 120);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.contactPersonName, 20, 130);
    doc.setFont('helvetica', 'normal');
    doc.text('(Digitally Signed)', 20, 140);
    
    // Address
    const addressText = `${formData.registeredAddress}, ${formData.registeredCity}, ${formData.registeredState}, ${formData.registeredCountry}`;
    const splitAddress = doc.splitTextToSize(addressText, 170);
    doc.text(splitAddress, 20, 150);
    
    // Footer with timestamp
    doc.setFontSize(10);
    doc.text(`Document has been digitally signed with acceptance on Amber Compliance System at ${formattedTime} on ${formattedDate}`, 20, 180);
    
    // Save the PDF
    const fileName = `msme-declaration-${formData.companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(fileName);

    // Update form to indicate declaration was generated
    updateFormData({ msmeDeclaration: true });
    setShowMSMEDeclaration(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Supplier Categorization</h2>
        <p className="text-text-secondary">
          Help us categorize your business to streamline our procurement process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Supplier Type"
          description="Select the type that best describes your business"
          options={supplierTypes}
          value={formData.supplierType}
          onChange={(value) => handleInputChange('supplierType', value)}
          error={errors.supplierType}
          required
        />

        <Select
          label="Supplier Group"
          description="Select the primary category of products/services you provide"
          options={supplierGroups}
          value={formData.supplierGroup}
          onChange={(value) => handleInputChange('supplierGroup', value)}
          error={errors.supplierGroup}
          required
        />

        <Select
          label="Supplier Category"
          description="Select the category that best describes your offerings"
          options={supplierCategories}
          value={formData.supplierCategory}
          onChange={(value) => handleInputChange('supplierCategory', value)}
          error={errors.supplierCategory}
          required
        />

        <Input
          label="Annual Turnover (₹)"
          type="number"
          placeholder="Enter annual turnover in INR"
          value={formData.annualTurnover}
          onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
          error={errors.annualTurnover}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Products/Services Offered"
            type="text"
            placeholder="Briefly describe the main products or services you offer"
            value={formData.productsServices}
            onChange={(e) => handleInputChange('productsServices', e.target.value)}
            error={errors.productsServices}
            required
          />
        </div>
      </div>

      {/* MSME Status Section */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">MSME Status</h3>
        <p className="text-sm text-text-secondary mb-4">
          Micro, Small & Medium Enterprises (MSME) registration provides various benefits under government schemes.
        </p>

        <div className="space-y-4">
          <Select
            label="MSME Registration Status"
            options={[
              { value: 'registered', label: 'MSME Registered' },
              { value: 'not-registered', label: 'Not MSME Registered' }
            ]}
            value={formData.msmeStatus}
            onChange={handleMSMEChange}
            error={errors.msmeStatus}
            required
          />

          {formData.msmeStatus === 'registered' && (
            <div className="space-y-4">
              <Select
                label="MSME Category"
                options={msmeCategories}
                value={formData.msmeCategory}
                onChange={(value) => handleInputChange('msmeCategory', value)}
                error={errors.msmeCategory}
                required
              />

              <Input
                label="UDYAM Registration Number"
                type="text"
                placeholder="Enter UDYAM registration number"
                value={formData.msmeNumber}
                onChange={(e) => handleInputChange('msmeNumber', e.target.value)}
                error={errors.msmeNumber}
                required
              />

              <Input
                label="MSME Certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('msmeCertificate', e.target.files[0])}
                error={errors.msmeCertificate}
                required
              />

              {formData.msmeCertificate && (
                <div className="text-sm text-success">
                  ✓ Certificate uploaded: {formData.msmeCertificate.name}
                </div>
              )}
            </div>
          )}

          {formData.msmeStatus === 'not-registered' && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-3">
                  <strong>Note:</strong> If you are not MSME registered, you need to generate a declaration document.
                </p>
                <button
                  type="button"
                  onClick={() => setShowMSMEDeclaration(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Generate MSME Declaration
                </button>
              </div>

              {formData.msmeDeclaration && (
                <div className="text-sm text-success">
                  ✓ MSME Declaration PDF has been generated and downloaded
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Classifications */}
      <div className="bg-muted/30 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Additional Classifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Industry Sector"
            type="text"
            placeholder="e.g., Automotive, Electronics, Textiles"
            value={formData.industrySector}
            onChange={(e) => handleInputChange('industrySector', e.target.value)}
            error={errors.industrySector}
            required
          />

          <Input
            label="Number of Employees"
            type="number"
            placeholder="Enter total number of employees"
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
            error={errors.employeeCount}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Key Certifications"
              type="text"
              placeholder="e.g., ISO 9001, ISO 14001, OHSAS 18001 (comma separated)"
              value={formData.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              error={errors.certifications}
            />
          </div>
        </div>
      </div>

      {/* MSME Declaration Modal */}
      {showMSMEDeclaration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Generate MSME Declaration</h3>
            <p className="text-sm text-gray-600 mb-6">
              This will generate a declaration document stating that your company is not registered under MSME. 
              The PDF document will be automatically downloaded.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={generateMSMEDeclarationPDF}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Generate & Download
              </button>
              <button
                type="button"
                onClick={() => setShowMSMEDeclaration(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorizationStep;