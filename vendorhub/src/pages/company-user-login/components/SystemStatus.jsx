import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus] = useState('operational'); // operational, maintenance, degraded

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'operational':
        return 'text-success';
      case 'maintenance':
        return 'text-warning';
      case 'degraded':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'operational':
        return 'CheckCircle';
      case 'maintenance':
        return 'AlertTriangle';
      case 'degraded':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        {/* System Status */}
        <div className="flex items-center space-x-2">
          <Icon name={getStatusIcon()} size={14} className={getStatusColor()} />
          <span>System {systemStatus}</span>
        </div>
        
        {/* Current Time */}
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={14} />
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>
      
      {/* Version Info */}
      <div className="text-center mt-3">
        <span className="text-xs text-text-secondary">
          VendorHub v2.1.0 | Build 2024.07.24
        </span>
      </div>
    </div>
  );
};

export default SystemStatus;