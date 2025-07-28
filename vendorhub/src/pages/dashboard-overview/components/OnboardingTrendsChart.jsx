import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Button from '../../../components/ui/Button';


const OnboardingTrendsChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('6months');

  const data = [
    { month: 'Jan', vendors: 12, approved: 10, pending: 2 },
    { month: 'Feb', vendors: 18, approved: 15, pending: 3 },
    { month: 'Mar', vendors: 25, approved: 22, pending: 3 },
    { month: 'Apr', vendors: 31, approved: 28, pending: 3 },
    { month: 'May', vendors: 28, approved: 25, pending: 3 },
    { month: 'Jun', vendors: 35, approved: 32, pending: 3 },
    { month: 'Jul', vendors: 42, approved: 38, pending: 4 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label} 2024</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-text-secondary">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
              {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Vendor Onboarding Trends</h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('line')}
              iconName="TrendingUp"
              iconSize={14}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="xs"
              onClick={() => setChartType('bar')}
              iconName="BarChart3"
              iconSize={14}
            >
              Bar
            </Button>
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-input text-foreground"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="vendors" 
                stroke="#1E40AF" 
                strokeWidth={3}
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
                name="Total Vendors"
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
                name="Approved"
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                name="Pending"
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="vendors" fill="#1E40AF" name="Total Vendors" radius={[2, 2, 0, 0]} />
              <Bar dataKey="approved" fill="#059669" name="Approved" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OnboardingTrendsChart;