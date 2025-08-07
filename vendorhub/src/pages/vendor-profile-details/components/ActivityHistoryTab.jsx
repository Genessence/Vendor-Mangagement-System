import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityHistoryTab = ({ vendor }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  // For new vendors, show empty activity filters
  const activityFilters = [
    { id: 'all', label: 'All Activities', count: 0 },
    { id: 'profile', label: 'Profile Changes', count: 0 },
    { id: 'documents', label: 'Documents', count: 0 },
    { id: 'approvals', label: 'Approvals', count: 0 },
    { id: 'orders', label: 'Orders', count: 0 },
    { id: 'payments', label: 'Payments', count: 0 }
  ];

  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' }
  ];

  // Empty activities array for new vendors
  const activities = [];

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
        
        {filteredActivities.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <Icon name="Activity" size={64} className="text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Activity History</h3>
            <p className="text-text-secondary mb-6">This vendor doesn't have any activity history yet.</p>
            <p className="text-sm text-text-secondary">Activity will appear here once the vendor starts interacting with the system.</p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Activity Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">0</div>
            <div className="text-sm text-text-secondary">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">0</div>
            <div className="text-sm text-text-secondary">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">0</div>
            <div className="text-sm text-text-secondary">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">0</div>
            <div className="text-sm text-text-secondary">Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryTab;