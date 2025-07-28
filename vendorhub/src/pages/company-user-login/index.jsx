import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyLogo from './components/CompanyLogo';
import LoginForm from './components/LoginForm';
import SecurityNotice from './components/SecurityNotice';
import SystemStatus from './components/SystemStatus';

const CompanyUserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in with JWT token
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Redirect to dashboard if token exists
      navigate('/dashboard-overview');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-2xl shadow-medium p-8">
          {/* Company Logo Section */}
          <CompanyLogo />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Security Notice */}
          <SecurityNotice />
          
          {/* System Status */}
          <SystemStatus />
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Amber Enterprises India Limited. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-text-secondary">
            <a href="#" className="hover:text-foreground transition-micro">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-micro">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-micro">Support</a>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
    </div>
  );
};

export default CompanyUserLogin;