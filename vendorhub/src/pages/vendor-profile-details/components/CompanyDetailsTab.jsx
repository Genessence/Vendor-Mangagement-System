import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';

const CompanyDetailsTab = ({ vendor, userRole, onVendorUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableVendor, setEditableVendor] = useState(vendor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update editableVendor when vendor prop changes
  React.useEffect(() => {
    setEditableVendor(vendor);
  }, [vendor]);

  const companyDetails = {
    basicInfo: {
      title: 'Basic Information',
      icon: 'Building2',
      fields: [
        { label: 'Company Name', value: editableVendor?.company_name || 'N/A', key: 'company_name' },
        { label: 'Business Vertical', value: editableVendor?.business_vertical || 'N/A', key: 'business_vertical' },
        { label: 'Supplier Type', value: editableVendor?.supplier_type || 'N/A', key: 'supplier_type' },
        { label: 'Industry Sector', value: editableVendor?.industry_sector || 'N/A', key: 'industry_sector' },
        { label: 'Year Established', value: editableVendor?.year_established || 'N/A', key: 'year_established' },
        { label: 'Business Description', value: editableVendor?.business_description || 'N/A', key: 'business_description' }
      ]
    },
    registrationInfo: {
      title: 'Registration Information',
      icon: 'FileText',
      fields: [
        { label: 'Country of Origin', value: editableVendor?.country_origin || 'N/A', key: 'country_origin' },
        { label: 'Registration Number', value: editableVendor?.registration_number || 'N/A', key: 'registration_number' },
        { label: 'PAN Number', value: editableVendor?.pan_number || 'N/A', key: 'pan_number' },
        { label: 'GST Number', value: editableVendor?.gst_number || 'N/A', key: 'gst_number' },
        { label: 'MSME Status', value: editableVendor?.msme_status || 'N/A', key: 'msme_status' },
        { label: 'MSME Number', value: editableVendor?.msme_number || 'N/A', key: 'msme_number' }
      ]
    },
    addressInfo: {
      title: 'Address Information',
      icon: 'MapPin',
      fields: [
        { label: 'Registered Address', value: editableVendor?.registered_address || 'N/A', key: 'registered_address', multiline: true },
        { label: 'Registered City', value: editableVendor?.registered_city || 'N/A', key: 'registered_city' },
        { label: 'Registered State', value: editableVendor?.registered_state || 'N/A', key: 'registered_state' },
        { label: 'Registered Country', value: editableVendor?.registered_country || 'N/A', key: 'registered_country' },
        { label: 'Registered Pincode', value: editableVendor?.registered_pincode || 'N/A', key: 'registered_pincode' },
        { label: 'Supply Address', value: editableVendor?.supply_address || 'N/A', key: 'supply_address', multiline: true },
        { label: 'Supply City', value: editableVendor?.supply_city || 'N/A', key: 'supply_city' },
        { label: 'Supply State', value: editableVendor?.supply_state || 'N/A', key: 'supply_state' },
        { label: 'Supply Country', value: editableVendor?.supply_country || 'N/A', key: 'supply_country' },
        { label: 'Supply Pincode', value: editableVendor?.supply_pincode || 'N/A', key: 'supply_pincode' }
      ]
    },
    businessInfo: {
      title: 'Business Information',
      icon: 'Briefcase',
      fields: [
        { label: 'Employee Count', value: editableVendor?.employee_count || 'N/A', key: 'employee_count' },
        { label: 'Annual Turnover', value: editableVendor?.annual_turnover ? `₹${editableVendor.annual_turnover.toLocaleString()}` : 'N/A', key: 'annual_turnover' },
        { label: 'Supplier Group', value: editableVendor?.supplier_group || 'N/A', key: 'supplier_group' },
        { label: 'Supplier Category', value: editableVendor?.supplier_category || 'N/A', key: 'supplier_category' },
        { label: 'Products/Services', value: editableVendor?.products_services || 'N/A', key: 'products_services' },
        { label: 'Certifications', value: editableVendor?.certifications || 'N/A', key: 'certifications' }
      ]
    }
  };

  const handleInputChange = (key, value) => {
    setEditableVendor(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/${vendor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(editableVendor)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const updatedVendor = await response.json();
      if (onVendorUpdate) {
        onVendorUpdate(updatedVendor);
      }
      setIsEditing(false);
      alert('Vendor details updated successfully!');
    } catch (err) {
      setError(`Failed to save changes: ${err.message}`);
      console.error('Error saving vendor details:', err);
    } finally {
      setLoading(false);
    }
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
              <Button variant="default" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button variant="default" iconName="Edit" iconPosition="left" onClick={handleEdit}>
              Edit Details
            </Button>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <p className="text-error text-sm">{error}</p>
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
              {section.fields.map(field => (
                <div key={field.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2">
                  <label className="text-sm font-medium text-text-secondary mb-1 sm:mb-0">{field.label}:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableVendor[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="flex-1 p-2 border border-border rounded-md text-sm text-foreground bg-background"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <span className="font-medium text-foreground text-right">{field.value}</span>
                  )}
                </div>
              ))}
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
              {editableVendor?.website ? (
                <a href={editableVendor.website} target="_blank" rel="noopener noreferrer" 
                   className="font-medium text-primary hover:underline">
                  {editableVendor.website}
                </a>
              ) : (
                <span className="font-medium text-foreground">N/A</span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Email:</span>
              <span className="font-medium text-foreground">{editableVendor?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Phone:</span>
              <span className="font-medium text-foreground">{editableVendor?.phone_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Contact Person:</span>
              <span className="font-medium text-foreground">{editableVendor?.contact_person_name || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Designation:</span>
              <span className="font-medium text-foreground">{editableVendor?.designation || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Credit Rating:</span>
              <span className="font-medium text-foreground">{editableVendor?.credit_rating || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Insurance Coverage:</span>
              <span className="font-medium text-foreground">{editableVendor?.insurance_coverage || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">GTA Registration:</span>
              <span className="font-medium text-foreground">{editableVendor?.gta_registration || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsTab;