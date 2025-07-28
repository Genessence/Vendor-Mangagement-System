import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending_level_1', label: 'Pending Level 1' },
    { value: 'pending_level_2', label: 'Pending Level 2' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const urgencyOptions = [
    { value: '', label: 'All Urgency' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'raw_materials', label: 'Raw Materials' },
    { value: 'services', label: 'Services' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'software', label: 'Software' },
    { value: 'consulting', label: 'Consulting' }
  ];

  const countryOptions = [
    { value: '', label: 'All Countries' },
    { value: 'India', label: 'India' },
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Singapore', label: 'Singapore' }
  ];

  const sortOptions = [
    { value: 'submission_date_desc', label: 'Latest First' },
    { value: 'submission_date_asc', label: 'Oldest First' },
    { value: 'urgency_desc', label: 'High Urgency First' },
    { value: 'company_name_asc', label: 'Company A-Z' },
    { value: 'company_name_desc', label: 'Company Z-A' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Filter Applications</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
          >
            <Icon name="X" size={14} className="mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Input
          type="search"
          placeholder="Search companies..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />

        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters.status || ''}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          placeholder="Filter by urgency"
          options={urgencyOptions}
          value={filters.urgency || ''}
          onChange={(value) => handleFilterChange('urgency', value)}
        />

        <Select
          placeholder="Filter by category"
          options={categoryOptions}
          value={filters.category || ''}
          onChange={(value) => handleFilterChange('category', value)}
        />

        <Select
          placeholder="Filter by country"
          options={countryOptions}
          value={filters.country || ''}
          onChange={(value) => handleFilterChange('country', value)}
        />

        <Select
          placeholder="Sort by"
          options={sortOptions}
          value={filters.sortBy || 'submission_date_desc'}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Filter" size={14} />
            <span>Active filters applied</span>
            <span className="text-primary font-medium">
              {Object.values(filters).filter(value => value && value !== '').length} filter(s)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;