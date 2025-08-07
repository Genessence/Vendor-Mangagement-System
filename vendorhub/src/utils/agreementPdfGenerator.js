import jsPDF from 'jspdf';

// PDF Layout Constants
const MARGINS = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 20
};

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGINS.left - MARGINS.right;
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGINS.top - MARGINS.bottom;

// Helper function to check if content fits on current page
const checkPageBreak = (doc, yPosition, requiredSpace = 10) => {
  if (yPosition + requiredSpace > PAGE_HEIGHT - MARGINS.bottom) {
    doc.addPage();
    return MARGINS.top;
  }
  return yPosition;
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  } catch (error) {
    return 'N/A';
  }
};

// Helper function to format date for agreement content
const formatDateForAgreement = (dateString) => {
  if (!dateString) return 'the date of registration';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'the date of registration';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'the date of registration';
  }
};

// Helper function to format supplier type
const formatSupplierType = (supplierType) => {
  if (!supplierType) return 'N/A';
  
  // Handle enum values
  if (typeof supplierType === 'object' && supplierType.value) {
    return supplierType.value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Handle string values
  if (typeof supplierType === 'string') {
    return supplierType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return 'N/A';
};

// Helper function to convert country code to full country name
const getCountryName = (countryCode) => {
  if (!countryCode) return 'N/A';
  
  const countries = {
    'IN': 'India',
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'CN': 'China',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'IT': 'Italy',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'BE': 'Belgium',
    'IE': 'Ireland',
    'NZ': 'New Zealand',
    'SG': 'Singapore',
    'HK': 'Hong Kong',
    'KR': 'South Korea',
    'TW': 'Taiwan',
    'TH': 'Thailand',
    'MY': 'Malaysia',
    'PH': 'Philippines',
    'ID': 'Indonesia',
    'VN': 'Vietnam',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'IL': 'Israel',
    'TR': 'Turkey',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'HU': 'Hungary',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'HR': 'Croatia',
    'SI': 'Slovenia',
    'SK': 'Slovakia',
    'LT': 'Lithuania',
    'LV': 'Latvia',
    'EE': 'Estonia',
    'PT': 'Portugal',
    'GR': 'Greece',
    'CY': 'Cyprus',
    'MT': 'Malta',
    'LU': 'Luxembourg',
    'IS': 'Iceland',
    'LI': 'Liechtenstein',
    'MC': 'Monaco',
    'AD': 'Andorra',
    'SM': 'San Marino',
    'VA': 'Vatican City',
    'RU': 'Russia',
    'UA': 'Ukraine',
    'BY': 'Belarus',
    'MD': 'Moldova',
    'GE': 'Georgia',
    'AM': 'Armenia',
    'AZ': 'Azerbaijan',
    'KZ': 'Kazakhstan',
    'UZ': 'Uzbekistan',
    'KG': 'Kyrgyzstan',
    'TJ': 'Tajikistan',
    'TM': 'Turkmenistan',
    'AF': 'Afghanistan',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'NP': 'Nepal',
    'BT': 'Bhutan',
    'MV': 'Maldives',
    'MM': 'Myanmar',
    'LA': 'Laos',
    'KH': 'Cambodia',
    'MN': 'Mongolia',
    'KP': 'North Korea',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'SY': 'Syria',
    'LB': 'Lebanon',
    'JO': 'Jordan',
    'KW': 'Kuwait',
    'QA': 'Qatar',
    'BH': 'Bahrain',
    'OM': 'Oman',
    'YE': 'Yemen',
    'EG': 'Egypt',
    'LY': 'Libya',
    'TN': 'Tunisia',
    'DZ': 'Algeria',
    'MA': 'Morocco',
    'SD': 'Sudan',
    'SS': 'South Sudan',
    'ET': 'Ethiopia',
    'ER': 'Eritrea',
    'DJ': 'Djibouti',
    'SO': 'Somalia',
    'KE': 'Kenya',
    'UG': 'Uganda',
    'TZ': 'Tanzania',
    'RW': 'Rwanda',
    'BI': 'Burundi',
    'MZ': 'Mozambique',
    'ZW': 'Zimbabwe',
    'ZM': 'Zambia',
    'MW': 'Malawi',
    'BW': 'Botswana',
    'NA': 'Namibia',
    'SZ': 'Eswatini',
    'LS': 'Lesotho',
    'ZA': 'South Africa',
    'MG': 'Madagascar',
    'MU': 'Mauritius',
    'SC': 'Seychelles',
    'KM': 'Comoros',
    'CV': 'Cape Verde',
    'GW': 'Guinea-Bissau',
    'GN': 'Guinea',
    'SL': 'Sierra Leone',
    'LR': 'Liberia',
    'CI': 'Ivory Coast',
    'GH': 'Ghana',
    'TG': 'Togo',
    'BJ': 'Benin',
    'NG': 'Nigeria',
    'CM': 'Cameroon',
    'GQ': 'Equatorial Guinea',
    'GA': 'Gabon',
    'CG': 'Republic of the Congo',
    'CD': 'Democratic Republic of the Congo',
    'CF': 'Central African Republic',
    'TD': 'Chad',
    'NE': 'Niger',
    'ML': 'Mali',
    'BF': 'Burkina Faso',
    'SN': 'Senegal',
    'GM': 'Gambia',
    'MR': 'Mauritania',
    'EH': 'Western Sahara',
    'MA': 'Morocco',
    'TN': 'Tunisia',
    'DZ': 'Algeria',
    'LY': 'Libya',
    'EG': 'Egypt',
    'SD': 'Sudan',
    'SS': 'South Sudan',
    'ET': 'Ethiopia',
    'ER': 'Eritrea',
    'DJ': 'Djibouti',
    'SO': 'Somalia',
    'KE': 'Kenya',
    'UG': 'Uganda',
    'TZ': 'Tanzania',
    'RW': 'Rwanda',
    'BI': 'Burundi',
    'MZ': 'Mozambique',
    'ZW': 'Zimbabwe',
    'ZM': 'Zambia',
    'MW': 'Malawi',
    'BW': 'Botswana',
    'NA': 'Namibia',
    'SZ': 'Eswatini',
    'LS': 'Lesotho',
    'ZA': 'South Africa',
    'MG': 'Madagascar',
    'MU': 'Mauritius',
    'SC': 'Seychelles',
    'KM': 'Comoros',
    'CV': 'Cape Verde',
    'GW': 'Guinea-Bissau',
    'GN': 'Guinea',
    'SL': 'Sierra Leone',
    'LR': 'Liberia',
    'CI': 'Ivory Coast',
    'GH': 'Ghana',
    'TG': 'Togo',
    'BJ': 'Benin',
    'NG': 'Nigeria',
    'CM': 'Cameroon',
    'GQ': 'Equatorial Guinea',
    'GA': 'Gabon',
    'CG': 'Republic of the Congo',
    'CD': 'Democratic Republic of the Congo',
    'CF': 'Central African Republic',
    'TD': 'Chad',
    'NE': 'Niger',
    'ML': 'Mali',
    'BF': 'Burkina Faso',
    'SN': 'Senegal',
    'GM': 'Gambia',
    'MR': 'Mauritania',
    'EH': 'Western Sahara'
  };
  
  return countries[countryCode.toUpperCase()] || countryCode;
};

// Generate agreement content based on type
const generateAgreementContent = (agreementTitle, vendor) => {
  const registrationDate = formatDateForAgreement(vendor.created_at || vendor.registration_date);
  const formattedDate = formatDate(vendor.created_at || vendor.registration_date);
  
  if (agreementTitle.includes("NDA")) {
    return `NON-DISCLOSURE AGREEMENT (NDA)

This Non-Disclosure Agreement is made and entered into on ${registrationDate} by and between:

VENDOR: ${vendor.company_name}
Address: ${vendor.registered_address || 'N/A'}
Contact: ${vendor.contact_person_name}

And

COMPANY: Amber Compliance System
Address: [Company Address]

WHEREAS, the parties may disclose confidential information to each other;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by one party to the other, including but not limited to business plans, technical data, customer lists, pricing information, and proprietary processes.

2. NON-DISCLOSURE OBLIGATIONS
The receiving party agrees to:
- Keep confidential all Confidential Information
- Use Confidential Information only for the purpose of the business relationship
- Not disclose Confidential Information to any third party without prior written consent
- Return or destroy all Confidential Information upon termination of the relationship

3. TERM
This agreement shall remain in effect for the duration of the business relationship and for a period of 5 years thereafter.

4. REMEDIES
The disclosing party shall be entitled to seek injunctive relief and damages for any breach of this agreement.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first above written.

VENDOR: ${vendor.company_name}
By: ${vendor.contact_person_name}
Date: ${formattedDate}

COMPANY: Amber Compliance System
By: [Authorized Signatory]
Date: ${formattedDate}`;
  }
  
  if (agreementTitle.includes("SQA")) {
    return `SUPPLIER QUALITY AGREEMENT (SQA)

This Supplier Quality Agreement is made and entered into on ${registrationDate} by and between:

VENDOR: ${vendor.company_name}
Address: ${vendor.registered_address || 'N/A'}
Contact: ${vendor.contact_person_name}

And

COMPANY: Amber Compliance System
Address: [Company Address]

WHEREAS, the parties desire to establish quality standards for products/services;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. QUALITY STANDARDS
The Vendor shall maintain quality standards as specified by the Company and applicable industry standards.

2. QUALITY CONTROL
The Vendor shall implement and maintain a quality control system that includes:
- Regular quality inspections
- Documentation of quality procedures
- Training of personnel on quality requirements
- Corrective action procedures

3. COMPLIANCE
The Vendor shall comply with all applicable laws, regulations, and industry standards.

4. AUDIT RIGHTS
The Company shall have the right to audit the Vendor's quality systems and facilities.

5. TERM
This agreement shall be effective for one year from the date of signing and shall automatically renew unless terminated.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first above written.

VENDOR: ${vendor.company_name}
By: ${vendor.contact_person_name}
Date: ${formattedDate}

COMPANY: Amber Compliance System
By: [Authorized Signatory]
Date: ${formattedDate}`;
  }
  
  if (agreementTitle.includes("4M")) {
    return `4M CHANGE MANAGEMENT AGREEMENT

This 4M Change Management Agreement is made and entered into on ${registrationDate} by and between:

VENDOR: ${vendor.company_name}
Address: ${vendor.registered_address || 'N/A'}
Contact: ${vendor.contact_person_name}

And

COMPANY: Amber Compliance System
Address: [Company Address]

WHEREAS, the parties recognize the importance of managing changes in Man, Machine, Material, and Method (4M);

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. CHANGE MANAGEMENT PROCESS
The Vendor shall notify the Company of any changes in:
- Man: Key personnel changes
- Machine: Equipment or technology changes
- Material: Raw materials or components
- Method: Processes or procedures

2. NOTIFICATION REQUIREMENTS
The Vendor shall provide written notification at least 30 days prior to implementing any 4M changes.

3. APPROVAL PROCESS
Changes requiring approval shall be reviewed by the Company within 15 days of notification.

4. DOCUMENTATION
All changes shall be properly documented and records maintained for audit purposes.

5. TERM
This agreement shall be effective for one year from the date of signing and shall automatically renew.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first above written.

VENDOR: ${vendor.company_name}
By: ${vendor.contact_person_name}
Date: ${formattedDate}

COMPANY: Amber Compliance System
By: [Authorized Signatory]
Date: ${formattedDate}`;
  }
  
  if (agreementTitle.includes("Code of Conduct")) {
    return `CODE OF CONDUCT AGREEMENT

This Code of Conduct Agreement is made and entered into on ${registrationDate} by and between:

VENDOR: ${vendor.company_name}
Address: ${vendor.registered_address || 'N/A'}
Contact: ${vendor.contact_person_name}

And

COMPANY: Amber Compliance System
Address: [Company Address]

WHEREAS, the parties are committed to maintaining high ethical standards;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. ETHICAL STANDARDS
The Vendor shall maintain high ethical standards in all business dealings, including:
- Honesty and integrity
- Fair dealing with all parties
- Compliance with applicable laws and regulations
- Respect for human rights and labor standards

2. ANTI-CORRUPTION
The Vendor shall not engage in any form of corruption, bribery, or unethical practices.

3. CONFLICT OF INTEREST
The Vendor shall avoid conflicts of interest and disclose any potential conflicts.

4. CONFIDENTIALITY
The Vendor shall maintain confidentiality of sensitive information.

5. COMPLIANCE
The Vendor shall comply with all applicable laws, regulations, and industry standards.

6. TERM
This agreement shall remain in effect for the duration of the business relationship.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first above written.

VENDOR: ${vendor.company_name}
By: ${vendor.contact_person_name}
Date: ${formattedDate}

COMPANY: Amber Compliance System
By: [Authorized Signatory]
Date: ${formattedDate}`;
  }
  
  if (agreementTitle.includes("Compliance Agreement")) {
    return `COMPLIANCE AGREEMENT

This Compliance Agreement is made and entered into on ${registrationDate} by and between:

VENDOR: ${vendor.company_name}
Address: ${vendor.registered_address || 'N/A'}
Contact: ${vendor.contact_person_name}

And

COMPANY: Amber Compliance System
Address: [Company Address]

WHEREAS, the parties are committed to maintaining compliance with all applicable regulations;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. REGULATORY COMPLIANCE
The Vendor shall comply with all applicable laws, regulations, and industry standards, including:
- Environmental regulations
- Safety standards
- Labor laws
- Industry-specific regulations

2. CERTIFICATIONS
The Vendor shall maintain all required certifications and licenses.

3. AUDIT COOPERATION
The Vendor shall cooperate with regulatory audits and inspections.

4. REPORTING
The Vendor shall promptly report any compliance issues or violations.

5. TRAINING
The Vendor shall ensure that personnel are trained on compliance requirements.

6. TERM
This agreement shall be effective for one year from the date of signing and shall automatically renew.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first above written.

VENDOR: ${vendor.company_name}
By: ${vendor.contact_person_name}
Date: ${formattedDate}

COMPANY: Amber Compliance System
By: [Authorized Signatory]
Date: ${formattedDate}`;
  }
  
  if (agreementTitle.includes("Self Declaration")) {
    return `SELF DECLARATION

This Self Declaration is made on ${registrationDate} by:

VENDOR: ${vendor.company_name}
Address: ${vendor.registered_address || 'N/A'}
Contact: ${vendor.contact_person_name}

I/We hereby declare that:

1. ACCURACY OF INFORMATION
All information provided during the registration process is true, accurate, and complete to the best of my/our knowledge.

2. COMPLIANCE STATUS
The company is in compliance with all applicable laws, regulations, and industry standards.

3. FINANCIAL STABILITY
The company is financially stable and capable of fulfilling its obligations.

4. QUALITY CAPABILITY
The company has the capability to provide products/services that meet quality standards.

5. ETHICAL STANDARDS
The company maintains high ethical standards and has not been involved in any unethical practices.

6. UPDATES
I/We will promptly notify of any changes to the information provided in this declaration.

7. CONSEQUENCES
I/We understand that providing false information may result in termination of the business relationship.

This declaration is made under penalty of perjury and is valid for one year from the date of signing.

VENDOR: ${vendor.company_name}
By: ${vendor.contact_person_name}
Date: ${formattedDate}

WITNESS: [Witness Name]
Date: ${formattedDate}`;
  }
  
  // Generic agreement content
  return `REGISTRATION AGREEMENT

This Registration Agreement is made and entered into on ${registrationDate} by and between:

VENDOR: ${vendor.company_name}
Address: ${vendor.registered_address || 'N/A'}
Contact: ${vendor.contact_person_name}

And

COMPANY: Amber Compliance System
Address: [Company Address]

WHEREAS, the parties desire to establish a business relationship;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. SCOPE OF WORK
The Vendor shall provide services/products as described in the registration documents.

2. TERM
This agreement shall be effective from the date of registration and shall remain in force until terminated.

3. COMPLIANCE
Both parties agree to comply with all applicable laws and regulations.

4. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of any proprietary information shared.

5. TERMINATION
Either party may terminate this agreement with written notice.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first above written.

VENDOR: ${vendor.company_name}
By: ${vendor.contact_person_name}
Date: ${formattedDate}

COMPANY: Amber Compliance System
By: [Authorized Signatory]
Date: ${formattedDate}`;
};

// Main function to generate agreement PDF
export const generateAgreementPDF = (agreement, vendor) => {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `${agreement.title} - ${vendor.company_name}`,
    subject: 'Vendor Agreement',
    author: 'Amber Compliance System',
    creator: 'Vendor Management System'
  });
  
  // Colors
  const primaryColor = [31, 41, 55]; // #1f2937
  const secondaryColor = [107, 114, 128]; // #6b7280
  const accentColor = [59, 130, 246]; // #3b82f6
  
  // Start position with margins
  let yPos = MARGINS.top;
  
  // Title - Split into two lines for better fit
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  
  // Main title
  doc.text('Registration Agreement', PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Agreement type subtitle
  doc.setFontSize(18);
  doc.text(agreement.title, PAGE_WIDTH / 2, yPos, { align: 'center' });
  
  yPos += 25;
  
  // Agreement Details Section
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Agreement Details', MARGINS.left, yPos);
  
  yPos += 10;
  
  // Agreement details table
  const detailsData = [
    ['Agreement Type', agreement.type],
    ['Status', agreement.status],
    ['Signed Date', formatDate(agreement.signed_date || vendor.created_at || vendor.registration_date)],
    ['Signed By', agreement.signed_by || vendor.contact_person_name],
    ['Valid Until', agreement.valid_until],
    ['Registration Date', formatDate(vendor.created_at || vendor.registration_date)]
  ];
  
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  
  detailsData.forEach(([label, value], index) => {
    // Check page break before adding content
    yPos = checkPageBreak(doc, yPos, 10);
    
    // Background for header row
    if (index === 0) {
      doc.setFillColor(...primaryColor);
      doc.rect(MARGINS.left, yPos - 5, CONTENT_WIDTH, 8, 'F');
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(index % 2 === 0 ? 249 : 243); // #f9fafb : #f3f4f6
      doc.rect(MARGINS.left, yPos - 5, CONTENT_WIDTH, 8, 'F');
      doc.setTextColor(...primaryColor);
    }
    
    doc.text(label, MARGINS.left + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value || 'N/A', MARGINS.left + 85, yPos);
    doc.setFont('helvetica', 'bold');
    
    yPos += 10;
  });
  
  // Vendor Information Section
  yPos += 10;
  yPos = checkPageBreak(doc, yPos, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Vendor Information', MARGINS.left, yPos);
  
  yPos += 10;
  
  const vendorData = [
    ['Company Name', vendor.company_name],
    ['Vendor Code', vendor.vendor_code],
    ['Contact Person', vendor.contact_person_name],
    ['Email', vendor.email],
    ['Phone', vendor.phone_number],
    ['Country of Origin', getCountryName(vendor.country_origin)],
    ['Business Vertical', vendor.business_vertical],
    ['Supplier Type', formatSupplierType(vendor.supplier_type)]
  ];
  
  doc.setFontSize(10);
  vendorData.forEach(([label, value], index) => {
    // Check page break before adding content
    yPos = checkPageBreak(doc, yPos, 10);
    
    // Background for header row
    if (index === 0) {
      doc.setFillColor(...primaryColor);
      doc.rect(MARGINS.left, yPos - 5, CONTENT_WIDTH, 8, 'F');
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(index % 2 === 0 ? 249 : 243); // #f9fafb : #f3f4f6
      doc.rect(MARGINS.left, yPos - 5, CONTENT_WIDTH, 8, 'F');
      doc.setTextColor(...primaryColor);
    }
    
    doc.text(label, MARGINS.left + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value || 'N/A', MARGINS.left + 85, yPos);
    doc.setFont('helvetica', 'bold');
    
    yPos += 10;
  });
  
  // Agreement Content Section
  yPos += 10;
  yPos = checkPageBreak(doc, yPos, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Agreement Content', MARGINS.left, yPos);
  
  yPos += 10;
  
  // Generate agreement content
  const agreementContent = generateAgreementContent(agreement.title, vendor);
  
  // Add content with proper formatting
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'normal');
  
  const splitContent = doc.splitTextToSize(agreementContent, CONTENT_WIDTH);
  
  splitContent.forEach((line, index) => {
    // Check page break before adding content
    yPos = checkPageBreak(doc, yPos, 5);
    
    doc.text(line, MARGINS.left, yPos);
    yPos += 5;
  });
  
  // Footer
  yPos = checkPageBreak(doc, yPos, 20);
  
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`, MARGINS.left, yPos);
  doc.text(`Vendor: ${vendor.company_name} (${vendor.vendor_code})`, MARGINS.left, yPos + 5);
  doc.text(`Agreement: ${agreement.title}`, MARGINS.left, yPos + 10);
  doc.text('This is a registration agreement signed during vendor onboarding', MARGINS.left, yPos + 15);
  
  // Save the PDF
  const filename = `registration_agreement_${agreement.title.replace(/\s+/g, '_')}_${vendor.vendor_code}.pdf`;
  doc.save(filename);
  
  return filename;
};

// Function to generate PDF for detailed agreements (placeholder for future use)
export const generateDetailedAgreementPDF = (agreement, vendor) => {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `${agreement.title} - ${vendor.company_name}`,
    subject: 'Detailed Vendor Agreement',
    author: 'Amber Compliance System',
    creator: 'Vendor Management System'
  });
  
  // Colors
  const primaryColor = [31, 41, 55]; // #1f2937
  const secondaryColor = [107, 114, 128]; // #6b7280
  
  // Start position with margins
  let yPos = MARGINS.top;
  
  // Title - Split into two lines for better fit
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  
  // Main title
  doc.text('Detailed Agreement', PAGE_WIDTH / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Agreement type subtitle
  doc.setFontSize(18);
  doc.text(agreement.title, PAGE_WIDTH / 2, yPos, { align: 'center' });
  
  yPos += 25;
  
  // Agreement details
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Agreement Details', MARGINS.left, yPos);
  
  yPos += 10;
  
  const detailsData = [
    ['Agreement Type', agreement.type],
    ['Status', agreement.status],
    ['Signed Date', formatDate(agreement.signed_date)],
    ['Signed By', agreement.signed_by],
    ['Valid Until', agreement.valid_until],
    ['Document Size', agreement.document_size],
    ['Last Modified', formatDate(agreement.last_modified)]
  ];
  
  doc.setFontSize(10);
  detailsData.forEach(([label, value], index) => {
    // Check page break before adding content
    yPos = checkPageBreak(doc, yPos, 10);
    
    if (index === 0) {
      doc.setFillColor(...primaryColor);
      doc.rect(MARGINS.left, yPos - 5, CONTENT_WIDTH, 8, 'F');
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(index % 2 === 0 ? 249 : 243);
      doc.rect(MARGINS.left, yPos - 5, CONTENT_WIDTH, 8, 'F');
      doc.setTextColor(...primaryColor);
    }
    
    doc.text(label, MARGINS.left + 5, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value || 'N/A', MARGINS.left + 85, yPos);
    doc.setFont('helvetica', 'bold');
    
    yPos += 10;
  });
  
  // Description
  yPos += 10;
  yPos = checkPageBreak(doc, yPos, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', MARGINS.left, yPos);
  
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descriptionLines = doc.splitTextToSize(agreement.description || 'No description available', CONTENT_WIDTH);
  
  descriptionLines.forEach(line => {
    // Check page break before adding content
    yPos = checkPageBreak(doc, yPos, 5);
    
    doc.text(line, MARGINS.left, yPos);
    yPos += 5;
  });
  
  // Footer
  yPos = checkPageBreak(doc, yPos, 20);
  
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}`, MARGINS.left, yPos);
  doc.text(`Vendor: ${vendor.company_name} (${vendor.vendor_code})`, MARGINS.left, yPos + 5);
  doc.text(`Agreement: ${agreement.title}`, MARGINS.left, yPos + 10);
  doc.text('This is a detailed agreement document', MARGINS.left, yPos + 15);
  
  // Save the PDF
  const filename = `detailed_agreement_${agreement.id}_${vendor.vendor_code}.pdf`;
  doc.save(filename);
  
  return filename;
}; 