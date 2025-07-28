import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VendorHeader = ({ vendor, onEdit, onStatusChange, userRole }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'inactive':
        return 'bg-error text-error-foreground';
      case 'suspended':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6 shadow-subtle">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Vendor Basic Info */}
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Building2" size={32} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-semibold text-foreground truncate">
                {vendor.companyName}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendor.status)}`}>
                {vendor.status}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Hash" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Vendor Code:</span>
                <span className="font-medium text-foreground">{vendor.vendorCode}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Email:</span>
                <span className="font-medium text-foreground truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Phone:</span>
                <span className="font-medium text-foreground">{vendor.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Location:</span>
                <span className="font-medium text-foreground">{vendor.city}, {vendor.country}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Registered:</span>
                <span className="font-medium text-foreground">{vendor.registrationDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Tag" size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Category:</span>
                <span className="font-medium text-foreground">{vendor.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-auto">
          {(userRole === 'Admin' || userRole === 'Approver') && (
            <>
              <Button
                variant="default"
                iconName="Edit"
                iconPosition="left"
                onClick={onEdit}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
                onClick={onStatusChange}
                className="w-full sm:w-auto"
              >
                Change Status
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            iconName="Download"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;