import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'Sarah Johnson',
    role: 'Procurement Manager',
    email: 'sarah.johnson@company.com'
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard-overview', icon: 'LayoutDashboard' },
    { label: 'Vendors', path: '/vendor-master-list', icon: 'Building2' },
    { label: 'Approvals', path: '/vendor-approval-workflow', icon: 'CheckCircle' }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logging out...');
  };

  return (
    <header className="bg-surface border-b border-border shadow-subtle sticky top-0 z-100">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard-overview" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">VendorHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-micro ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Menu & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-medium text-foreground">{user.name}</div>
                <div className="text-xs text-text-secondary">{user.role}</div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-text-secondary" />
            </Button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-medium z-150">
                <div className="p-4 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground">{user.name}</div>
                  <div className="text-xs text-text-secondary">{user.email}</div>
                  <div className="text-xs text-accent font-medium mt-1">{user.role}</div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-muted rounded-md transition-micro"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-muted rounded-md transition-micro"
                  >
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-micro"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-micro ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* User Menu Backdrop */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-100"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;