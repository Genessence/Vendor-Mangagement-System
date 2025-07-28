import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityHistoryTab = ({ vendor }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  const activityFilters = [
    { id: 'all', label: 'All Activities', count: 45 },
    { id: 'profile', label: 'Profile Changes', count: 12 },
    { id: 'documents', label: 'Documents', count: 8 },
    { id: 'approvals', label: 'Approvals', count: 6 },
    { id: 'orders', label: 'Orders', count: 15 },
    { id: 'payments', label: 'Payments', count: 4 }
  ];

  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' }
  ];

  const activities = [
    {
      id: 1,
      type: 'profile',
      title: 'Profile Information Updated',
      description: 'Contact person designation changed from "Manager" to "General Manager"',
      user: 'Admin User',
      timestamp: '2 hours ago',
      date: '24/07/2024 09:15:30',
      icon: 'User',
      severity: 'info',
      details: {
        field: 'Contact Person Designation',
        oldValue: 'Manager',
        newValue: 'General Manager',
        reason: 'Promotion update'
      }
    },
    {
      id: 2,
      type: 'orders',
      title: 'New Purchase Order Created',
      description: 'Purchase Order #PO-2024-1247 created for electronic components worth ₹2,45,000',
      user: 'Procurement Team',
      timestamp: '4 hours ago',
      date: '24/07/2024 07:30:15',
      icon: 'ShoppingCart',
      severity: 'success',
      details: {
        orderNumber: 'PO-2024-1247',
        amount: '₹2,45,000',
        items: '15 items',
        deliveryDate: '30/07/2024'
      }
    },
    {
      id: 3,
      type: 'documents',
      title: 'Document Uploaded',
      description: 'New ISO 14001:2015 Environmental Management certificate uploaded',
      user: 'Rajesh Kumar',
      timestamp: '1 day ago',
      date: '23/07/2024 16:45:22',
      icon: 'Upload',
      severity: 'info',
      details: {
        documentName: 'ISO 14001:2015 Certificate',
        fileSize: '1.2 MB',
        expiryDate: '21/03/2027',
        status: 'Under Review'
      }
    },
    {
      id: 4,
      type: 'payments',
      title: 'Payment Processed',
      description: 'Invoice #INV-2024-0892 payment of ₹1,85,000 completed successfully',
      user: 'Finance Team',
      timestamp: '2 days ago',
      date: '22/07/2024 11:20:45',
      icon: 'CreditCard',
      severity: 'success',
      details: {
        invoiceNumber: 'INV-2024-0892',
        amount: '₹1,85,000',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN-2024-789456'
      }
    },
    {
      id: 5,
      type: 'approvals',
      title: 'Vendor Status Changed',
      description: 'Vendor status changed from "Pending" to "Active" after final approval',
      user: 'Approval Manager',
      timestamp: '3 days ago',
      date: '21/07/2024 14:10:30',
      icon: 'CheckCircle',
      severity: 'success',
      details: {
        previousStatus: 'Pending',
        newStatus: 'Active',
        approver: 'John Smith',
        remarks: 'All documents verified and approved'
      }
    },
    {
      id: 6,
      type: 'documents',
      title: 'Document Verification Completed',
      description: 'PAN Card verification completed successfully',
      user: 'Verification Team',
      timestamp: '3 days ago',
      date: '21/07/2024 10:30:15',
      icon: 'Shield',
      severity: 'success',
      details: {
        documentName: 'PAN Card',
        verificationMethod: 'Government Database',
        verificationId: 'VER-2024-001234',
        status: 'Verified'
      }
    },
    {
      id: 7,
      type: 'profile',
      title: 'Bank Account Added',
      description: 'New HDFC Bank account added for payment processing',
      user: 'Rajesh Kumar',
      timestamp: '4 days ago',
      date: '20/07/2024 15:45:20',
      icon: 'CreditCard',
      severity: 'info',
      details: {
        bankName: 'HDFC Bank',
        accountType: 'Savings Account',
        ifscCode: 'HDFC0002345',
        status: 'Pending Verification'
      }
    },
    {
      id: 8,
      type: 'approvals',
      title: 'Document Review Requested',
      description: 'Additional documentation requested for MSME certificate verification',
      user: 'Compliance Officer',
      timestamp: '5 days ago',
      date: '19/07/2024 12:15:45',
      icon: 'AlertCircle',
      severity: 'warning',
      details: {
        documentName: 'MSME Certificate',
        requestType: 'Additional Documentation',
        requirement: 'Updated certificate with current address',
        deadline: '26/07/2024'
      }
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-error bg-error/10';
      case 'info':
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Activity Filters */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Activity Filters</h3>
            <div className="flex flex-wrap gap-2">
              {activityFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-micro ${
                    selectedFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-text-secondary hover:text-foreground hover:bg-muted/80'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedFilter === filter.id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-text-secondary/20 text-text-secondary'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Activity Timeline
        </h3>
        
        <div className="space-y-6">
          {filteredActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline Line */}
              {index < filteredActivities.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Activity Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getSeverityColor(activity.severity)}`}>
                  <Icon name={activity.icon} size={20} />
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{activity.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-secondary">{activity.timestamp}</div>
                      <div className="text-xs text-text-secondary">{activity.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="User" size={14} />
                      <span>By {activity.user}</span>
                    </div>
                  </div>
                  
                  {/* Activity Details */}
                  {activity.details && (
                    <div className="bg-muted rounded-lg p-4">
                      <h5 className="font-medium text-foreground mb-2">Details:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(activity.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm text-text-secondary capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-sm text-foreground font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Activity Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">45</div>
            <div className="text-sm text-text-secondary">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">12</div>
            <div className="text-sm text-text-secondary">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">3</div>
            <div className="text-sm text-text-secondary">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">2</div>
            <div className="text-sm text-text-secondary">Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryTab;