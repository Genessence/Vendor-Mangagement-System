import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyLogo = () => {
  return (
    <div className="text-center mb-8">
      {/* Company Logo */}
      <div className="flex justify-center mb-4">
        <img src="/assets/images/amber_logo.png" alt="Amber Logo" className="h-20 w-auto" style={{maxWidth: '120px'}} />
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