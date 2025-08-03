// Mock Data Service for Testing
// This simulates the backend API responses

export const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    username: 'admin',
    full_name: 'System Administrator',
    role: 'admin',
    is_active: true,
    last_login: '2024-01-30T10:30:00Z'
  }
];

export const mockVendors = [
  {
    id: 1,
    vendor_code: 'VND001',
    company_name: 'TechCorp Solutions Pvt Ltd',
    contact_person: 'Rajesh Kumar',
    email: 'rajesh.kumar@techcorp.com',
    phone: '+91 98765 43210',
    address: 'Plot 123, Sector 18, Gurgaon, Haryana 122015',
    website: 'https://techcorp.com',
    category: 'Electronics',
    vendor_type: 'manufacturer',
    country: 'India',
    status: 'active',
    msme_status: 'msme',
    registration_date: '2024-01-15',
    approval_stage: 'approved',
    annual_turnover: 50000000,
    gst_number: '07AABCT1234C1Z5',
    pan_number: 'AABCT1234C',
    bank_name: 'HDFC Bank',
    account_number: '50100123456789',
    ifsc_code: 'HDFC0001234',
    currency: 'INR',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-30T15:30:00Z'
  },
  {
    id: 2,
    vendor_code: 'VND002',
    company_name: 'Global Manufacturing Inc',
    contact_person: 'John Smith',
    email: 'john.smith@globalmanuf.com',
    phone: '+1 555 123 4567',
    address: '1234 Industrial Blvd, Detroit, MI 48201, USA',
    website: 'https://globalmanuf.com',
    category: 'Automotive',
    vendor_type: 'supplier',
    country: 'USA',
    status: 'active',
    msme_status: 'non_msme',
    registration_date: '2024-02-20',
    approval_stage: 'approved',
    annual_turnover: 250000000,
    gst_number: null,
    pan_number: null,
    bank_name: 'Chase Bank',
    account_number: '12345678901234',
    ifsc_code: 'CHASUS33',
    currency: 'USD',
    created_at: '2024-02-20T14:00:00Z',
    updated_at: '2024-01-30T16:45:00Z'
  },
  {
    id: 3,
    vendor_code: 'VND003',
    company_name: 'Textile Innovations Ltd',
    contact_person: 'Priya Sharma',
    email: 'priya.sharma@textileinno.com',
    phone: '+91 87654 32109',
    address: '45 Textile Park, Coimbatore, Tamil Nadu 641014',
    website: 'https://textileinno.com',
    category: 'Textiles',
    vendor_type: 'manufacturer',
    country: 'India',
    status: 'pending',
    msme_status: 'msme',
    registration_date: '2024-03-10',
    approval_stage: 'under_review',
    annual_turnover: 15000000,
    gst_number: '33AABTI5678D2Z9',
    pan_number: 'AABTI5678D',
    bank_name: 'ICICI Bank',
    account_number: '60200123456789',
    ifsc_code: 'ICIC0001234',
    currency: 'INR',
    created_at: '2024-03-10T09:30:00Z',
    updated_at: '2024-01-30T17:20:00Z'
  },
  {
    id: 4,
    vendor_code: 'VND004',
    company_name: 'Pharma Solutions GmbH',
    contact_person: 'Dr. Hans Mueller',
    email: 'hans.mueller@pharmasolutions.de',
    phone: '+49 30 12345678',
    address: 'Pharma Strasse 45, Berlin 10115, Germany',
    website: 'https://pharmasolutions.de',
    category: 'Pharmaceuticals',
    vendor_type: 'supplier',
    country: 'Germany',
    status: 'active',
    msme_status: 'non_msme',
    registration_date: '2024-01-05',
    approval_stage: 'approved',
    annual_turnover: 75000000,
    gst_number: null,
    pan_number: null,
    bank_name: 'Deutsche Bank',
    account_number: 'DE89370400440532013000',
    ifsc_code: 'DEUTDEFF',
    currency: 'EUR',
    created_at: '2024-01-05T11:15:00Z',
    updated_at: '2024-01-30T18:10:00Z'
  },
  {
    id: 5,
    vendor_code: 'VND005',
    company_name: 'Logistics Express Ltd',
    contact_person: 'Sarah Johnson',
    email: 'sarah.johnson@logistics-express.com',
    phone: '+44 20 7946 0958',
    address: '10 Fleet Street, London EC4Y 1AA, UK',
    website: 'https://logistics-express.com',
    category: 'Logistics',
    vendor_type: 'service_provider',
    country: 'UK',
    status: 'inactive',
    msme_status: 'non_msme',
    registration_date: '2023-12-01',
    approval_stage: 'suspended',
    annual_turnover: 120000000,
    gst_number: null,
    pan_number: null,
    bank_name: 'Barclays Bank',
    account_number: 'GB29NWBK60161331926819',
    ifsc_code: 'BARCGB22',
    currency: 'GBP',
    created_at: '2023-12-01T08:45:00Z',
    updated_at: '2024-01-30T19:30:00Z'
  }
];

export const mockVendorApprovals = [
  {
    id: 1,
    vendor_id: 3,
    vendor: mockVendors[2],
    status: 'pending',
    submitted_by: 'priya.sharma@textileinno.com',
    submitted_at: '2024-03-10T09:30:00Z',
    reviewed_by: null,
    reviewed_at: null,
    comments: 'Application under review for MSME compliance verification',
    documents: ['GST Certificate', 'PAN Card', 'MSME Certificate', 'Bank Statement']
  },
  {
    id: 2,
    vendor_id: 6,
    vendor: {
      id: 6,
      vendor_code: 'VND006',
      company_name: 'Digital Solutions Co',
      contact_person: 'Alex Chen',
      email: 'alex.chen@digitalsolutions.co',
      phone: '+1 555 987 6543',
      address: '789 Tech Avenue, San Francisco, CA 94105, USA',
      website: 'https://digitalsolutions.co',
      category: 'Software',
      vendor_type: 'service_provider',
      country: 'USA',
      status: 'pending',
      msme_status: 'non_msme',
      registration_date: '2024-03-25',
      approval_stage: 'pending',
      annual_turnover: 35000000,
      gst_number: null,
      pan_number: null,
      bank_name: 'Wells Fargo',
      account_number: '98765432109876',
      ifsc_code: 'WFBIUS6S',
      currency: 'USD',
      created_at: '2024-03-25T13:20:00Z',
      updated_at: '2024-03-25T13:20:00Z'
    },
    status: 'pending',
    submitted_by: 'alex.chen@digitalsolutions.co',
    submitted_at: '2024-03-25T13:20:00Z',
    reviewed_by: null,
    reviewed_at: null,
    comments: 'New vendor application awaiting review',
    documents: ['Company Registration', 'Tax Certificate', 'Bank Letterhead']
  }
];

export const mockVendorDocuments = [
  {
    id: 1,
    vendor_id: 1,
    document_type: 'GST Certificate',
    file_name: 'gst_certificate_vnd001.pdf',
    file_size: 245760,
    uploaded_at: '2024-01-15T10:30:00Z',
    status: 'verified'
  },
  {
    id: 2,
    vendor_id: 1,
    document_type: 'PAN Card',
    file_name: 'pan_card_vnd001.pdf',
    file_size: 153600,
    uploaded_at: '2024-01-15T10:35:00Z',
    status: 'verified'
  },
  {
    id: 3,
    vendor_id: 1,
    document_type: 'MSME Certificate',
    file_name: 'msme_certificate_vnd001.pdf',
    file_size: 307200,
    uploaded_at: '2024-01-15T10:40:00Z',
    status: 'verified'
  },
  {
    id: 4,
    vendor_id: 2,
    document_type: 'Tax Certificate',
    file_name: 'tax_certificate_vnd002.pdf',
    file_size: 184320,
    uploaded_at: '2024-02-20T14:15:00Z',
    status: 'verified'
  },
  {
    id: 5,
    vendor_id: 3,
    document_type: 'GST Certificate',
    file_name: 'gst_certificate_vnd003.pdf',
    file_size: 225280,
    uploaded_at: '2024-03-10T09:45:00Z',
    status: 'pending'
  }
];

// Dashboard metrics
export const mockDashboardMetrics = {
  total_vendors: 372,
  pending_approvals: 25,
  monthly_onboarded: 42,
  compliance_rate: 94.2,
  recent_activities: [
    {
      id: 1,
      type: 'vendor_registered',
      vendor_name: 'Digital Solutions Co',
      timestamp: '2024-03-25T13:20:00Z',
      description: 'New vendor registration submitted'
    },
    {
      id: 2,
      type: 'approval_completed',
      vendor_name: 'TechCorp Solutions Pvt Ltd',
      timestamp: '2024-03-24T16:30:00Z',
      description: 'Vendor approval completed'
    },
    {
      id: 3,
      type: 'document_uploaded',
      vendor_name: 'Textile Innovations Ltd',
      timestamp: '2024-03-23T11:15:00Z',
      description: 'MSME certificate uploaded'
    }
  ]
};

// API Response Simulators
export const simulateApiResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status: 200,
        message: 'Success'
      });
    }, delay);
  });
};

export const simulateApiError = (message = 'API Error', status = 500, delay = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({
        response: {
          data: { detail: message },
          status
        }
      });
    }, delay);
  });
}; 