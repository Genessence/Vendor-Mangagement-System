import React from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import VendorDistributionChart from './components/VendorDistributionChart';
import OnboardingTrendsChart from './components/OnboardingTrendsChart';
import RecentActivityFeed from './components/RecentActivityFeed';
import QuickActions from './components/QuickActions';
import ApprovalWorkflowStatus from './components/ApprovalWorkflowStatus';
import SystemNotifications from './components/SystemNotifications';

const DashboardOverview = () => {
  // Mock metrics data
  const metricsData = [
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
  ];

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
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {metricsData.map((metric, index) => (
                <MetricsCard
                  key={index}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  changeType={metric.changeType}
                  icon={metric.icon}
                  color={metric.color}
                />
              ))}
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