import { API_BASE_URL } from '../config/api';

/**
 * Upload a document for a vendor during registration
 * @param {number} vendorId - The vendor ID
 * @param {string} documentType - The type of document (e.g., 'bank_statement', 'gst_certificate')
 * @param {File} file - The file to upload
 * @param {string} expiryDate - Optional expiry date (YYYY-MM-DD format)
 * @returns {Promise<Object>} - The uploaded document data
 */
export const uploadVendorDocument = async (vendorId, documentType, file, expiryDate = null) => {
  try {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);
    
    if (expiryDate) {
      formData.append('expiry_date', expiryDate);
    }

    const response = await fetch(`${API_BASE_URL}/documents/upload/${vendorId}/public`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Document upload failed:', error);
    throw error;
  }
};

/**
 * Upload multiple documents for a vendor during registration
 * @param {number} vendorId - The vendor ID
 * @param {Array} documents - Array of document objects with type, file, and optional expiryDate
 * @returns {Promise<Array>} - Array of uploaded document data
 */
export const uploadMultipleVendorDocuments = async (vendorId, documents) => {
  const uploadPromises = documents.map(doc => 
    uploadVendorDocument(vendorId, doc.type, doc.file, doc.expiryDate)
  );
  
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple document upload failed:', error);
    throw error;
  }
};

/**
 * Get document type mapping for registration forms
 */
export const getDocumentTypeMapping = () => {
  return {
    'bankProof': 'bank_statement',
    'gstCertificate': 'gst_certificate',
    'panCard': 'pan_card',
    'msmeCertificate': 'msme_certificate',
    'companyRegistration': 'company_registration',
    'incorporationCertificate': 'incorporation_certificate',
    'businessLicense': 'business_license',
    'insuranceCertificate': 'insurance_certificate',
    'qualityCertificate': 'quality_certificate',
    'taxCertificate': 'tax_certificate',
    'other': 'other'
  };
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes (default: 10MB)
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateFile = (file, maxSize = 10 * 1024 * 1024) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'File type not allowed. Please upload PDF, JPG, PNG, DOC, or DOCX files' };
  }

  return { isValid: true, error: null };
}; 