import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CompanyDetailsTab = ({ vendor, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);

  const companyDetails = {
    basicInfo: {
      title: 'Basic Information',
      icon: 'Building2',
      fields: [
        { label: 'Company Name', value: vendor.companyName, key: 'companyName' },
        { label: 'Legal Name', value: vendor.legalName, key: 'legalName' },
        { label: 'Business Type', value: vendor.businessType, key: 'businessType' },
        { label: 'Industry', value: vendor.industry, key: 'industry' },
        { label: 'Sub Industry', value: vendor.subIndustry, key: 'subIndustry' },
        { label: 'Year Established', value: vendor.yearEstablished, key: 'yearEstablished' }
      ]
    },
    registrationInfo: {
      title: 'Registration Information',
      icon: 'FileText',
      fields: [
        { label: 'PAN Number', value: vendor.panNumber, key: 'panNumber' },
        { label: 'GST Number', value: vendor.gstNumber, key: 'gstNumber' },
        { label: 'CIN Number', value: vendor.cinNumber, key: 'cinNumber' },
        { label: 'MSME Number', value: vendor.msmeNumber, key: 'msmeNumber' },
        { label: 'Registration Date', value: vendor.registrationDate, key: 'registrationDate' },
        { label: 'Nature of Assessee', value: vendor.natureOfAssessee, key: 'natureOfAssessee' }
      ]
    },
    addressInfo: {
      title: 'Address Information',
      icon: 'MapPin',
      fields: [
        { label: 'Registered Address', value: vendor.registeredAddress, key: 'registeredAddress', multiline: true },
        { label: 'Supply Address', value: vendor.supplyAddress, key: 'supplyAddress', multiline: true },
        { label: 'City', value: vendor.city, key: 'city' },
        { label: 'State', value: vendor.state, key: 'state' },
        { label: 'Country', value: vendor.country, key: 'country' },
        { label: 'Postal Code', value: vendor.postalCode, key: 'postalCode' }
      ]
    },
    businessInfo: {
      title: 'Business Information',
      icon: 'Briefcase',
      fields: [
        { label: 'Employee Count', value: vendor.employeeCount, key: 'employeeCount' },
        { label: 'Annual Revenue', value: vendor.annualRevenue, key: 'annualRevenue' },
        { label: 'Business Vertical', value: vendor.businessVertical, key: 'businessVertical' },
        { label: 'Supplier Category', value: vendor.supplierCategory, key: 'supplierCategory' },
        { label: 'Supplier Type', value: vendor.supplierType, key: 'supplierType' },
        { label: 'Currency Code', value: vendor.currencyCode, key: 'currencyCode' }
      ]
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Handle save logic
    setIsEditing(false);
  };

  const renderField = (field) => {
    if (field.multiline) {
      return (
        <div key={field.key} className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">{field.label}:</label>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-foreground whitespace-pre-wrap">{field.value}</p>
          </div>
        </div>
      );
    }

    return (
      <div key={field.key} className="flex justify-between items-center py-2">
        <span className="text-text-secondary">{field.label}:</span>
        <span className="font-medium text-foreground text-right">{field.value}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      {(userRole === 'Admin' || userRole === 'Approver') && (
        <div className="flex justify-end space-x-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="default" iconName="Edit" iconPosition="left" onClick={handleEdit}>
              Edit Details
            </Button>
          )}
        </div>
      )}

      {/* Company Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(companyDetails).map(([sectionKey, section]) => (
          <div key={sectionKey} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Icon name={section.icon} size={20} className="mr-2" />
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.fields.map(renderField)}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Info" size={20} className="mr-2" />
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Website:</span>
              <a href={vendor.website} target="_blank" rel="noopener noreferrer" 
                 className="font-medium text-primary hover:underline">
                {vendor.website}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">LinkedIn:</span>
              <a href={vendor.linkedin} target="_blank" rel="noopener noreferrer" 
                 className="font-medium text-primary hover:underline">
                View Profile
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Credit Rating:</span>
              <span className="font-medium text-foreground">{vendor.creditRating}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Payment Terms:</span>
              <span className="font-medium text-foreground">{vendor.paymentTerms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Delivery Terms:</span>
              <span className="font-medium text-foreground">{vendor.deliveryTerms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Quality Rating:</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-foreground">{vendor.qualityRating}</span>
                <Icon name="Star" size={16} className="text-warning" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsTab;