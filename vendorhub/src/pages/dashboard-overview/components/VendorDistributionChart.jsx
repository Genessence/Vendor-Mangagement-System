import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import { API_BASE_URL } from '../../../config/api';

const VendorDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorDistribution = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/vendor-distribution`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const distributionData = await response.json();
        setData(distributionData);
        setError(null);
      } catch (err) {
        console.error('Error fetching vendor distribution:', err);
        setError('Failed to load vendor distribution');
        
        // Fallback to mock data
        setData([
          { name: 'Manufacturing', value: 145, color: '#1E40AF' },
          { name: 'Services', value: 89, color: '#059669' },
          { name: 'Technology', value: 67, color: '#F59E0B' },
          { name: 'Logistics', value: 43, color: '#DC2626' },
          { name: 'Others', value: 28, color: '#64748B' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDistribution();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-medium">
          <p className="text-sm font-medium text-popover-foreground">{data.name}</p>
          <p className="text-sm text-text-secondary">
            Vendors: <span className="font-medium text-foreground">{data.value}</span>
          </p>
          <p className="text-sm text-text-secondary">
            Percentage: <span className="font-medium text-foreground">
              {((data.value / data.payload.total) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-text-secondary">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Vendor Distribution by Category</h3>
        <button className="text-text-secondary hover:text-foreground transition-micro">
          <Icon name="MoreHorizontal" size={20} />
        </button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VendorDistributionChart;