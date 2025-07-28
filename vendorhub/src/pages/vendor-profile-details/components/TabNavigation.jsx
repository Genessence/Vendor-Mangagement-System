import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-surface border border-border rounded-lg mb-6 shadow-subtle">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-micro whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-foreground hover:border-border'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;