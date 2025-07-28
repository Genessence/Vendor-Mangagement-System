import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityNotice = () => {
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg border border-border">
      <div className="flex items-start space-x-3">
        <Icon name="Shield" size={18} className="text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <h3 className="font-medium text-foreground mb-2">Security Notice</h3>
          <ul className="text-text-secondary space-y-1 text-xs">
            <li>• Your session will automatically timeout after 30 minutes of inactivity</li>
            <li>• Always log out when using shared computers</li>
            <li>• Report any suspicious activity to IT security immediately</li>
            <li>• This system is for authorized personnel only</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;