import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentsTab = ({ vendor, userRole }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const documentCategories = [
    { id: 'all', label: 'All Documents', count: 15 },
    { id: 'registration', label: 'Registration', count: 5 },
    { id: 'financial', label: 'Financial', count: 4 },
    { id: 'compliance', label: 'Compliance', count: 3 },
    { id: 'agreements', label: 'Agreements', count: 3 }
  ];

  const documents = [
    {
      id: 1,
      name: 'PAN Card',
      category: 'registration',
      type: 'PDF',
      size: '245 KB',
      uploadDate: '15/03/2024',
      status: 'Verified',
      expiryDate: null,
      description: 'Permanent Account Number certificate',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'GST Registration Certificate',
      category: 'registration',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '15/03/2024',
      status: 'Verified',
      expiryDate: null,
      description: 'Goods and Services Tax registration',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'MSME Certificate',
      category: 'registration',
      type: 'PDF',
      size: '890 KB',
      uploadDate: '16/03/2024',
      status: 'Verified',
      expiryDate: '15/03/2027',
      description: 'Micro, Small & Medium Enterprises certificate',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'Cancelled Cheque',
      category: 'financial',
      type: 'JPG',
      size: '456 KB',
      uploadDate: '16/03/2024',
      status: 'Verified',
      expiryDate: null,
      description: 'Bank account verification document',
      downloadUrl: '#'
    },
    {
      id: 5,
      name: 'Audited Financial Statement 2023-24',
      category: 'financial',
      type: 'PDF',
      size: '3.4 MB',
      uploadDate: '20/03/2024',
      status: 'Under Review',
      expiryDate: null,
      description: 'Annual financial statements',
      downloadUrl: '#'
    },
    {
      id: 6,
      name: 'ISO 9001:2015 Certificate',
      category: 'compliance',
      type: 'PDF',
      size: '678 KB',
      uploadDate: '22/03/2024',
      status: 'Verified',
      expiryDate: '20/03/2027',
      description: 'Quality management system certification',
      downloadUrl: '#'
    },
    {
      id: 7,
      name: 'Non-Disclosure Agreement',
      category: 'agreements',
      type: 'PDF',
      size: '234 KB',
      uploadDate: '25/03/2024',
      status: 'Signed',
      expiryDate: null,
      description: 'Confidentiality agreement',
      downloadUrl: '#'
    },
    {
      id: 8,
      name: 'Supplier Quality Agreement',
      category: 'agreements',
      type: 'PDF',
      size: '567 KB',
      uploadDate: '25/03/2024',
      status: 'Signed',
      expiryDate: null,
      description: 'Quality standards agreement',
      downloadUrl: '#'
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
      case 'signed':
        return 'bg-success text-success-foreground';
      case 'under review': case'pending':
        return 'bg-warning text-warning-foreground';
      case 'rejected': case'expired':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'FileText';
      case 'jpg': case'jpeg': case'png':
        return 'Image';
      case 'doc': case'docx':
        return 'FileText';
      default:
        return 'File';
    }
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const today = new Date();
    return expiry < today;
  };

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
            <Button variant="default" iconName="Upload" iconPosition="left">
              Upload Document
            </Button>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getFileIcon(document.type)} size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{document.name}</h4>
                  <p className="text-sm text-text-secondary">{document.type} • {document.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                  {document.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-4">{document.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Uploaded:</span>
                <span className="text-foreground">{document.uploadDate}</span>
              </div>
              {document.expiryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Expires:</span>
                  <span className={`font-medium ${
                    isExpired(document.expiryDate) ? 'text-error' :
                    isExpiringSoon(document.expiryDate) ? 'text-warning' : 'text-foreground'
                  }`}>
                    {document.expiryDate}
                    {isExpiringSoon(document.expiryDate) && !isExpired(document.expiryDate) && (
                      <span className="ml-1 text-xs">(Soon)</span>
                    )}
                    {isExpired(document.expiryDate) && (
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
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                className="px-3"
              >
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

      {/* Document Summary */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Document Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">15</div>
            <div className="text-sm text-text-secondary">Total Documents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-success mb-1">12</div>
            <div className="text-sm text-text-secondary">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning mb-1">2</div>
            <div className="text-sm text-text-secondary">Expiring Soon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-error mb-1">1</div>
            <div className="text-sm text-text-secondary">Under Review</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;