import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedCount, onExport, onBulkStatusUpdate, onImportVendors }) => {
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const exportOptions = [
    { value: 'csv', label: 'Export as CSV' },
    { value: 'excel', label: 'Export as Excel' },
    { value: 'pdf', label: 'Export as PDF' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending Review' }
  ];

  const handleBulkExport = (format) => {
    onExport(format);
    setShowBulkMenu(false);
  };

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      onBulkStatusUpdate(selectedStatus);
      setSelectedStatus('');
      setShowStatusUpdate(false);
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onImportVendors(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        {/* Selection Info */}
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount > 0 ? (
              `${selectedCount} vendor${selectedCount > 1 ? 's' : ''} selected`
            ) : (
              'No vendors selected'
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Import Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            iconName="Upload"
            iconPosition="left"
            iconSize={16}
          >
            Import Vendors
          </Button>

          {selectedCount > 0 && (
            <>
              {/* Bulk Export Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkMenu(!showBulkMenu)}
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Export Selected
                  <Icon name="ChevronDown" size={14} className="ml-1" />
                </Button>

                {showBulkMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBulkMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-medium z-20">
                      <div className="p-2">
                        {exportOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleBulkExport(option.value)}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-muted rounded-md transition-micro"
                          >
                            <Icon name="FileText" size={16} />
                            <span>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bulk Status Update */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                  iconName="Edit"
                  iconPosition="left"
                  iconSize={16}
                >
                  Update Status
                </Button>

                {showStatusUpdate && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowStatusUpdate(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-medium z-20 p-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Update Status</h4>
                        <Select
                          placeholder="Select new status"
                          options={statusOptions}
                          value={selectedStatus}
                          onChange={setSelectedStatus}
                        />
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleStatusUpdate}
                            disabled={!selectedStatus}
                            className="flex-1"
                          >
                            Update
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowStatusUpdate(false);
                              setSelectedStatus('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Delete Selected */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${selectedCount} selected vendor${selectedCount > 1 ? 's' : ''}?`)) {
                    // Handle bulk delete
                    console.log('Bulk delete confirmed');
                  }
                }}
                iconName="Trash2"
                iconPosition="left"
                iconSize={16}
              >
                Delete Selected
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {selectedCount === 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-text-secondary">Total Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">892</div>
              <div className="text-sm text-text-secondary">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">156</div>
              <div className="text-sm text-text-secondary">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error">23</div>
              <div className="text-sm text-text-secondary">Rejected</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;