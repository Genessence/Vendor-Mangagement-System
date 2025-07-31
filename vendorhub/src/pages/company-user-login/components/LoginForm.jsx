import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import logo from "../../../../assets/images/amber-logo.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    console.log('Form submitted!', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    console.log('Form validation passed, attempting login...');
    setIsLoading(true);
    
    const result = await login(formData.email, formData.password);
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, redirecting...');
      // Optionally, store rememberMe flag
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      // Redirect to dashboard
      navigate('/dashboard-overview');
    } else {
      console.log('Login failed:', result.error);
      setErrors({
        general: result.error || 'Invalid credentials or server error. Please try again.'
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    alert(`Password reset request sent to admin for: ${formData.email}\n\nAdmin will contact you within 24 hours with new credentials.`);
  };

  const handleContactAdmin = () => {
    window.location.href = 'mailto:admin@amberenterprises.com?subject=VendorHub Access Request&body=Hello Admin,%0A%0AI would like to request access to the VendorHub system.%0A%0AName: %0ADesignation: %0ADepartment: %0ARequired Role: %0A%0AThank you.';
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto" style={{marginTop: "-20px"}}>
      {/* <div className="flex flex-col items-center mb-6">
        <img src={logo} alt="Amber Logo" className="h-14 w-auto mb-2" style={{maxWidth: '120px'}} />
      </div> */}
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-1">Sign in to VendorHub</h2>
          <p className="text-text-secondary text-sm">Enter your credentials to access your account.</p>
        </div>
        {errors.general && (
          <div className="mb-4 text-red-600 text-sm whitespace-pre-line">{errors.general}</div>
        )}
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          autoComplete="username"
          disabled={isLoading}
        />
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          autoComplete="current-password"
          disabled={isLoading}
          iconName={showPassword ? 'EyeOff' : 'Eye'}
          onIconClick={() => setShowPassword(prev => !prev)}
        />
        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between" style={{margin: "20px 0"}}>
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