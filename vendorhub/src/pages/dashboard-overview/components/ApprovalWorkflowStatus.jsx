import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_BASE_URL } from '../../../config/api';

const ApprovalWorkflowStatus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovalWorkflowStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/approval-workflow-status`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const workflowData = await response.json();
        setData(workflowData);
        setError(null);
      } catch (err) {
        console.error('Error fetching approval workflow status:', err);
        setError('Failed to load approval workflow status');
        
        // Fallback to mock data
        setData([
          { stage: 'Submitted', count: 12, color: '#64748B' },
          { stage: 'L1 Review', count: 8, color: '#F59E0B' },
          { stage: 'L2 Review', count: 5, color: '#D97706' },
          { stage: 'Approved', count: 28, color: '#059669' },
          { stage: 'Rejected', count: 3, color: '#DC2626' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalWorkflowStatus();
  }, []);

  const totalPending = data.slice(0, 3).reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="text-sm font-medium text-popover-foreground">{label}</p>
          <p className="text-sm text-text-secondary">
            Vendors: <span className="font-medium text-foreground">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getStatusIcon = (stage) => {
    const icons = {
      'Submitted': 'FileText',
      'L1 Review': 'Eye',
      'L2 Review': 'UserCheck',
      'Approved': 'CheckCircle',
      'Rejected': 'XCircle'
    };
    return icons[stage] || 'Circle';
  };

  const getStatusColor = (stage) => {
    const colors = {
      'Submitted': 'text-text-secondary',
      'L1 Review': 'text-warning',
      'L2 Review': 'text-warning',
      'Approved': 'text-success',
      'Rejected': 'text-error'
    };
    return colors[stage] || 'text-text-secondary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Approval Workflow Status</h3>
          <p className="text-sm text-text-secondary mt-1">
            {totalPending} vendors pending approval
          </p>
        </div>
        <Button variant="ghost" size="sm" iconName="RefreshCw" iconSize={16}>
          Refresh
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {data.map((item, index) => (
          <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
            <div className={`flex items-center justify-center mb-2 ${getStatusColor(item.stage)}`}>
              <Icon name={getStatusIcon(item.stage)} size={20} />
            </div>
            <div className="text-lg font-bold text-foreground">{item.count}</div>
            <div className="text-xs text-text-secondary">{item.stage}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="stage" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              fill={(entry) => entry.color}
            >
              {data.map((entry, index) => (
                <Bar key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-border">
        <Button 
          variant="default" 
          size="sm" 
          iconName="Clock" 
          iconSize={16}
          className="flex-1"
        >
          View Pending ({totalPending})
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          iconName="BarChart3" 
          iconSize={16}
          className="flex-1"
        >
          Detailed Report
        </Button>
      </div>
    </div>
  );
};

export default ApprovalWorkflowStatus;