import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for different user roles
  const mockCredentials = [
    { email: 'admin@amberenterprises.com', password: 'Admin@123', role: 'Admin' },
    { email: 'approver@amberenterprises.com', password: 'Approver@123', role: 'Approver' },
    { email: 'viewer@amberenterprises.com', password: 'Viewer@123', role: 'Viewer' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const user = mockCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );
      
      if (user) {
        // Store user session
        localStorage.setItem('vendorHubUser', JSON.stringify({
          email: user.email,
          role: user.role,
          loginTime: new Date().toISOString(),
          rememberMe: formData.rememberMe
        }));
        
        // Navigate to dashboard
        navigate('/dashboard-overview');
      } else {
        setErrors({
          general: `Invalid credentials. Please use valid email and password.\nDemo credentials:\n• Admin: admin@amberenterprises.com / Admin@123\n• Approver: approver@amberenterprises.com / Approver@123\n• Viewer: viewer@amberenterprises.com / Viewer@123`
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    
    // Simulate admin notification
    alert(`Password reset request sent to admin for: ${formData.email}\n\nAdmin will contact you within 24 hours with new credentials.`);
  };

  const handleContactAdmin = () => {
    window.location.href = 'mailto:admin@amberenterprises.com?subject=VendorHub Access Request&body=Hello Admin,%0A%0AI would like to request access to the VendorHub system.%0A%0AName: %0ADesignation: %0ADepartment: %0ARequired Role: %0A%0AThank you.';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0" />
              <div className="text-sm text-error whitespace-pre-line">
                {errors.general}
              </div>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your work email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-text-secondary hover:text-foreground transition-micro"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-micro"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="LogIn"
          iconPosition="right"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Admin Contact Info */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-text-secondary mb-3">
            Don't have an account? Accounts are created by administrators only.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleContactAdmin}
            iconName="Mail"
            iconPosition="left"
            disabled={isLoading}
          >
            Contact Admin for Access
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;