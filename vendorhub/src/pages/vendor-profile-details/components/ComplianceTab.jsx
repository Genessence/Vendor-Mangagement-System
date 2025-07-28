import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceTab = ({ vendor }) => {
  const complianceItems = [
    {
      id: 1,
      title: 'ISO 9001:2015 Quality Management',
      status: 'Compliant',
      certificateNumber: 'ISO-QMS-2024-001',
      issuedDate: '20/03/2024',
      expiryDate: '19/03/2027',
      issuingAuthority: 'Bureau Veritas',
      description: 'Quality management system certification ensuring consistent quality standards',
      documents: ['ISO Certificate.pdf', 'Audit Report.pdf'],
      riskLevel: 'Low'
    },
    {
      id: 2,
      title: 'ISO 14001:2015 Environmental Management',
      status: 'Compliant',
      certificateNumber: 'ISO-EMS-2024-002',
      issuedDate: '22/03/2024',
      expiryDate: '21/03/2027',
      issuingAuthority: 'SGS India',
      description: 'Environmental management system certification for sustainable practices',
      documents: ['Environmental Certificate.pdf'],
      riskLevel: 'Low'
    },
    {
      id: 3,
      title: 'OHSAS 18001 Occupational Health & Safety',
      status: 'Expiring Soon',
      certificateNumber: 'OHSAS-2023-003',
      issuedDate: '15/08/2023',
      expiryDate: '14/08/2024',
      issuingAuthority: 'TUV India',
      description: 'Occupational health and safety management system certification',
      documents: ['OHSAS Certificate.pdf', 'Safety Audit.pdf'],
      riskLevel: 'Medium'
    },
    {
      id: 4,
      title: 'MSME Registration',
      status: 'Compliant',
      certificateNumber: 'MSME-REG-2024-004',
      issuedDate: '10/01/2024',
      expiryDate: '09/01/2029',
      issuingAuthority: 'Ministry of MSME, Govt. of India',
      description: 'Micro, Small and Medium Enterprises registration for government benefits',
      documents: ['MSME Certificate.pdf'],
      riskLevel: 'Low'
    },
    {
      id: 5,
      title: 'Labour License',
      status: 'Non-Compliant',
      certificateNumber: 'LL-2023-005',
      issuedDate: '01/04/2023',
      expiryDate: '31/03/2024',
      issuingAuthority: 'Labour Department, Maharashtra',
      description: 'Labour license for employment compliance',
      documents: ['Expired Labour License.pdf'],
      riskLevel: 'High'
    },
    {
      id: 6,
      title: 'Fire Safety Certificate',
      status: 'Under Review',
      certificateNumber: 'FSC-2024-006',
      issuedDate: '15/07/2024',
      expiryDate: '14/07/2025',
      issuingAuthority: 'Fire Department, Mumbai',
      description: 'Fire safety compliance certificate for premises',
      documents: ['Fire Safety Application.pdf'],
      riskLevel: 'Medium'
    }
  ];

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
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const today = new Date();
    return expiry < today;
  };

  const complianceStats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(item => item.status === 'Compliant').length,
    expiring: complianceItems.filter(item => item.status === 'Expiring Soon').length,
    nonCompliant: complianceItems.filter(item => item.status === 'Non-Compliant').length,
    underReview: complianceItems.filter(item => item.status === 'Under Review').length
  };

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
        {complianceItems.map((item) => (
          <div key={item.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-text-secondary mb-3">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon name={getRiskIcon(item.riskLevel)} size={16} className={getRiskColor(item.riskLevel)} />
                      <span className={`text-sm font-medium ${getRiskColor(item.riskLevel)}`}>
                        {item.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Certificate Number</label>
                    <p className="text-sm text-foreground font-mono">{item.certificateNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Issued Date</label>
                    <p className="text-sm text-foreground">{item.issuedDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Expiry Date</label>
                    <p className={`text-sm font-medium ${
                      isExpired(item.expiryDate) ? 'text-error' : isExpiringSoon(item.expiryDate) ?'text-warning' : 'text-foreground'
                    }`}>
                      {item.expiryDate}
                      {isExpiringSoon(item.expiryDate) && !isExpired(item.expiryDate) && (
                        <span className="ml-1 text-xs">(Soon)</span>
                      )}
                      {isExpired(item.expiryDate) && (
                        <span className="ml-1 text-xs">(Expired)</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Issuing Authority</label>
                    <p className="text-sm text-foreground">{item.issuingAuthority}</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-text-secondary mb-2 block">Supporting Documents</label>
                  <div className="flex flex-wrap gap-2">
                    {item.documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                        <Icon name="FileText" size={14} className="text-text-secondary" />
                        <span className="text-sm text-foreground">{doc}</span>
                        <Icon name="Download" size={12} className="text-primary cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>
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
              {(item.status === 'Expiring Soon' || item.status === 'Non-Compliant') && (
                <Button variant="default" size="sm" iconName="RefreshCw" iconPosition="left">
                  Renew Certificate
                </Button>
              )}
              <Button variant="ghost" size="sm" iconName="MessageSquare" iconPosition="left">
                Add Note
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Alerts */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="AlertTriangle" size={20} className="mr-2" />
          Compliance Alerts
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-4 bg-error/10 border border-error/20 rounded-lg">
            <Icon name="XCircle" size={20} className="text-error mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-error">Labour License Expired</h4>
              <p className="text-sm text-error/80 mt-1">
                Labour license expired on 31/03/2024. Immediate renewal required to maintain compliance.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-error text-error hover:bg-error hover:text-error-foreground">
              Take Action
            </Button>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-warning">OHSAS Certificate Expiring Soon</h4>
              <p className="text-sm text-warning/80 mt-1">
                OHSAS 18001 certificate expires on 14/08/2024. Plan renewal process to avoid compliance gap.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-warning text-warning hover:bg-warning hover:text-warning-foreground">
              Schedule Renewal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTab;