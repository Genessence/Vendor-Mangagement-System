import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  // Route mapping for breadcrumb generation
  const routeMap = {
    '/dashboard-overview': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/vendor-master-list': { label: 'Vendor Master', icon: 'Building2' },
    '/vendor-approval-workflow': { label: 'Approvals', icon: 'CheckCircle' },
    '/vendor-profile-details': { label: 'Vendor Profile', icon: 'User' },
    '/public-vendor-registration-form': { label: 'Vendor Registration', icon: 'UserPlus' },
    '/company-user-login': { label: 'Login', icon: 'LogIn' }
  };

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/dashboard-overview', icon: 'Home' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap[currentPath];
      
      if (routeInfo && currentPath !== '/dashboard-overview') {
        breadcrumbs.push({
          label: routeInfo.label,
          path: currentPath,
          icon: routeInfo.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Don't show breadcrumbs on login page or if only one item
  if (location.pathname === '/company-user-login' || breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.path || index} className="flex items-center">
              {index > 0 && (
                <Icon name="ChevronRight" size={14} className="mx-2 text-border" />
              )}
              
              {isLast ? (
                <span className="flex items-center space-x-1 text-foreground font-medium">
                  <Icon name={item.icon} size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden truncate max-w-24">{item.label}</span>
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center space-x-1 hover:text-foreground transition-micro"
                >
                  <Icon name={item.icon} size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">...</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;