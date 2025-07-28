import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AgreementsTab = ({ vendor }) => {
  const agreements = [
    {
      id: 1,
      title: 'Non-Disclosure Agreement (NDA)',
      type: 'Legal',
      status: 'Signed',
      signedDate: '25/03/2024',
      signedBy: 'Rajesh Kumar (CEO)',
      validUntil: '24/03/2027',
      description: 'Confidentiality agreement to protect sensitive business information and trade secrets',
      version: '2.1',
      documentSize: '234 KB',
      lastModified: '20/03/2024',
      witnessRequired: false,
      autoRenewal: true
    },
    {
      id: 2,
      title: 'Supplier Quality Agreement (SQA)',
      type: 'Quality',
      status: 'Signed',
      signedDate: '25/03/2024',
      signedBy: 'Rajesh Kumar (CEO)',
      validUntil: '24/03/2027',
      description: 'Quality standards and requirements agreement ensuring product/service quality compliance',
      version: '3.0',
      documentSize: '567 KB',
      lastModified: '22/03/2024',
      witnessRequired: true,
      autoRenewal: false
    },
    {
      id: 3,
      title: '4M Change Management Agreement',
      type: 'Operational',
      status: 'Signed',
      signedDate: '26/03/2024',
      signedBy: 'Rajesh Kumar (CEO)',
      validUntil: '25/03/2027',
      description: 'Agreement for managing changes in Man, Machine, Material, and Method processes',
      version: '1.5',
      documentSize: '345 KB',
      lastModified: '24/03/2024',
      witnessRequired: false,
      autoRenewal: true
    },
    {
      id: 4,
      title: 'Code of Conduct Agreement',
      type: 'Compliance',
      status: 'Signed',
      signedDate: '26/03/2024',
      signedBy: 'Rajesh Kumar (CEO)',
      validUntil: 'Perpetual',
      description: 'Ethical business practices and conduct standards agreement',
      version: '2.0',
      documentSize: '456 KB',
      lastModified: '25/03/2024',
      witnessRequired: false,
      autoRenewal: false
    },
    {
      id: 5,
      title: 'Compliance Agreement',
      type: 'Legal',
      status: 'Pending Signature',
      signedDate: null,
      signedBy: null,
      validUntil: 'TBD',
      description: 'Regulatory and legal compliance requirements agreement',
      version: '1.0',
      documentSize: '389 KB',
      lastModified: '20/07/2024',
      witnessRequired: true,
      autoRenewal: false
    },
    {
      id: 6,
      title: 'Self Declaration Agreement',
      type: 'Declaration',
      status: 'Signed',
      signedDate: '27/03/2024',
      signedBy: 'Rajesh Kumar (CEO)',
      validUntil: 'Annual Renewal',
      description: 'Self-declaration of business capabilities, financial status, and compliance',
      version: '1.2',
      documentSize: '278 KB',
      lastModified: '26/03/2024',
      witnessRequired: false,
      autoRenewal: true
    }
  ];

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

  const agreementStats = {
    total: agreements.length,
    signed: agreements.filter(item => item.status === 'Signed').length,
    pending: agreements.filter(item => item.status === 'Pending Signature').length,
    expiring: agreements.filter(item => isExpiringSoon(item.validUntil)).length
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
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Version</label>
                    <p className="text-sm text-foreground font-medium">v{agreement.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Document Size</label>
                    <p className="text-sm text-foreground">{agreement.documentSize}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Last Modified</label>
                    <p className="text-sm text-foreground">{agreement.lastModified}</p>
                  </div>
                  {agreement.signedDate && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Signed Date</label>
                      <p className="text-sm text-foreground">{agreement.signedDate}</p>
                    </div>
                  )}
                  {agreement.signedBy && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Signed By</label>
                      <p className="text-sm text-foreground">{agreement.signedBy}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Valid Until</label>
                    <p className={`text-sm font-medium ${
                      isExpiringSoon(agreement.validUntil) ? 'text-warning' : 'text-foreground'
                    }`}>
                      {agreement.validUntil}
                      {isExpiringSoon(agreement.validUntil) && (
                        <span className="ml-1 text-xs">(Soon)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Agreement Properties */}
                <div className="flex flex-wrap gap-4 mb-4">
                  {agreement.witnessRequired && (
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={16} className="text-text-secondary" />
                      <span className="text-sm text-text-secondary">Witness Required</span>
                    </div>
                  )}
                  {agreement.autoRenewal && (
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