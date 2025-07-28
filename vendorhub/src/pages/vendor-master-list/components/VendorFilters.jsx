import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VendorFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const vendorTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'supplier', label: 'Supplier' },
    { value: 'service_provider', label: 'Service Provider' },
    { value: 'distributor', label: 'Distributor' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'chemicals', label: 'Chemicals' },
    { value: 'machinery', label: 'Machinery' },
    { value: 'services', label: 'Services' }
  ];

  const countryOptions = [
    { value: '', label: 'All Countries' },
    { value: 'india', label: 'India' },
    { value: 'usa', label: 'United States' },
    { value: 'china', label: 'China' },
    { value: 'germany', label: 'Germany' },
    { value: 'japan', label: 'Japan' },
    { value: 'uk', label: 'United Kingdom' }
  ];

  const msmeStatusOptions = [
    { value: '', label: 'All MSME Status' },
    { value: 'msme', label: 'MSME' },
    { value: 'non_msme', label: 'Non-MSME' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full font-medium">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search vendors..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full"
        />
        
        <Select
          placeholder="Select status"
          options={statusOptions}
          value={filters.status || ''}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          placeholder="Select type"
          options={vendorTypeOptions}
          value={filters.vendorType || ''}
          onChange={(value) => handleFilterChange('vendorType', value)}
        />

        <Select
          placeholder="Select country"
          options={countryOptions}
          value={filters.country || ''}
          onChange={(value) => handleFilterChange('country', value)}
          searchable
        />
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Select
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              value={filters.category || ''}
              onChange={(value) => handleFilterChange('category', value)}
            />

            <Select
              label="MSME Status"
              placeholder="Select MSME status"
              options={msmeStatusOptions}
              value={filters.msmeStatus || ''}
              onChange={(value) => handleFilterChange('msmeStatus', value)}
            />

            <Input
              label="Vendor Code"
              type="text"
              placeholder="Enter vendor code"
              value={filters.vendorCode || ''}
              onChange={(e) => handleFilterChange('vendorCode', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Registration Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  placeholder="From date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="To date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Annual Turnover Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={filters.turnoverMin || ''}
                  onChange={(e) => handleFilterChange('turnoverMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={filters.turnoverMax || ''}
                  onChange={(e) => handleFilterChange('turnoverMax', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === '') return null;
              
              const getFilterLabel = (key, value) => {
                switch (key) {
                  case 'search': return `Search: "${value}"`;
                  case 'status': return `Status: ${statusOptions.find(opt => opt.value === value)?.label || value}`;
                  case 'vendorType': return `Type: ${vendorTypeOptions.find(opt => opt.value === value)?.label || value}`;
                  case 'country': return `Country: ${countryOptions.find(opt => opt.value === value)?.label || value}`;
                  case 'category': return `Category: ${categoryOptions.find(opt => opt.value === value)?.label || value}`;
                  case 'msmeStatus': return `MSME: ${msmeStatusOptions.find(opt => opt.value === value)?.label || value}`;
                  case 'vendorCode': return `Code: ${value}`;
                  case 'dateFrom': return `From: ${value}`;
                  case 'dateTo': return `To: ${value}`;
                  case 'turnoverMin': return `Min: ₹${value}`;
                  case 'turnoverMax': return `Max: ₹${value}`;
                  default: return `${key}: ${value}`;
                }
              };

              return (
                <div
                  key={key}
                  className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  <span>{getFilterLabel(key, value)}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-micro"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorFilters;