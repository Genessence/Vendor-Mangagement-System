import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-surface border-r border-border shadow-subtle z-100 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } hidden lg:block`}>
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/dashboard-overview" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">VendorHub</span>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/dashboard-overview" className="flex items-center justify-center w-full">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={20} color="white" />
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-micro relative ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon name={item.icon} size={18} />
              {!isCollapsed && (
                <>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
                  </div>
                  {item.badge && (
                    <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-text-secondary hover:text-foreground"
              >
                <Icon name="Settings" size={16} className="mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-text-secondary hover:text-foreground"
              >
                <Icon name="HelpCircle" size={16} className="mr-3" />
                Help & Support
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-text-secondary hover:text-foreground"
                title="Settings"
              >
                <Icon name="Settings" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-full text-text-secondary hover:text-foreground"
                title="Help & Support"
              >
                <Icon name="HelpCircle" size={16} />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* This will be handled by the Header component's mobile menu */}
      </div>
    </>
  );
};

export default Sidebar;