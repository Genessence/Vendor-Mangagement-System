import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const actions = [
    {
      title: 'Invite New Vendor',
      description: 'Send registration invitation to potential vendors',
      icon: 'UserPlus',
      color: 'primary',
      path: '/vendor-invitation',
      onClick: () => console.log('Invite vendor clicked')
    },
    {
      title: 'Pending Approvals',
      description: 'Review and approve vendor registrations',
      icon: 'Clock',
      color: 'warning',
      path: '/vendor-approval-workflow',
      badge: '3'
    },
    {
      title: 'Vendor Master',
      description: 'View and manage all registered vendors',
      icon: 'Building2',
      color: 'success',
      path: '/vendor-master-list'
    },
    {
      title: 'Generate Reports',
      description: 'Create vendor analytics and compliance reports',
      icon: 'FileBarChart',
      color: 'accent',
      path: '/reports',
      onClick: () => console.log('Generate reports clicked')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
      success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
      accent: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <div key={index} className="relative">
            {action.path ? (
              <Link
                to={action.path}
                className={`block p-4 rounded-lg border-2 transition-all duration-200 ${getColorClasses(action.color)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon name={action.icon} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                    <p className="text-xs opacity-80 line-clamp-2">{action.description}</p>
                  </div>
                  {action.badge && (
                    <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                      {action.badge}
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${getColorClasses(action.color)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon name={action.icon} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                    <p className="text-xs opacity-80 line-clamp-2">{action.description}</p>
                  </div>
                  {action.badge && (
                    <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                      {action.badge}
                    </span>
                  )}
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" size="sm" fullWidth iconName="Plus" iconSize={16}>
          Customize Quick Actions
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;