import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';

const DocumentsTab = ({ vendor, userRole }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [documentStats, setDocumentStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Document type mapping for categories
  const documentTypeCategories = {
    registration: ['pan_card', 'company_registration', 'incorporation_certificate', 'msme_certificate'],
    financial: ['bank_statement', 'tax_certificate'],
    compliance: ['gst_certificate', 'business_license', 'insurance_certificate'],
    agreements: ['quality_certificate', 'other']
  };

  // Fetch documents and stats
  useEffect(() => {
    if (vendor?.id) {
      fetchDocuments();
      fetchDocumentStats();
    }
  }, [vendor?.id]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/documents/vendor/${vendor.id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/stats/vendor/${vendor.id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDocumentStats(data);
    } catch (err) {
      console.error('Error fetching document stats:', err);
    }
  };

  // Calculate category counts
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') {
      return documents.length;
    }
    
    const categoryTypes = documentTypeCategories[categoryId] || [];
    return documents.filter(doc => categoryTypes.includes(doc.document_type)).length;
  };

  const documentCategories = [
    { id: 'all', label: 'All Documents', count: getCategoryCount('all') },
    { id: 'registration', label: 'Registration', count: getCategoryCount('registration') },
    { id: 'financial', label: 'Financial', count: getCategoryCount('financial') },
    { id: 'compliance', label: 'Compliance', count: getCategoryCount('compliance') },
    { id: 'agreements', label: 'Agreements', count: getCategoryCount('agreements') }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'rejected':
      case 'expired':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return 'FileText';
    if (mimeType?.includes('image')) return 'Image';
    if (mimeType?.includes('document')) return 'FileText';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => {
        const categoryTypes = documentTypeCategories[selectedCategory] || [];
        return categoryTypes.includes(doc.document_type);
      });

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      const response = await fetch(`${API_BASE_URL}/documents/upload/${vendor.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      // Refresh documents and stats
      await fetchDocuments();
      await fetchDocumentStats();
      setUploadModalOpen(false);
      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Error uploading document:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Download failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Icon name="AlertCircle" size={64} className="text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Documents</h3>
        <p className="text-text-secondary mb-6">{error}</p>
        <Button variant="default" onClick={fetchDocuments}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Categories */}
      <div className="flex flex-wrap gap-2">
        {documentCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-micro ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <span>{category.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              selectedCategory === category.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-text-secondary/20 text-text-secondary'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Upload New Document */}
      {(userRole === 'Admin' || userRole === 'Approver') && (
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Upload New Document</h3>
              <p className="text-sm text-text-secondary mt-1">
                Add new documents or update existing ones
              </p>
            </div>
            <Button 
              variant="default" 
              iconName="Upload" 
              iconPosition="left"
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upload Document</h3>
            <UploadForm 
              onSubmit={handleUpload} 
              onCancel={() => setUploadModalOpen(false)}
              uploading={uploading}
            />
          </div>
        </div>
      )}

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={getFileIcon(document.mime_type)} size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{document.file_name}</h4>
                    <p className="text-sm text-text-secondary">
                      {document.mime_type?.split('/')[1]?.toUpperCase()} • {formatFileSize(document.file_size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                    {document.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Type:</span>
                  <span className="text-foreground capitalize">{document.document_type?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Uploaded:</span>
                  <span className="text-foreground">{formatDate(document.created_at)}</span>
                </div>
                {document.expiry_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Expires:</span>
                    <span className={`font-medium ${
                      isExpired(document.expiry_date) ? 'text-error' :
                      isExpiringSoon(document.expiry_date) ? 'text-warning' : 'text-foreground'
                    }`}>
                      {formatDate(document.expiry_date)}
                      {isExpiringSoon(document.expiry_date) && !isExpired(document.expiry_date) && (
                        <span className="ml-1 text-xs">(Soon)</span>
                      )}
                      {isExpired(document.expiry_date) && (
                        <span className="ml-1 text-xs">(Expired)</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  className="flex-1"
                  onClick={() => handleDownload(document.id, document.file_name)}
                >
                  Download
                </Button>
                {(userRole === 'Admin' || userRole === 'Approver') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    className="px-3"
                  >
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="FileText" size={64} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Documents Available</h3>
          <p className="text-text-secondary mb-6">
            {selectedCategory === 'all' 
              ? "This vendor hasn't uploaded any documents yet."
              : `No documents found in the ${selectedCategory} category.`
            }
          </p>
          {(userRole === 'Admin' || userRole === 'Approver') && (
            <Button 
              variant="default" 
              iconName="Upload" 
              iconPosition="left"
              onClick={() => setUploadModalOpen(true)}
            >
              Upload First Document
            </Button>
          )}
        </div>
      )}

      {/* Document Summary */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Document Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">{documentStats.total}</div>
            <div className="text-sm text-text-secondary">Total Documents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-success mb-1">{documentStats.approved}</div>
            <div className="text-sm text-text-secondary">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning mb-1">{documentStats.pending}</div>
            <div className="text-sm text-text-secondary">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-error mb-1">{documentStats.rejected}</div>
            <div className="text-sm text-text-secondary">Rejected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-error mb-1">{documentStats.expired}</div>
            <div className="text-sm text-text-secondary">Expired</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload Form Component
const UploadForm = ({ onSubmit, onCancel, uploading }) => {
  const [formData, setFormData] = useState({
    document_type: '',
    file: null,
    expiry_date: ''
  });

  const documentTypes = [
    { value: 'gst_certificate', label: 'GST Certificate' },
    { value: 'pan_card', label: 'PAN Card' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'msme_certificate', label: 'MSME Certificate' },
    { value: 'company_registration', label: 'Company Registration' },
    { value: 'incorporation_certificate', label: 'Incorporation Certificate' },
    { value: 'business_license', label: 'Business License' },
    { value: 'insurance_certificate', label: 'Insurance Certificate' },
    { value: 'quality_certificate', label: 'Quality Certificate' },
    { value: 'tax_certificate', label: 'Tax Certificate' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.document_type || !formData.file) {
      alert('Please select document type and file');
      return;
    }

    const data = new FormData();
    data.append('document_type', formData.document_type);
    data.append('file', formData.file);
    if (formData.expiry_date) {
      data.append('expiry_date', formData.expiry_date);
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Document Type *
        </label>
        <select
          value={formData.document_type}
          onChange={(e) => setFormData(prev => ({ ...prev, document_type: e.target.value }))}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          required
        >
          <option value="">Select document type</option>
          {documentTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          File *
        </label>
        <input
          type="file"
          onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          required
        />
        <p className="text-xs text-text-secondary mt-1">
          Allowed: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Expiry Date (Optional)
        </label>
        <input
          type="date"
          value={formData.expiry_date}
          onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
          className="w-full p-2 border border-border rounded-md bg-background text-foreground"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          className="flex-1"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentsTab;