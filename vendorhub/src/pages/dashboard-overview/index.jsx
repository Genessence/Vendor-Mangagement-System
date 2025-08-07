import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import VendorDistributionChart from './components/VendorDistributionChart';
import OnboardingTrendsChart from './components/OnboardingTrendsChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActions from './components/QuickActions';
import ApprovalWorkflowStatus from './components/ApprovalWorkflowStatus';
import SystemNotifications from './components/SystemNotifications';
import { API_BASE_URL } from '../../config/api';

const DashboardOverview = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard metrics from API
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/dashboard/metrics`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match component expectations
        const transformedMetrics = [
          {
            title: 'Total Vendors',
            value: data.totalVendors.value.toString(),
            change: data.totalVendors.change,
            changeType: data.totalVendors.changeType,
            icon: 'Building2',
            color: 'primary'
          },
          {
            title: 'Pending Approvals',
            value: data.pendingApprovals.value.toString(),
            change: data.pendingApprovals.change,
            changeType: data.pendingApprovals.changeType,
            icon: 'Clock',
            color: 'warning'
          },
          {
            title: 'This Month Onboarded',
            value: data.thisMonthOnboarded.value.toString(),
            change: data.thisMonthOnboarded.change,
            changeType: data.thisMonthOnboarded.changeType,
            icon: 'UserPlus',
            color: 'success'
          },
          {
            title: 'Compliance Rate',
            value: data.complianceRate.value,
            change: data.complianceRate.change,
            changeType: data.complianceRate.changeType,
            icon: 'Shield',
            color: 'accent'
          }
        ];
        
        setMetricsData(transformedMetrics);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        setError('Failed to load dashboard metrics');
        
        // Fallback to mock data
        setMetricsData([
          {
            title: 'Total Vendors',
            value: '372',
            change: '+12%',
            changeType: 'positive',
            icon: 'Building2',
            color: 'primary'
          },
          {
            title: 'Pending Approvals',
            value: '25',
            change: '+5',
            changeType: 'neutral',
            icon: 'Clock',
            color: 'warning'
          },
          {
            title: 'This Month Onboarded',
            value: '42',
            change: '+18%',
            changeType: 'positive',
            icon: 'UserPlus',
            color: 'success'
          },
          {
            title: 'Compliance Rate',
            value: '94.2%',
            change: '+2.1%',
            changeType: 'positive',
            icon: 'Shield',
            color: 'accent'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-60 p-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-text-secondary">
                Welcome back! Here's what's happening with your vendor management system today.
              </p>
              {error && (
                <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {loading ? (
                // Loading skeleton for metrics cards
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-subtle animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-muted"></div>
                      <div className="w-16 h-4 bg-muted rounded"></div>
                    </div>
                    <div className="w-20 h-8 bg-muted rounded mb-2"></div>
                    <div className="w-32 h-4 bg-muted rounded"></div>
                  </div>
                ))
              ) : (
                metricsData.map((metric, index) => (
                  <MetricsCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    changeType={metric.changeType}
                    icon={metric.icon}
                    color={metric.color}
                  />
                ))
              )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <VendorDistributionChart />
              <OnboardingTrendsChart />
            </div>

            {/* Approval Workflow Status */}
            <div className="mb-8">
              <ApprovalWorkflowStatus />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <QuickActions />
              </div>

              {/* Recent Activity Feed */}
              <div className="lg:col-span-1">
                <RecentActivityFeed />
              </div>

              {/* System Notifications */}
              <div className="lg:col-span-1">
                <SystemNotifications />
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-text-secondary">
              <p>&copy; {new Date().getFullYear()} VendorHub - Amber Enterprises India Limited. All rights reserved.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardOverview;