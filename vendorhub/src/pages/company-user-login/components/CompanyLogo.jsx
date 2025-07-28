import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyLogo = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-medium">
          <Icon name="Building2" size={32} color="white" />
        </div>
      </div>
      
      {/* Company Name & System Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          VendorHub
        </h1>
        <p className="text-sm text-text-secondary">
          Amber Enterprises India Limited
        </p>
        <p className="text-xs text-text-secondary font-medium">
          Vendor Management System
        </p>
      </div>
    </div>
  );
};

export default CompanyLogo;