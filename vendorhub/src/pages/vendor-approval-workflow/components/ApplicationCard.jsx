import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationCard = ({ application, onViewDetails, onQuickAction }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-error bg-error/10 border-error/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_level_1': return 'text-warning bg-warning/10';
      case 'pending_level_2': return 'text-accent bg-accent/10';
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-error bg-error/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysAgo = (date) => {
    const today = new Date();
    const submissionDate = new Date(date);
    const diffTime = Math.abs(today - submissionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-medium transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-card-foreground">{application.companyName}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(application.urgency)}`}>
              {application.urgency.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Submitted {formatDate(application.submissionDate)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{getDaysAgo(application.submissionDate)} days ago</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
            {application.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Building2" size={16} className="text-text-secondary" />
          <div>
            <div className="text-xs text-text-secondary">Category</div>
            <div className="text-sm font-medium text-card-foreground">{application.category}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={16} className="text-text-secondary" />
          <div>
            <div className="text-xs text-text-secondary">Country</div>
            <div className="text-sm font-medium text-card-foreground">{application.country}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={16} className="text-text-secondary" />
          <div>
            <div className="text-xs text-text-secondary">Documents</div>
            <div className="text-sm font-medium text-card-foreground">
              {application.documentsCompleted}/{application.totalDocuments} Complete
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-text-secondary">
        <span className="flex items-center space-x-1">
          <Icon name="User" size={14} />
          <span>{application.contactPerson}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Icon name="Mail" size={14} />
          <span>{application.email}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Icon name="Phone" size={14} />
          <span>{application.phone}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>Application Progress</span>
          <span>{Math.round((application.documentsCompleted / application.totalDocuments) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(application.documentsCompleted / application.totalDocuments) * 100}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {application.hasNewDocuments && (
            <span className="flex items-center space-x-1 text-xs text-accent">
              <Icon name="AlertCircle" size={12} />
              <span>New documents</span>
            </span>
          )}
          {application.hasComments && (
            <span className="flex items-center space-x-1 text-xs text-primary">
              <Icon name="MessageSquare" size={12} />
              <span>{application.commentCount} comments</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(application)}
          >
            <Icon name="Eye" size={14} className="mr-2" />
            Review
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onQuickAction(application, 'approve')}
            disabled={application.documentsCompleted !== application.totalDocuments}
          >
            <Icon name="CheckCircle" size={14} className="mr-2" />
            Quick Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;