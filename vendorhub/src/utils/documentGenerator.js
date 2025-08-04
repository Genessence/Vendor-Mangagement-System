import jsPDF from 'jspdf';

// Helper function to format date
const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Helper function to get current date in required format
const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate();
  const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10 ? day % 10 : 0)];
  return `${day}${suffix} day of ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
};

// Helper function to get company type based on country
const getCompanyType = (countryOrigin) => {
  if (countryOrigin === 'IN') {
    return 'a Company incorporated under the Indian Companies Act, 1913';
  } else {
    return 'a Company incorporated under the laws of its respective jurisdiction';
  }
};

// Helper function to format address
const formatAddress = (address, city, state, country) => {
  const parts = [address, city, state, country].filter(Boolean);
  return parts.join(', ');
};

// Generate NDA Document
export const generateNDA = (vendorData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 20;

  // Set font styles
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Title
  doc.text('NON-DISCLOSURE AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Reset font for body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Introduction
  const introText = `This Non Disclosure Agreement (the "Agreement") is made and executed on this ${getCurrentDate()} (the "Effective Date"), at ${vendorData.registeredCity || 'the specified location'}, by and between`;
  const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * lineHeight + 10;

  // Vendor (Discloser) Information
  const vendorCompanyType = getCompanyType(vendorData.countryOrigin);
  const vendorRegisteredAddress = formatAddress(
    vendorData.registeredAddress,
    vendorData.registeredCity,
    vendorData.registeredState,
    vendorData.registeredCountry
  );
  const vendorSupplyAddress = formatAddress(
    vendorData.supplyAddress,
    vendorData.supplyCity,
    vendorData.supplyState,
    vendorData.supplyCountry
  );

  const vendorText = `${vendorData.companyName}, ${vendorCompanyType} and having its registered office at ${vendorRegisteredAddress}${vendorSupplyAddress ? ` and inter alia one of its branch office at ${vendorSupplyAddress}` : ''} (hereinafter referred to as "the Discloser") which expression shall, unless it be repugnant or inconsistent with the context or meaning hereof, be deemed to mean and include its successors and assigns) of the One Part;`;
  
  const vendorLines = doc.splitTextToSize(vendorText, pageWidth - 2 * margin);
  doc.text(vendorLines, margin, yPosition);
  yPosition += vendorLines.length * lineHeight + 10;

  // Amber Enterprises (Recipient) Information
  const amberText = `AND\n\nAMBER ENTERPRISES INDIA LIMITED, a Company incorporated under the Companies Act, 1956 and having its registered office at C-1, Phase –II, Focal Point, Rajpura Town – 140 401, Punjab and Corporate Office at Universal Trade Tower, 1st Floor, Sector 49, Sohna Road, Gurgaon - 122 101 and inter alias its place of business at Dehradun (Uttarakhand) (hereinafter referred to as "the Recipient") which expression shall, unless it be repugnant or inconsistent with the context hereof, mean and include its successors and assigns) of the Other Part;`;
  
  const amberLines = doc.splitTextToSize(amberText, pageWidth - 2 * margin);
  doc.text(amberLines, margin, yPosition);
  yPosition += amberLines.length * lineHeight + 10;

  // Parties definition
  const partiesText = 'The Discloser and the Recipient are hereinafter individually known as the "Party" and collectively known as the "Parties".';
  const partiesLines = doc.splitTextToSize(partiesText, pageWidth - 2 * margin);
  doc.text(partiesLines, margin, yPosition);
  yPosition += partiesLines.length * lineHeight + 15;

  // WHEREAS section
  doc.setFont('helvetica', 'bold');
  doc.text('WHEREAS', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');

  const whereasPoints = [
    'The Parties are in the process of evaluating potential business relationship for developing the industrial designs created by the Discloser in the Air Conditioner category, the Recipient will conduct the entire exercise of engineering design, mould & tooling design, tool development & eventual pilot & commercial production of new AC parts designs ("Purpose") created by the Discloser and in connection with the Purpose, the Discloser will disclose/exchange information or furnish data which is private, Confidential and Proprietary Information (collectively referred to as "Confidential and Proprietary Information");',
    'The mutual objective under this Agreement is to provide protection for such Confidential and Proprietary Information while maintaining each Party\'s independence and ability to conduct their individual business activities without let or hindrance;',
    'The Parties have mutually agreed that the provisions of this Agreement shall govern the use and revelation of all Confidential and Proprietary Information disclosed on all matters either arising out of, under, or in relation to, the discussions between the Parties in relation to the Purpose of this Agreement, regardless of the date on which such Confidential and Proprietary Information was actually disclosed;',
    'The Recipient shall not use the industrial designs for any other Purpose other than the Purpose specified in this Agreement;',
    'These Industrial designs are property of the Discloser and the same can be supplied to the Discloser or used in the Products of the Discloser only upon establishment of tools and moulds design by the Recipient for the Discloser;',
    'The Parties wish to maintain the Confidential and Proprietary Information at the stage of negotiation and thereafter;'
  ];

  whereasPoints.forEach((point, index) => {
    const pointText = `${String.fromCharCode(97 + index)}. ${point}`;
    const pointLines = doc.splitTextToSize(pointText, pageWidth - 2 * margin);
    doc.text(pointLines, margin, yPosition);
    yPosition += pointLines.length * lineHeight + 5;
  });

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // NOW, THEREFORE section
  const nowThereforeText = 'NOW, THEREFORE, in consideration of the Discloser disclosing its Confidential and Proprietary Information to the Recipient, the receipt and sufficiency of which is hereby acknowledged by the Parties, the Parties agree to as follows:';
  const nowThereforeLines = doc.splitTextToSize(nowThereforeText, pageWidth - 2 * margin);
  doc.text(nowThereforeLines, margin, yPosition);
  yPosition += nowThereforeLines.length * lineHeight + 10;

  // Add standard NDA clauses (abbreviated for space)
  const clauses = [
    '1. Confidential and Proprietary Information:',
    '   "Confidential and Proprietary Information" shall mean any and all information and data in any form...',
    '',
    '2. Undertaking by the Recipient:',
    '   The Recipient shall use the Confidential and Proprietary Information solely in connection with the Purpose...',
    '',
    '3. Term:',
    '   This Agreement will be in force for a period of (2) two years from the Effective Date...',
    '',
    '4. Jurisdiction:',
    '   This Agreement shall in all respects, be governed by and construed in accordance with laws of the Republic of India...'
  ];

  clauses.forEach(clause => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    const clauseLines = doc.splitTextToSize(clause, pageWidth - 2 * margin);
    doc.text(clauseLines, margin, yPosition);
    yPosition += clauseLines.length * lineHeight + 5;
  });

  // Add new page for signatures
  doc.addPage();
  yPosition = 20;

  // Signature section
  doc.setFont('helvetica', 'bold');
  doc.text('Agreed to:', margin, yPosition);
  yPosition += 15;

  // Vendor signature
  doc.setFont('helvetica', 'normal');
  doc.text(`${vendorData.companyName}`, margin, yPosition);
  yPosition += 10;
  doc.text('By', margin, yPosition);
  yPosition += 10;
  doc.text(`${vendorData.contactPersonName}`, margin, yPosition);
  yPosition += 10;
  doc.text('Authorized Signatory', margin, yPosition);
  yPosition += 10;
  doc.text(`Name: ${vendorData.contactPersonName}`, margin, yPosition);
  yPosition += 10;
  doc.text(`Title: ${vendorData.designation || 'Authorized Representative'}`, margin, yPosition);
  yPosition += 10;
  doc.text(`Date: ${formatDate(new Date())}`, margin, yPosition);

  // Amber Enterprises signature (right side)
  const rightMargin = pageWidth - margin - 80;
  doc.text('AMBER ENTERPRISES INDIA LIMITED', rightMargin, yPosition - 50);
  yPosition += 10;
  doc.text('By', rightMargin, yPosition - 50);
  yPosition += 10;
  doc.text('Authorized Signatory', rightMargin, yPosition - 50);
  yPosition += 10;
  doc.text('Name: _________________', rightMargin, yPosition - 50);
  yPosition += 10;
  doc.text('Title: _________________', rightMargin, yPosition - 50);
  yPosition += 10;
  doc.text(`Date: ${formatDate(new Date())}`, rightMargin, yPosition - 50);

  // Footer
  doc.setFontSize(10);
  doc.text(`Document generated on ${formatDate(new Date())} for ${vendorData.companyName}`, pageWidth / 2, 280, { align: 'center' });

  return doc;
};

// Export function to generate and download NDA
export const generateAndDownloadNDA = (vendorData) => {
  const doc = generateNDA(vendorData);
  const fileName = `nda-${vendorData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  return fileName;
};

// Generate SQA Document
export const generateSQA = (vendorData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 20;

  // Set font styles
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  
  // Header with stamp paper note
  doc.text('On 100/- Stamp paper', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Title
  doc.setFontSize(16);
  doc.text('SUPPLIER QUALITY AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Reset font for body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Introduction
  const introText = `This Supplier Quality Agreement ("Quality Agreement" or "Agreement") is entered into by and between ${vendorData.companyName} having a principal place of business at ${formatAddress(vendorData.registeredAddress, vendorData.registeredCity, vendorData.registeredState, vendorData.registeredCountry)} & Production Unit at ${formatAddress(vendorData.supplyAddress, vendorData.supplyCity, vendorData.supplyState, vendorData.supplyCountry)} hereafter referred to as ("Supplier") and Amber Enterprises India Limited having a principal place of business at Universal Trade Tower, 1st Floor, Sector – 49, Sohna Road, Gurugram – 122 018, hereafter referred to as ("Amber").`;
  
  const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * lineHeight + 10;

  const effectiveText = 'The "Quality Agreement" is effective as of the date of last signature by the parties below:';
  const effectiveLines = doc.splitTextToSize(effectiveText, pageWidth - 2 * margin);
  doc.text(effectiveLines, margin, yPosition);
  yPosition += effectiveLines.length * lineHeight + 15;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Section 1: Purpose/Scope
  doc.setFont('helvetica', 'bold');
  doc.text('1. Purpose/Scope', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const purposeText = 'To establish the basic principle governing development quality, manufacture, delivery, quality, warranty etc. of the various Bought out/Supplies to all Amber units.';
  const purposeLines = doc.splitTextToSize(purposeText, pageWidth - 2 * margin);
  doc.text(purposeLines, margin, yPosition);
  yPosition += purposeLines.length * lineHeight + 10;

  // Section 2: Products/Services
  doc.setFont('helvetica', 'bold');
  doc.text('2. Products/Services', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const productsText = `The Product covers supplies under the ${vendorData.productsServices || 'specified products/services'} to Amber Enterprises India Limited.`;
  const productsLines = doc.splitTextToSize(productsText, pageWidth - 2 * margin);
  doc.text(productsLines, margin, yPosition);
  yPosition += productsLines.length * lineHeight + 10;

  // Section 3: Validity
  doc.setFont('helvetica', 'bold');
  doc.text('3. Validity', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const validityText = 'This Agreement shall be valid for an initial period of 24 months from the date of execution. The Agreement shall get renewed automatically for a further period of 24 months from the date of expiry of initial period, unless otherwise refused either by AMBER or SUPPLIER. Such refusal shall be communicated in writing at least 30 days before expiry of the Agreement.';
  const validityLines = doc.splitTextToSize(validityText, pageWidth - 2 * margin);
  doc.text(validityLines, margin, yPosition);
  yPosition += validityLines.length * lineHeight + 10;

  // Add new page for detailed clauses
  doc.addPage();
  yPosition = 20;

  // Section 4: Order of Precedence
  doc.setFont('helvetica', 'bold');
  doc.text('4. Order of Precedence (with respect to Quality Requirements only)', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const precedenceItems = [
    '1. Purchase Order',
    '2. Engineering drawings',
    '3. Engineering and material specifications',
    '4. QAF-0069-C "Acknowledgement of Supplementary Supplier Quality Requirements for Purchased Materials or Services"',
    '5. Amber Master Supply Agreement (if any)',
    '6. QAF-0082-C "Supplier Quality Agreement for Purchased Materials or Services"',
    '7. QAR-0001-C "Supplier Quality Requirements for Purchased Materials or Services"'
  ];

  precedenceItems.forEach(item => {
    const itemLines = doc.splitTextToSize(item, pageWidth - 2 * margin);
    doc.text(itemLines, margin, yPosition);
    yPosition += itemLines.length * lineHeight + 3;
  });

  yPosition += 10;

  // Section 5: General Quality Requirements
  doc.setFont('helvetica', 'bold');
  doc.text('5. General Quality Requirements', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');

  const qualityRequirements = [
    'a) The supplier confirms to ISO 9001:2015 as of basic Quality Management System requirement or else Specific suppliers will agree to initiate ISO certification process followed by certification within 1 year of signing this Agreement.',
    'b) The material shall be as per AMBER specification, to be understood by the supplier clearly at the time of development.',
    'c) Suppliers shall own full responsibility for the quality of the supplied part.',
    'd) AMBER will inspect the parts on a sampling basis received from the supplier till the supplier achieves DOL status.',
    'e) The supplier must send the Pre Dispatch Inspection Report (PDIR / JIR), Test certificate or other as per AMBER Inspection requirement.',
    'f) AMBER shall not allow any type of segregation or rework at their end.',
    'g) Response to all Quality problems shall be entertained as per defined way.',
    'h) SUPPLIER shall upfront inform AMBER about any changes in 4M (Man, Machine, Material, and Method).'
  ];

  qualityRequirements.forEach((req, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    const reqLines = doc.splitTextToSize(req, pageWidth - 2 * margin);
    doc.text(reqLines, margin, yPosition);
    yPosition += reqLines.length * lineHeight + 5;
  });

  // Add new page for remaining sections
  doc.addPage();
  yPosition = 20;

  // Section 6: Delivery
  doc.setFont('helvetica', 'bold');
  doc.text('6. Delivery', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');

  const deliveryText = 'a) AMBER will issue indicative & firm delivery schedule & supplier has to deliver the goods on time as per AMBER schedule.';
  const deliveryLines = doc.splitTextToSize(deliveryText, pageWidth - 2 * margin);
  doc.text(deliveryLines, margin, yPosition);
  yPosition += deliveryLines.length * lineHeight + 10;

  // Section 7: Development
  doc.setFont('helvetica', 'bold');
  doc.text('7. Development', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');

  const developmentText = 'a) Supplier shall ensure development of parts on time as per agreed time plan.';
  const developmentLines = doc.splitTextToSize(developmentText, pageWidth - 2 * margin);
  doc.text(developmentLines, margin, yPosition);
  yPosition += developmentLines.length * lineHeight + 10;

  // Section 8: Warranty
  doc.setFont('helvetica', 'bold');
  doc.text('8. Warranty', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');

  const warrantyText = 'a) SUPPLIER shall ensure that supplied material meets AMBER specifications & is manufactured as per agreed manufacturing processes & standards. To cover up warranty related to any functional components specific design of the supplier (Which is merely not the direct commodity) SUPPLIER shall give the warranty of 18 months from the date of invoice of all the parts supplied to AMBER.';
  const warrantyLines = doc.splitTextToSize(warrantyText, pageWidth - 2 * margin);
  doc.text(warrantyLines, margin, yPosition);
  yPosition += warrantyLines.length * lineHeight + 10;

  // Add new page for signatures
  doc.addPage();
  yPosition = 20;

  // Execution statement
  const executionText = `This Purchase Agreement is executed on Date ${formatDate(new Date())} between AMBER ENTERPRISES INDIA LIMITED and ${vendorData.companyName}`;
  const executionLines = doc.splitTextToSize(executionText, pageWidth - 2 * margin);
  doc.text(executionLines, margin, yPosition);
  yPosition += executionLines.length * lineHeight + 20;

  // Signature section
  doc.setFont('helvetica', 'bold');
  doc.text('FOR & ON BEHALF OF AMBER ENTERPRISES INDIA LTD.', margin, yPosition);
  yPosition += 15;
  doc.text('FOR AND ON BEHALF OF', margin + 100, yPosition);
  yPosition += 15;

  // Amber signature details
  doc.setFont('helvetica', 'normal');
  doc.text('Name : _________________', margin, yPosition);
  doc.text('Name :', margin + 100, yPosition);
  yPosition += 10;
  doc.text('Title : CEO-RAC', margin, yPosition);
  doc.text('Title :', margin + 100, yPosition);
  yPosition += 10;
  doc.text('Signature : _________________', margin, yPosition);
  doc.text('Signature :', margin + 100, yPosition);
  yPosition += 10;
  doc.text(`Date : ${formatDate(new Date())}`, margin, yPosition);
  doc.text('Date :', margin + 100, yPosition);

  // Footer
  doc.setFontSize(10);
  doc.text(`Document generated on ${formatDate(new Date())} for ${vendorData.companyName}`, pageWidth / 2, 280, { align: 'center' });

  return doc;
};

// Export function to generate and download SQA
export const generateAndDownloadSQA = (vendorData) => {
  const doc = generateSQA(vendorData);
  const fileName = `sqa-${vendorData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  return fileName;
};

// Generate 4M Change Control Declaration
export const generate4MDeclaration = (vendorData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 20;

  // Set font styles
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Title
  doc.text('4M CHANGE CONTROL', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  doc.text('DECLARATION LETTER', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  // Reset font for body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // To section
  doc.text('To,', margin, yPosition);
  yPosition += 15;
  doc.text('Date:', margin, yPosition);
  doc.text(formatDate(new Date()), margin + 20, yPosition);
  yPosition += 15;

  // Amber address
  doc.text('Amber Enterprises India Ltd.', margin, yPosition);
  yPosition += 10;
  doc.text('Selaqui – Dehradun', margin, yPosition);
  yPosition += 20;

  // Subject
  doc.setFont('helvetica', 'bold');
  doc.text('Sub: 4M Change Intimation to Amber Enterprises before change', margin, yPosition);
  yPosition += 20;
  doc.setFont('helvetica', 'normal');

  // Salutation
  doc.text('Dear Sir,', margin, yPosition);
  yPosition += 15;

  // Main declaration text
  const companyNameWithLocation = `${vendorData.companyName} with Location ${vendorData.registeredCity}, ${vendorData.registeredState}`;
  const declarationText = `We '${companyNameWithLocation}', we commits you that if we will make any changes in our existing process regarding to 4M (Man, Method, Machine, material) then we will inform you with 4M change note before starting new production.`;
  
  const declarationLines = doc.splitTextToSize(declarationText, pageWidth - 2 * margin);
  doc.text(declarationLines, margin, yPosition);
  yPosition += declarationLines.length * lineHeight + 10;

  // Liability clause
  const liabilityText = 'If we will not share 4M change information with you and due to this if any 4M accident occurs, than we will agree to bear accident cost.';
  const liabilityLines = doc.splitTextToSize(liabilityText, pageWidth - 2 * margin);
  doc.text(liabilityLines, margin, yPosition);
  yPosition += liabilityLines.length * lineHeight + 20;

  // Thank you
  doc.text('Thank You,', margin, yPosition);
  yPosition += 15;

  // Company name with address
  const companyNameWithAddress = `${vendorData.companyName}\n${formatAddress(vendorData.registeredAddress, vendorData.registeredCity, vendorData.registeredState, vendorData.registeredCountry)}`;
  const companyLines = doc.splitTextToSize(companyNameWithAddress, pageWidth - 2 * margin);
  doc.text(companyLines, margin, yPosition);
  yPosition += companyLines.length * lineHeight + 20;

  // Signature section
  doc.text('Plant Head', margin, yPosition);
  doc.text('Director', margin + 100, yPosition);
  yPosition += 15;

  doc.text('Name:', margin, yPosition);
  doc.text('Name:', margin + 100, yPosition);
  yPosition += 10;

  doc.text('Signature:', margin, yPosition);
  doc.text('Signature:', margin + 100, yPosition);
  yPosition += 10;

  doc.text('Date:', margin, yPosition);
  doc.text('Date:', margin + 100, yPosition);

  // Footer
  doc.setFontSize(10);
  doc.text(`Document generated on ${formatDate(new Date())} for ${vendorData.companyName}`, pageWidth / 2, 280, { align: 'center' });

  return doc;
};

// Export function to generate and download 4M Declaration
export const generateAndDownload4MDeclaration = (vendorData) => {
  const doc = generate4MDeclaration(vendorData);
  const fileName = `4m-declaration-${vendorData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  return fileName;
};

// Generate Code of Conduct Document
export const generateCodeOfConduct = (vendorData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 20;

  // Set font styles
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Title
  doc.text('VENDOR CODE OF CONDUCT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  // Reset font for body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Introduction
  const introText = 'Our business success and relationships are built upon a culture of excellence and commitment, which in turn rest on the foundations of integrity, trust and respect for the individual and adherence with the law. The principles of conduct which we expect of our Vendor are further explained below:';
  const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * lineHeight + 15;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Section (i): Compliance with Laws
  doc.setFont('helvetica', 'bold');
  doc.text('(i) COMPLIANCE WITH LAWS', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const complianceText = 'All Vendors shall conduct their business activities in full compliance with the applicable laws, international conventions and / or regulations of their respective countries and operating locations.';
  const complianceLines = doc.splitTextToSize(complianceText, pageWidth - 2 * margin);
  doc.text(complianceLines, margin, yPosition);
  yPosition += complianceLines.length * lineHeight + 10;

  // Section (ii): Anti-Corruption, Anti-Bribery
  doc.setFont('helvetica', 'bold');
  doc.text('(ii) ANTI-CORRUPTION, ANTI BRIBERY', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const antiCorruptionText = 'Vendor shall comply with all applicable international anti-corruption and anti-bribery laws. Vendors must not give or offer to give, anything of value or make any improper payments, directly or indirectly, to any government official, employee of a government controlled company, or political party, customer or private third party, in order to obtain any improper benefit or advantage.';
  const antiCorruptionLines = doc.splitTextToSize(antiCorruptionText, pageWidth - 2 * margin);
  doc.text(antiCorruptionLines, margin, yPosition);
  yPosition += antiCorruptionLines.length * lineHeight + 10;

  // Section (iii): Gifts & Entertainment
  doc.setFont('helvetica', 'bold');
  doc.text('(iii) GIFTS & ENTERTAINMENT', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const giftsText = 'Vendor acknowledge that AMBER ENTERPRISES\'s employees are prohibited from accepting anything more than occasional and modest gifts from Vendors, including meals and entertainment. Vendor are not authorized to give or receive gifts, hospitality or entertainment on AMBER ENTERPRISES\'s behalf.';
  const giftsLines = doc.splitTextToSize(giftsText, pageWidth - 2 * margin);
  doc.text(giftsLines, margin, yPosition);
  yPosition += giftsLines.length * lineHeight + 10;

  // Section (iv): Data Protection
  doc.setFont('helvetica', 'bold');
  doc.text('(iv) DATA PROTECTION', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const dataProtectionText = 'Vendors shall comply with all applicable data privacy laws and regulations. Vendors who are engaged in collecting, processing or controlling personal data on behalf of AMBER ENTERPRISES must comply with AMBER ENTERPRISES\'s corporate rules and policies relating to such services and shall prevent the improper and unauthorized use or dissemination of such data.';
  const dataProtectionLines = doc.splitTextToSize(dataProtectionText, pageWidth - 2 * margin);
  doc.text(dataProtectionLines, margin, yPosition);
  yPosition += dataProtectionLines.length * lineHeight + 15;

  // Add new page for remaining sections
  doc.addPage();
  yPosition = 20;

  // BUSINESS PRACTICE section
  doc.setFont('helvetica', 'bold');
  doc.text('BUSINESS PRACTICE', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const businessPracticeText = 'Vendors must be committed to the highest standards of legal and business conduct when dealing with their employees, Vendors, and customers, including AMBER ENTERPRISES.';
  const businessPracticeLines = doc.splitTextToSize(businessPracticeText, pageWidth - 2 * margin);
  doc.text(businessPracticeLines, margin, yPosition);
  yPosition += businessPracticeLines.length * lineHeight + 10;

  // Section (i): Accurate Business Records
  doc.setFont('helvetica', 'bold');
  doc.text('(i) ACCURATE BUSINESS RECORDS', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const recordsText = 'Vendors shall maintain accurate and timely financial and accounting records of all transactions related to their business with AMBER ENTERPRISES and retain them as required by applicable law, but in no case less than 3 years. No accounting or financial entry shall be made that conceals or disguises the true nature of any transaction or record.';
  const recordsLines = doc.splitTextToSize(recordsText, pageWidth - 2 * margin);
  doc.text(recordsLines, margin, yPosition);
  yPosition += recordsLines.length * lineHeight + 10;

  // Section (ii): Confidential Information
  doc.setFont('helvetica', 'bold');
  doc.text('(ii) CONFIDENTIAL INFORMATION', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const confidentialText = 'Vendors shall protect AMBER ENTERPRISES\'s confidential information and shall not share them with any third party unless authorized to do so in writing by AMBER ENTERPRISES.';
  const confidentialLines = doc.splitTextToSize(confidentialText, pageWidth - 2 * margin);
  doc.text(confidentialLines, margin, yPosition);
  yPosition += confidentialLines.length * lineHeight + 10;

  // Section (iii): Honest and Legal Conduct
  doc.setFont('helvetica', 'bold');
  doc.text('(iii) HONEST AND LEGAL CONDUCT', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const honestText = 'Vendors undertake not to engage in any conduct which would, under any applicable law, constitute wilful misconduct, a criminal offence and/or tortious deceit.';
  const honestLines = doc.splitTextToSize(honestText, pageWidth - 2 * margin);
  doc.text(honestLines, margin, yPosition);
  yPosition += honestLines.length * lineHeight + 15;

  // ETHICAL PRINCIPLES section
  doc.setFont('helvetica', 'bold');
  doc.text('ETHICAL PRINCIPLES AND CONFLICT OF INTEREST', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const ethicalText = 'Vendors shall conduct their business in a manner to conform to the highest level of ethical business behaviour. Vendors should avoid unfair practices and any conflict of interest or appearance of conflict of interest in all their dealings.';
  const ethicalLines = doc.splitTextToSize(ethicalText, pageWidth - 2 * margin);
  doc.text(ethicalLines, margin, yPosition);
  yPosition += ethicalLines.length * lineHeight + 15;

  // ENVIRONMENTAL COMPLIANCE section
  doc.setFont('helvetica', 'bold');
  doc.text('ENVIRONMENTAL COMPLIANCE', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const environmentalText = 'Vendors shall operate in an environmentally responsible and efficient manner to minimize adverse impacts on the environment and shall comply with all applicable environmental regulations.';
  const environmentalLines = doc.splitTextToSize(environmentalText, pageWidth - 2 * margin);
  doc.text(environmentalLines, margin, yPosition);
  yPosition += environmentalLines.length * lineHeight + 15;

  // Acknowledgement section
  const acknowledgementText = 'Vendors shall be required to acknowledge in writing that they understand and will comply with this Vendor code of conduct. Amber Enterprises shall have the right to audit Vendors\' compliance at a mutually agreed time and place, and Vendors shall extend full cooperation to AMBER ENTERPRISES in such event.';
  const acknowledgementLines = doc.splitTextToSize(acknowledgementText, pageWidth - 2 * margin);
  doc.text(acknowledgementLines, margin, yPosition);
  yPosition += acknowledgementLines.length * lineHeight + 20;

  // Signature section
  doc.text(`Managing Director (${vendorData.companyName})`, margin, yPosition);
  yPosition += 15;

  doc.text('Name:', margin, yPosition);
  yPosition += 10;

  doc.text('Title:', margin, yPosition);
  yPosition += 10;

  doc.text('Signature:', margin, yPosition);
  yPosition += 10;

  doc.text('Date:', margin, yPosition);

  // Footer
  doc.setFontSize(10);
  doc.text(`Document generated on ${formatDate(new Date())} for ${vendorData.companyName}`, pageWidth / 2, 280, { align: 'center' });

  return doc;
};

// Export function to generate and download Code of Conduct
export const generateAndDownloadCodeOfConduct = (vendorData) => {
  const doc = generateCodeOfConduct(vendorData);
  const fileName = `code-of-conduct-${vendorData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  return fileName;
};

// Generate Compliance Agreement Document
export const generateComplianceAgreement = (vendorData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 20;

  // Set font styles
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  
  // Header with stamp paper note
  doc.text('On 100/- Stamp paper', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Title
  doc.setFontSize(16);
  doc.text('SUPPLIER COMPLIANCE AGREEMENT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  // Reset font for body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Introduction
  const introText = `This Supplier Compliance Agreement ("Agreement") is entered into by and between ${vendorData.companyName} having a principal place of business at ${formatAddress(vendorData.registeredAddress, vendorData.registeredCity, vendorData.registeredState, vendorData.registeredCountry)}, & Production Unit or Units at ${formatAddress(vendorData.supplyAddress, vendorData.supplyCity, vendorData.supplyState, vendorData.supplyCountry)} hereafter referred to as ("Supplier") and Amber Enterprises India Limited having a principal place of business at Universal Trade Tower, 1st Floor, Sector – 49, Sohna Road, Gurugram – 122 018, hereafter referred to as ("Amber").`;
  
  const introLines = doc.splitTextToSize(introText, pageWidth - 2 * margin);
  doc.text(introLines, margin, yPosition);
  yPosition += introLines.length * lineHeight + 10;

  const effectiveText = 'The "Compliance Agreement" is effective as of the date of last signature by the parties below.';
  const effectiveLines = doc.splitTextToSize(effectiveText, pageWidth - 2 * margin);
  doc.text(effectiveLines, margin, yPosition);
  yPosition += effectiveLines.length * lineHeight + 15;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Scope section
  doc.setFont('helvetica', 'bold');
  doc.text('Scope', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const scopeText = 'To operate in a safe and responsible manner with respect to the environment and health of our Suppliers, our customers, and the communities where we operate. Supplier will not compromise environmental, health or safety values for other interests, value human life above all else and manage risks accordingly.';
  const scopeLines = doc.splitTextToSize(scopeText, pageWidth - 2 * margin);
  doc.text(scopeLines, margin, yPosition);
  yPosition += scopeLines.length * lineHeight + 15;

  // Environment, Health, and Safety section
  doc.setFont('helvetica', 'bold');
  doc.text('Environment, Health, and Safety.', margin, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'normal');
  
  const ehsIntroText = 'Supplier represents, warrants, and covenants that:';
  const ehsIntroLines = doc.splitTextToSize(ehsIntroText, pageWidth - 2 * margin);
  doc.text(ehsIntroLines, margin, yPosition);
  yPosition += ehsIntroLines.length * lineHeight + 10;

  // EHS clauses
  const ehsClauses = [
    '(a) Supplier shall perform all of its obligations herein in compliance with all Environmental Laws and all necessary environmental or other licenses, registrations, notifications, certificates, approvals, authorizations or permits required under Environmental Laws.',
    '(b) Supplier shall abate any condition or practice, regardless of whether such condition or practice constitutes non-compliance with Environmental Laws, which poses a significant threat to human health, safety, or the environment, or would be reasonably likely to limit, impede, or otherwise jeopardize Supplier\'s ability to fulfill its obligations to Buyer.',
    '(c) Supplier shall be solely responsible for all Environmental Losses incurred during the performance of the Agreement with the buyer.',
    '(d) Supplier shall be solely responsible for the generation, collection, storage, handling, transportation, movement and disposal of all Hazardous Materials and Waste, as applicable, in compliance with Environmental Laws.',
    '(e) Supplier shall provide to Buyer all information available to Supplier related to the safety, safe handling, environmental impact, and disposal of the Product including, without limitation, material safety data sheets.',
    '(f) Throughout the term of this Agreement, Supplier shall promptly deliver to Buyer, as it becomes available to Supplier, any updates or amendments to the information provided pursuant to this Section and any new information relating to the safety, safe handling, environmental impact, or disposal of the Product.',
    '(g) Supplier shall provide prompt notification to Buyer in the event of any significant condition or incident, which shall include any event, occurrence, or circumstance, including any governmental or private action, which could materially impact Supplier\'s ability to fulfill its obligations under this Agreement.',
    '(h) Supplier shall comply with Applicable Laws concerning health, the environment, safety, or pertaining to or regulating pollutants, contaminants, or hazardous, toxic or radioactive substances, materials or wastes, including without limitation the handling, transportation, and disposal thereof, or governing or regulating the health and safety of personnel.',
    '(i) Supplier shall take reasonable and prudent measures, as appropriate, consistent with applicable industry standards, to mitigate hazards to the environment and to the health and safety of persons.',
    '(J) Supplier shall select and use only equipment, including but not limited to personal protection equipment, that comports with EHS Laws, implement programs to train its Representatives in the use of such equipment in a safe and lawful manner, and always maintain such equipment in good working order.',
    '(K) Supplier Should promptly notify the other Party of any incident involving death, injury or damage to any person or property in connection with any Product or Purchase Order.',
    '(L) Supplier shall, in addition to other obligations set forth in this Agreement, during performance of its obligations under this Agreement or any Purchase Order issued hereunder.',
    '(m) Supplier shall ensure that Products/Services comply with EHS Laws.',
    '(n) Supplier shall ensure that the Product and all parts, components, or material thereof, as Delivered by Supplier, bear all markings, labels, warnings, notices, or other information required under applicable EHS Laws at the time of such Delivery.'
  ];

  ehsClauses.forEach((clause, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    const clauseLines = doc.splitTextToSize(clause, pageWidth - 2 * margin);
    doc.text(clauseLines, margin, yPosition);
    yPosition += clauseLines.length * lineHeight + 5;
  });

  // Add new page for Annexure
  doc.addPage();
  yPosition = 20;

  // Annexure 1 section
  doc.setFont('helvetica', 'bold');
  doc.text('Annexure 1 – Amber (Supplier Material Compliance) SMC', margin, yPosition);
  yPosition += 15;
  doc.text('AMBER Supplier Materials Compliance (SMC). Circular 1 (Dated 01.03.2023)', margin, yPosition);
  yPosition += 15;
  doc.setFont('helvetica', 'normal');

  const annexureText = 'M/s Amber Enterprises India Limited must be able to gather and to report on materials that are present (or not present) in products sold. The SMC is a comprehensive business approach to deal with suppliers, new product designs, manage engineering changes, and demonstrate compliance to regulations concerning materials used in our products, both for RoHS and REACH under EHS and ESG.';
  const annexureLines = doc.splitTextToSize(annexureText, pageWidth - 2 * margin);
  doc.text(annexureLines, margin, yPosition);
  yPosition += annexureLines.length * lineHeight + 10;

  const rohsText = 'Six (6) hazardous substances (Cd, Pb, Hg, Cr (VI), PBB, PBD) were originally restricted by RoHS (2002/95/EC) the RoHS recast Directive (2011/65/EU) incorporated these restrictions for "medical devices" and "industrial monitoring and control equipment" effective July 22, 2014. Four (4) new hazardous substances (DEHP, BBP, DBP, DIBP) were added in the list.';
  const rohsLines = doc.splitTextToSize(rohsText, pageWidth - 2 * margin);
  doc.text(rohsLines, margin, yPosition);
  yPosition += rohsLines.length * lineHeight + 10;

  const reachText = 'Substances that may have serious and often irreversible effects on human health and the environment can be identified by REACH as Substances of Very High Concern (SVHCs). Chemicals are added to the list of SVHCs twice yearly. M/s Amber Enterprises India Limited can anytime require a third-party report to verify SVHC\'s content in the material being supplied.';
  const reachLines = doc.splitTextToSize(reachText, pageWidth - 2 * margin);
  doc.text(reachLines, margin, yPosition);
  yPosition += reachLines.length * lineHeight + 10;

  const warningText = 'Any wrong and forge information if provided in this regard shall be taken seriously and strict action would be taken.';
  const warningLines = doc.splitTextToSize(warningText, pageWidth - 2 * margin);
  doc.text(warningLines, margin, yPosition);
  yPosition += warningLines.length * lineHeight + 20;

  // Signature section
  doc.text('Buyer', margin, yPosition);
  doc.text('Supplier', margin + 100, yPosition);
  yPosition += 15;

  doc.text('Mr Girish Saluja', margin, yPosition);
  doc.text(vendorData.contactPersonName || '_________________', margin + 100, yPosition);
  yPosition += 10;

  doc.text('DGM Sourcing', margin, yPosition);
  doc.text(vendorData.designation || '_________________', margin + 100, yPosition);
  yPosition += 10;

  doc.text('M/s Amber Enterprises India Limited', margin, yPosition);
  doc.text(vendorData.companyName, margin + 100, yPosition);

  // Footer
  doc.setFontSize(10);
  doc.text(`Document generated on ${formatDate(new Date())} for ${vendorData.companyName}`, pageWidth / 2, 280, { align: 'center' });

  return doc;
};

// Export function to generate and download Compliance Agreement
export const generateAndDownloadComplianceAgreement = (vendorData) => {
  const doc = generateComplianceAgreement(vendorData);
  const fileName = `compliance-agreement-${vendorData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  return fileName;
};

// Generate Self Declaration Document
export const generateSelfDeclaration = (vendorData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = 20;

  // Set font styles
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // Title
  doc.text('Self Declaration', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  // Reset font for body
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  // Subject
  doc.setFont('helvetica', 'bold');
  doc.text('Subject: Declaration of accuracy of details provided on Amber Supplier Onboarding System', margin, yPosition);
  yPosition += 20;
  doc.setFont('helvetica', 'normal');

  // Salutation
  doc.text('To Whom It May Concern,', margin, yPosition);
  yPosition += 20;

  // Main declaration text
  const declarationText = `I ${vendorData.contactPersonName}, ${vendorData.designation || 'Director'}- ${vendorData.companyName} - hereby declare that all the information provided by me in the Amber supplier onboarding platform for vendor code creation "ASOS" is accurate, true, and complete to the best of my knowledge. I understand that the submission of any false, misleading, or incomplete information may result in the rejection of my application or other legal consequences.`;
  
  const declarationLines = doc.splitTextToSize(declarationText, pageWidth - 2 * margin);
  doc.text(declarationLines, margin, yPosition);
  yPosition += declarationLines.length * lineHeight + 15;

  // Second paragraph
  const secondParagraphText = 'I confirm that I have carefully reviewed all the details provided and take full responsibility for their accuracy. I authorize the relevant authorities to verify the information if necessary and acknowledge that any discrepancies may lead to the nullification of my application.';
  const secondParagraphLines = doc.splitTextToSize(secondParagraphText, pageWidth - 2 * margin);
  doc.text(secondParagraphLines, margin, yPosition);
  yPosition += secondParagraphLines.length * lineHeight + 15;

  // Third paragraph
  const thirdParagraphText = 'I assure you that I will promptly provide any additional documentation or information if required or inform in case any changes are there in details provided.';
  const thirdParagraphLines = doc.splitTextToSize(thirdParagraphText, pageWidth - 2 * margin);
  doc.text(thirdParagraphLines, margin, yPosition);
  yPosition += thirdParagraphLines.length * lineHeight + 25;

  // Sincerely
  doc.text('Sincerely,', margin, yPosition);
  yPosition += 20;

  // Signature section
  doc.text(vendorData.contactPersonName, margin, yPosition);
  yPosition += 10;

  doc.text(vendorData.designation || 'Director', margin, yPosition);
  yPosition += 10;

  doc.text(vendorData.companyName, margin, yPosition);

  // Footer
  doc.setFontSize(10);
  doc.text(`Document generated on ${formatDate(new Date())} for ${vendorData.companyName}`, pageWidth / 2, 280, { align: 'center' });

  return doc;
};

// Export function to generate and download Self Declaration
export const generateAndDownloadSelfDeclaration = (vendorData) => {
  const doc = generateSelfDeclaration(vendorData);
  const fileName = `self-declaration-${vendorData.companyName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  return fileName;
}; 