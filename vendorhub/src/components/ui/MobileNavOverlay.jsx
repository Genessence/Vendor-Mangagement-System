import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MobileNavOverlay = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard-overview', 
      icon: 'LayoutDashboard',
      description: 'System overview and metrics'
    },
    { 
      label: 'Vendor Master', 
      path: '/vendor-master-list', 
      icon: 'Building2',
      description: 'Complete vendor directory'
    },
    { 
      label: 'Approvals', 
      path: '/vendor-approval-workflow', 
      icon: 'CheckCircle',
      description: 'Pending vendor approvals',
      badge: 3
    },
    { 
      label: 'Vendor Profiles', 
      path: '/vendor-profile-details', 
      icon: 'User',
      description: 'Detailed vendor information'
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-200 lg:hidden"
        onClick={onClose}
      />
      
      {/* Overlay Panel */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-surface border-r border-border shadow-medium z-200 lg:hidden transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link to="/dashboard-overview" className="flex items-center space-x-3" onClick={onClose}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">VendorHub</span>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-text-secondary hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 space-y-3">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-4 px-4 py-4 rounded-lg text-base font-medium transition-micro ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm opacity-75 mt-0.5">{item.description}</div>
              </div>
              {item.badge && (
                <span className="bg-accent text-accent-foreground text-sm px-2 py-1 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="default"
              className="w-full justify-start text-text-secondary hover:text-foreground"
              onClick={onClose}
            >
              <Icon name="Settings" size={18} className="mr-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="default"
              className="w-full justify-start text-text-secondary hover:text-foreground"
              onClick={onClose}
            >
              <Icon name="HelpCircle" size={18} className="mr-4" />
              Help & Support
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavOverlay;