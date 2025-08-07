import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';

const AgreementsTab = ({ vendor }) => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}/agreement-details`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAgreements(data);
      } catch (err) {
        console.error('Failed to load agreements:', err);
        setError('Failed to load agreements');
      } finally {
        setLoading(false);
      }
    };

    if (vendor?.id) {
      fetchAgreements();
    }
  }, [vendor?.id]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'signed':
        return 'bg-success text-success-foreground';
      case 'pending signature':
        return 'bg-warning text-warning-foreground';
      case 'expired':
        return 'bg-error text-error-foreground';
      case 'under review':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'legal':
        return 'bg-primary/10 text-primary';
      case 'quality':
        return 'bg-success/10 text-success';
      case 'operational':
        return 'bg-warning/10 text-warning';
      case 'compliance':
        return 'bg-accent/10 text-accent';
      case 'declaration':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const isExpiringSoon = (validUntil) => {
    if (!validUntil || validUntil === 'Perpetual' || validUntil === 'TBD' || validUntil === 'Annual Renewal') return false;
    const expiry = new Date(validUntil.split('/').reverse().join('-'));
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Icon name="Loader" size={20} className="animate-spin" />
          <span className="text-text-secondary">Loading agreements...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Agreements</h3>
          <p className="text-text-secondary mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const agreementStats = {
    total: agreements.length,
    signed: agreements.filter(item => item.status === 'Signed').length,
    pending: agreements.filter(item => item.status === 'Pending Signature').length,
    expiring: agreements.filter(item => isExpiringSoon(item.valid_until)).length
  };

  return (
    <div className="space-y-6">
      {/* Agreement Overview */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileSignature" size={20} className="mr-2" />
          Agreement Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">{agreementStats.total}</div>
            <div className="text-sm text-text-secondary">Total Agreements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-success mb-1">{agreementStats.signed}</div>
            <div className="text-sm text-text-secondary">Signed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-warning mb-1">{agreementStats.pending}</div>
            <div className="text-sm text-text-secondary">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-accent mb-1">{agreementStats.expiring}</div>
            <div className="text-sm text-text-secondary">Expiring Soon</div>
          </div>
        </div>
      </div>

      {/* Agreements List */}
      {agreements.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Agreements Found</h3>
          <p className="text-text-secondary mb-4">This vendor doesn't have any agreements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {agreements.map((agreement) => (
            <div key={agreement.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-foreground">{agreement.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(agreement.type)}`}>
                          {agreement.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agreement.status)}`}>
                          {agreement.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{agreement.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {agreement.version && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Version</label>
                        <p className="text-sm text-foreground font-medium">v{agreement.version}</p>
                      </div>
                    )}
                    {agreement.document_size && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Document Size</label>
                        <p className="text-sm text-foreground">{agreement.document_size}</p>
                      </div>
                    )}
                    {agreement.last_modified && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Last Modified</label>
                        <p className="text-sm text-foreground">{formatDate(agreement.last_modified)}</p>
                      </div>
                    )}
                    {agreement.signed_date && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Signed Date</label>
                        <p className="text-sm text-foreground">{formatDate(agreement.signed_date)}</p>
                      </div>
                    )}
                    {agreement.signed_by && (
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Signed By</label>
                        <p className="text-sm text-foreground">{agreement.signed_by}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Valid Until</label>
                      <p className={`text-sm font-medium ${
                        isExpiringSoon(agreement.valid_until) ? 'text-warning' : 'text-foreground'
                      }`}>
                        {agreement.valid_until}
                        {isExpiringSoon(agreement.valid_until) && (
                          <span className="ml-1 text-xs">(Soon)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Agreement Properties */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {agreement.witness_required && (
                      <div className="flex items-center space-x-2">
                        <Icon name="Users" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">Witness Required</span>
                      </div>
                    )}
                    {agreement.auto_renewal && (
                      <div className="flex items-center space-x-2">
                        <Icon name="RefreshCw" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-secondary">Auto Renewal</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
                  View Agreement
                </Button>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                  Download PDF
                </Button>
                {agreement.status === 'Pending Signature' && (
                  <Button variant="default" size="sm" iconName="PenTool" iconPosition="left">
                    Sign Agreement
                  </Button>
                )}
                {agreement.status === 'Signed' && (
                  <Button variant="ghost" size="sm" iconName="FileSignature" iconPosition="left">
                    View Signature
                  </Button>
                )}
                <Button variant="ghost" size="sm" iconName="MessageSquare" iconPosition="left">
                  Add Comment
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Signature Information */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Digital Signature Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Signature Method:</span>
              <span className="font-medium text-foreground">Digital Certificate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Certificate Authority:</span>
              <span className="font-medium text-foreground">eMudhra Limited</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Certificate Valid Until:</span>
              <span className="font-medium text-foreground">15/03/2026</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Signature Verification:</span>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="font-medium text-success">Verified</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Timestamp Authority:</span>
              <span className="font-medium text-foreground">SafeScrypt TSA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Last Signature:</span>
              <span className="font-medium text-foreground">27/03/2024 14:32:15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementsTab;