import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  mockVendors,
  mockVendorApprovals,
  mockVendorDocuments,
  mockDashboardMetrics,
  simulateApiResponse,
  simulateApiError
} from './mockData';

// Configuration
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/company-user-login';
    }
    return Promise.reject(error);
  }
);

// Vendor API Service
export const vendorService = {
  // Get all vendors
  getVendors: async (params = {}) => {
    if (USE_MOCK_DATA) {
      return simulateApiResponse({
        vendors: mockVendors,
        total: mockVendors.length,
        page: 1,
        per_page: 25
      });
    }
    
    try {
      const response = await apiClient.get('/vendors', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get vendor by ID
  getVendorById: async (id) => {
    if (USE_MOCK_DATA) {
      const vendor = mockVendors.find(v => v.id === parseInt(id));
      if (!vendor) {
        throw { response: { status: 404, data: { detail: 'Vendor not found' } } };
      }
      return simulateApiResponse(vendor);
    }
    
    try {
      const response = await apiClient.get(`/vendors/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create vendor
  createVendor: async (vendorData) => {
    if (USE_MOCK_DATA) {
      const newVendor = {
        id: mockVendors.length + 1,
        ...vendorData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockVendors.push(newVendor);
      return simulateApiResponse(newVendor);
    }
    
    try {
      const response = await apiClient.post('/vendors', vendorData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update vendor
  updateVendor: async (id, vendorData) => {
    if (USE_MOCK_DATA) {
      const vendorIndex = mockVendors.findIndex(v => v.id === parseInt(id));
      if (vendorIndex === -1) {
        throw { response: { status: 404, data: { detail: 'Vendor not found' } } };
      }
      mockVendors[vendorIndex] = {
        ...mockVendors[vendorIndex],
        ...vendorData,
        updated_at: new Date().toISOString()
      };
      return simulateApiResponse(mockVendors[vendorIndex]);
    }
    
    try {
      const response = await apiClient.put(`/vendors/${id}`, vendorData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete vendor
  deleteVendor: async (id) => {
    if (USE_MOCK_DATA) {
      const vendorIndex = mockVendors.findIndex(v => v.id === parseInt(id));
      if (vendorIndex === -1) {
        throw { response: { status: 404, data: { detail: 'Vendor not found' } } };
      }
      mockVendors.splice(vendorIndex, 1);
      return simulateApiResponse({ message: 'Vendor deleted successfully' });
    }
    
    try {
      const response = await apiClient.delete(`/vendors/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export vendor data
  exportVendor: async (id, format = 'pdf') => {
    if (USE_MOCK_DATA) {
      const vendor = mockVendors.find(v => v.id === parseInt(id));
      if (!vendor) {
        throw { response: { status: 404, data: { detail: 'Vendor not found' } } };
      }
      return simulateApiResponse({
        message: `Vendor data exported as ${format.toUpperCase()}`,
        download_url: `/api/vendors/${id}/export/${format}`
      });
    }
    
    try {
      const response = await apiClient.get(`/vendors/${id}/export/${format}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Approval API Service
export const approvalService = {
  // Get all approvals
  getApprovals: async (params = {}) => {
    if (USE_MOCK_DATA) {
      return simulateApiResponse({
        approvals: mockVendorApprovals,
        total: mockVendorApprovals.length,
        page: 1,
        per_page: 25
      });
    }
    
    try {
      const response = await apiClient.get('/approvals', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update approval status
  updateApproval: async (id, approvalData) => {
    if (USE_MOCK_DATA) {
      const approvalIndex = mockVendorApprovals.findIndex(a => a.id === parseInt(id));
      if (approvalIndex === -1) {
        throw { response: { status: 404, data: { detail: 'Approval not found' } } };
      }
      mockVendorApprovals[approvalIndex] = {
        ...mockVendorApprovals[approvalIndex],
        ...approvalData,
        reviewed_at: new Date().toISOString()
      };
      return simulateApiResponse(mockVendorApprovals[approvalIndex]);
    }
    
    try {
      const response = await apiClient.put(`/approvals/${id}`, approvalData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Document API Service
export const documentService = {
  // Get vendor documents
  getVendorDocuments: async (vendorId) => {
    if (USE_MOCK_DATA) {
      const documents = mockVendorDocuments.filter(d => d.vendor_id === parseInt(vendorId));
      return simulateApiResponse(documents);
    }
    
    try {
      const response = await apiClient.get(`/vendors/${vendorId}/documents`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload document
  uploadDocument: async (vendorId, formData) => {
    if (USE_MOCK_DATA) {
      const newDocument = {
        id: mockVendorDocuments.length + 1,
        vendor_id: parseInt(vendorId),
        document_type: formData.get('document_type'),
        file_name: formData.get('file').name,
        file_size: formData.get('file').size,
        uploaded_at: new Date().toISOString(),
        status: 'pending'
      };
      mockVendorDocuments.push(newDocument);
      return simulateApiResponse(newDocument);
    }
    
    try {
      const response = await apiClient.post(`/vendors/${vendorId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Dashboard API Service
export const dashboardService = {
  // Get dashboard metrics
  getMetrics: async () => {
    if (USE_MOCK_DATA) {
      return simulateApiResponse(mockDashboardMetrics);
    }
    
    try {
      const response = await apiClient.get('/dashboard/metrics');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Auth API Service
export const authService = {
  // Login
  login: async (credentials) => {
    if (USE_MOCK_DATA) {
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        return simulateApiResponse({
          access_token: 'mock-jwt-token',
          token_type: 'bearer',
          expires_in: 1800,
          user: {
            id: 1,
            email: 'admin@example.com',
            username: 'admin',
            full_name: 'System Administrator',
            role: 'admin',
            is_active: true
          }
        });
      } else {
        throw { response: { status: 401, data: { detail: 'Incorrect email or password' } } };
      }
    }
    
    try {
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    if (USE_MOCK_DATA) {
      return simulateApiResponse({
        id: 1,
        email: 'admin@example.com',
        username: 'admin',
        full_name: 'System Administrator',
        role: 'admin',
        is_active: true
      });
    }
    
    try {
      const response = await apiClient.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 

// Vendor Registration Service
export const vendorRegistrationService = {
  // Complete vendor registration process
  registerVendor: async (formData) => {
    if (USE_MOCK_DATA) {
      // Simulate the complete registration process
      const newVendor = {
        id: mockVendors.length + 1,
        vendor_code: `VND${String(mockVendors.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockVendors.push(newVendor);
      return simulateApiResponse({
        vendor: newVendor,
        message: 'Vendor registration completed successfully'
      });
    }

    try {
      // Step 1: Create the main vendor record
      const vendorData = {
        business_vertical: formData.businessVertical,
        company_name: formData.companyName,
        registration_number: formData.registrationNumber,
        contact_person_name: formData.contactPersonName,
        designation: formData.designation,
        email: formData.email,
        phone_number: formData.phoneNumber,
        website: formData.website,
        year_established: formData.yearEstablished ? parseInt(formData.yearEstablished) : null,
        business_description: formData.businessDescription,
        supplier_type: formData.supplierType,
        supplier_group: formData.supplierGroup,
        supplier_category: formData.supplierCategory,
        annual_turnover: formData.annualTurnover ? parseFloat(formData.annualTurnover) : null,
        products_services: formData.productsServices,
        msme_status: formData.msmeStatus,
        msme_number: formData.msmeNumber,
        industry_sector: formData.industrySector,
        employee_count: formData.employeeCount,
        certifications: formData.certifications
      };

      const vendorResponse = await apiClient.post('/vendors', vendorData);
      const vendor = vendorResponse.data;

      // Step 2: Add registered address
      const registeredAddressData = {
        address_type: 'registered',
        address: formData.registeredAddress,
        city: formData.registeredCity,
        state: formData.registeredState,
        country: formData.registeredCountry,
        pincode: formData.registeredPincode
      };
      await apiClient.post(`/vendors/${vendor.id}/addresses`, registeredAddressData);

      // Add supply address if different from registered
      if (!formData.sameAsRegistered) {
        const supplyAddressData = {
          address_type: 'supply',
          address: formData.supplyAddress,
          city: formData.supplyCity,
          state: formData.supplyState,
          country: formData.supplyCountry,
          pincode: formData.supplyPincode
        };
        await apiClient.post(`/vendors/${vendor.id}/addresses`, supplyAddressData);
      }

      // Step 3: Add bank information
      const bankData = {
        bank_name: formData.bankName,
        branch_name: formData.branchName,
        account_number: formData.accountNumber,
        account_type: formData.accountType,
        ifsc_code: formData.ifscCode,
        swift_code: formData.swiftCode,
        bank_address: formData.bankAddress
      };
      await apiClient.post(`/vendors/${vendor.id}/bank-info`, bankData);

      // Step 4: Add compliance information
      const complianceData = {
        preferred_currency: formData.preferredCurrency,
        tax_registration_number: formData.taxRegistrationNumber,
        pan_number: formData.panNumber,
        gst_number: formData.gstNumber,
        nature_of_assessee: formData.natureOfAssessee,
        tan_number: formData.tanNumber,
        place_of_supply: formData.placeOfSupply,
        vat_number: formData.vatNumber,
        business_license: formData.businessLicense,
        compliance_notes: formData.complianceNotes,
        credit_rating: formData.creditRating,
        insurance_coverage: formData.insuranceCoverage,
        special_certifications: formData.specialCertifications
      };
      await apiClient.post(`/vendors/${vendor.id}/compliance`, complianceData);

      // Step 5: Add agreements
      const agreementData = {
        nda: formData.agreements.nda,
        sqa: formData.agreements.sqa,
        four_m: formData.agreements.fourM,
        code_of_conduct: formData.agreements.codeOfConduct,
        compliance_agreement: formData.agreements.complianceAgreement,
        self_declaration: formData.agreements.selfDeclaration
      };
      await apiClient.post(`/vendors/${vendor.id}/agreements`, agreementData);

      return {
        data: {
          vendor: vendor,
          message: 'Vendor registration completed successfully'
        }
      };

    } catch (error) {
      console.error('Vendor registration error:', error);
      throw error;
    }
  }
}; 