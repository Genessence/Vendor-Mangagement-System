import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';

const ComplianceTab = ({ vendor }) => {
  const [complianceCertificates, setComplianceCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch compliance certificates from API
  useEffect(() => {
    const fetchComplianceCertificates = async () => {
      if (!vendor?.id) return;
      
      try {
        setLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}/compliance-certificates`);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication required. Please log in.');
            return;
          }
          if (response.status === 404) {
            // No compliance certificates found, this is normal
            setComplianceCertificates([]);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setComplianceCertificates(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching compliance certificates:', err);
        setError('Failed to load compliance certificates. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceCertificates();
  }, [vendor?.id]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'bg-success text-success-foreground';
      case 'expiring soon':
        return 'bg-warning text-warning-foreground';
      case 'non-compliant':
        return 'bg-error text-error-foreground';
      case 'under review':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'CheckCircle';
      case 'medium':
        return 'AlertTriangle';
      case 'high':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const complianceStats = {
    total: complianceCertificates.length,
    compliant: complianceCertificates.filter(item => item.status === 'Compliant').length,
    expiring: complianceCertificates.filter(item => item.status === 'Expiring Soon').length,
    nonCompliant: complianceCertificates.filter(item => item.status === 'Non-Compliant').length,
    underReview: complianceCertificates.filter(item => item.status === 'Under Review').length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading compliance data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Compliance Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">{complianceStats.total}</div>
            <div className="text-sm text-text-secondary">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-success mb-1">{complianceStats.compliant}</div>
            <div className="text-sm text-text-secondary">Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning mb-1">{complianceStats.expiring}</div>
            <div className="text-sm text-text-secondary">Expiring Soon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-error mb-1">{complianceStats.nonCompliant}</div>
            <div className="text-sm text-text-secondary">Non-Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-secondary mb-1">{complianceStats.underReview}</div>
            <div className="text-sm text-text-secondary">Under Review</div>
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="space-y-4">
        {complianceCertificates.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-8 text-center">
            <Icon name="Shield" size={48} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Compliance Certificates</h3>
            <p className="text-text-secondary mb-4">
              No compliance certificates have been added for this vendor yet.
            </p>
            <Button variant="outline" iconName="Plus" iconPosition="left">
              Add Certificate
            </Button>
          </div>
        ) : (
          complianceCertificates.map((certificate) => (
            <div key={certificate.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-2">{certificate.title}</h4>
                      <p className="text-sm text-text-secondary mb-3">{certificate.description || 'No description available'}</p>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(certificate.status)}`}>
                        {certificate.status}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Icon name={getRiskIcon(certificate.risk_level)} size={16} className={getRiskColor(certificate.risk_level)} />
                        <span className={`text-sm font-medium ${getRiskColor(certificate.risk_level)}`}>
                          {certificate.risk_level} Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Certificate Number</label>
                      <p className="text-sm text-foreground font-mono">{certificate.certificate_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Issued Date</label>
                      <p className="text-sm text-foreground">{formatDate(certificate.issued_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Expiry Date</label>
                      <p className={`text-sm font-medium ${
                        isExpired(certificate.expiry_date) ? 'text-error' : isExpiringSoon(certificate.expiry_date) ?'text-warning' : 'text-foreground'
                      }`}>
                        {formatDate(certificate.expiry_date)}
                        {isExpiringSoon(certificate.expiry_date) && !isExpired(certificate.expiry_date) && (
                          <span className="ml-1 text-xs">(Soon)</span>
                        )}
                        {isExpired(certificate.expiry_date) && (
                          <span className="ml-1 text-xs">(Expired)</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Issuing Authority</label>
                      <p className="text-sm text-foreground">{certificate.issuing_authority}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  {(certificate.certificate_document_path || certificate.audit_report_path) && (
                    <div className="mb-4">
                      <label className="text-sm font-medium text-text-secondary mb-2 block">Supporting Documents</label>
                      <div className="flex flex-wrap gap-2">
                        {certificate.certificate_document_path && (
                          <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                            <Icon name="FileText" size={14} className="text-text-secondary" />
                            <span className="text-sm text-foreground">Certificate Document</span>
                            <Icon name="Download" size={12} className="text-primary cursor-pointer" />
                          </div>
                        )}
                        {certificate.audit_report_path && (
                          <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                            <Icon name="FileText" size={14} className="text-text-secondary" />
                            <span className="text-sm text-foreground">Audit Report</span>
                            <Icon name="Download" size={12} className="text-primary cursor-pointer" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                  View Details
                </Button>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                  Download Certificate
                </Button>
                {(certificate.status === 'Expiring Soon' || certificate.status === 'Non-Compliant') && (
                  <Button variant="default" size="sm" iconName="RefreshCw" iconPosition="left">
                    Renew Certificate
                  </Button>
                )}
                <Button variant="ghost" size="sm" iconName="MessageSquare" iconPosition="left">
                  Add Note
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compliance Alerts */}
      {complianceCertificates.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="AlertTriangle" size={20} className="mr-2" />
            Compliance Alerts
          </h3>
          <div className="space-y-3">
            {complianceCertificates.filter(cert => isExpired(cert.expiry_date)).map(cert => (
              <div key={cert.id} className="flex items-start space-x-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                <Icon name="XCircle" size={20} className="text-error mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-error">{cert.title} Expired</h4>
                  <p className="text-sm text-error/80 mt-1">
                    {cert.title} expired on {formatDate(cert.expiry_date)}. Immediate renewal required to maintain compliance.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-error text-error hover:bg-error hover:text-error-foreground">
                  Take Action
                </Button>
              </div>
            ))}
            
            {complianceCertificates.filter(cert => isExpiringSoon(cert.expiry_date) && !isExpired(cert.expiry_date)).map(cert => (
              <div key={cert.id} className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-warning">{cert.title} Expiring Soon</h4>
                  <p className="text-sm text-warning/80 mt-1">
                    {cert.title} expires on {formatDate(cert.expiry_date)}. Plan renewal process to avoid compliance gap.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-warning text-warning hover:bg-warning hover:text-warning-foreground">
                  Schedule Renewal
                </Button>
              </div>
            ))}
            
            {complianceCertificates.filter(cert => !isExpired(cert.expiry_date) && !isExpiringSoon(cert.expiry_date)).length === 0 && 
             complianceCertificates.filter(cert => isExpired(cert.expiry_date) || isExpiringSoon(cert.expiry_date)).length === 0 && (
              <div className="text-center py-4">
                <p className="text-text-secondary">No compliance alerts at this time.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceTab;