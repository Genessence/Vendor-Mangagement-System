import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';

const RecentActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/recent-activities?limit=10`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const activitiesData = await response.json();
        
        // Transform timestamps to relative time
        const transformedActivities = activitiesData.map(activity => ({
          ...activity,
          timestamp: formatRelativeTime(activity.timestamp)
        }));
        
        setActivities(transformedActivities);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent activities:', err);
        setError('Failed to load recent activities');
        
        // Fallback to mock data
        setActivities([
          {
            id: 1,
            type: 'vendor_submitted',
            title: 'New Vendor Registration',
            description: 'TechCorp Solutions submitted registration form',
            timestamp: '2 minutes ago',
            icon: 'UserPlus',
            color: 'text-primary',
            bgColor: 'bg-primary/10'
          },
          {
            id: 2,
            type: 'vendor_approved',
            title: 'Vendor Approved',
            description: 'Global Manufacturing Ltd. has been approved by Sarah Johnson',
            timestamp: '15 minutes ago',
            icon: 'CheckCircle',
            color: 'text-success',
            bgColor: 'bg-success/10'
          },
          {
            id: 3,
            type: 'document_uploaded',
            title: 'Document Uploaded',
            description: 'Amber Logistics uploaded GST certificate',
            timestamp: '1 hour ago',
            icon: 'FileText',
            color: 'text-accent',
            bgColor: 'bg-accent/10'
          },
          {
            id: 4,
            type: 'vendor_rejected',
            title: 'Vendor Rejected',
            description: 'Quick Services rejected due to incomplete documentation',
            timestamp: '2 hours ago',
            icon: 'XCircle',
            color: 'text-error',
            bgColor: 'bg-error/10'
          },
          {
            id: 5,
            type: 'user_login',
            title: 'User Login',
            description: 'Michael Rodriguez logged into the system',
            timestamp: '3 hours ago',
            icon: 'LogIn',
            color: 'text-text-secondary',
            bgColor: 'bg-muted'
          },
          {
            id: 6,
            type: 'vendor_invited',
            title: 'Vendor Invited',
            description: 'Invitation sent to premium.suppliers@email.com',
            timestamp: '4 hours ago',
            icon: 'Mail',
            color: 'text-primary',
            bgColor: 'bg-primary/10'
          },
          {
            id: 7,
            type: 'system_update',
            title: 'System Update',
            description: 'Vendor management system updated to v2.1.3',
            timestamp: '1 day ago',
            icon: 'Settings',
            color: 'text-text-secondary',
            bgColor: 'bg-muted'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button variant="ghost" size="sm" iconName="RefreshCw" iconSize={16}>
          Refresh
        </Button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`flex items-start space-x-4 p-4 hover:bg-muted/50 transition-micro ${
              index !== activities.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor}`}>
              <Icon name={activity.icon} size={18} className={activity.color} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {activity.title}
              </h4>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {activity.description}
              </p>
              <p className="text-xs text-text-secondary mt-2">
                {activity.timestamp}
              </p>
            </div>
            
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-micro">
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" fullWidth iconName="Eye" iconSize={16}>
          View All Activities
        </Button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;