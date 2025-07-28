import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on July 25, 2024 from 2:00 AM to 4:00 AM IST. Some features may be unavailable.',
      timestamp: '2024-07-24T09:00:00Z',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Feature: Bulk Vendor Import',
      message: 'You can now import multiple vendors using CSV/Excel files. Check the Vendor Master section.',
      timestamp: '2024-07-24T08:30:00Z',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'System Update Completed',
      message: 'VendorHub has been updated to version 2.1.3 with improved performance and security.',
      timestamp: '2024-07-23T16:45:00Z',
      isRead: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'error',
      title: 'Failed Email Notifications',
      message: '3 vendor invitation emails failed to send. Please check email configuration.',
      timestamp: '2024-07-23T14:20:00Z',
      isRead: false,
      priority: 'high'
    }
  ]);

  const getNotificationIcon = (type) => {
    const icons = {
      warning: 'AlertTriangle',
      info: 'Info',
      success: 'CheckCircle',
      error: 'XCircle'
    };
    return icons[type] || 'Bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      warning: 'text-warning',
      info: 'text-primary',
      success: 'text-success',
      error: 'text-error'
    };
    return colors[type] || 'text-text-secondary';
  };

  const getNotificationBg = (type) => {
    const backgrounds = {
      warning: 'bg-warning/10',
      info: 'bg-primary/10',
      success: 'bg-success/10',
      error: 'bg-error/10'
    };
    return backgrounds[type] || 'bg-muted';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-error text-error-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-success text-success-foreground'
    };
    return badges[priority] || badges.low;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">System Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" iconName="Settings" iconSize={16}>
          Settings
        </Button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">No notifications at this time</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div 
              key={notification.id}
              className={`flex items-start space-x-4 p-4 hover:bg-muted/50 transition-micro ${
                !notification.isRead ? 'bg-muted/30' : ''
              } ${index !== notifications.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBg(notification.type)}`}>
                <Icon 
                  name={getNotificationIcon(notification.type)} 
                  size={18} 
                  className={getNotificationColor(notification.type)} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`text-sm font-medium truncate ${!notification.isRead ? 'text-foreground' : 'text-text-secondary'}`}>
                    {notification.title}
                  </h4>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadge(notification.priority)}`}>
                      {notification.priority}
                    </span>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => markAsRead(notification.id)}
                        iconName="Check"
                        iconSize={12}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => dismissNotification(notification.id)}
                      iconName="X"
                      iconSize={12}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              iconName="CheckCheck" 
              iconSize={16}
              onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
            >
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" iconName="Eye" iconSize={16}>
              View All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemNotifications;