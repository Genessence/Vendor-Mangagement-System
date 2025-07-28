import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import CompanyUserLogin from "pages/company-user-login";
import DashboardOverview from "pages/dashboard-overview";
import VendorApprovalWorkflow from "pages/vendor-approval-workflow";
import PublicVendorRegistrationForm from "pages/public-vendor-registration-form";
import VendorMasterList from "pages/vendor-master-list";
import VendorProfileDetails from "pages/vendor-profile-details";
import NotFound from "pages/NotFound";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/company-user-login" replace />;
  }
  
  return children;
}

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Redirect root to login if not authenticated */}
        <Route path="/" element={<Navigate to="/company-user-login" replace />} />
        <Route path="/company-user-login" element={<CompanyUserLogin />} />
        {/* Protected routes */}
        <Route path="/dashboard-overview" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
        <Route path="/vendor-approval-workflow" element={<ProtectedRoute><VendorApprovalWorkflow /></ProtectedRoute>} />
        <Route path="/public-vendor-registration-form" element={<PublicVendorRegistrationForm />} />
        <Route path="/vendor-master-list" element={<ProtectedRoute><VendorMasterList /></ProtectedRoute>} />
        <Route path="/vendor-profile-details" element={<ProtectedRoute><VendorProfileDetails /></ProtectedRoute>} />
        <Route path="/vendor-profile-details/:vendorId" element={<ProtectedRoute><VendorProfileDetails /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;