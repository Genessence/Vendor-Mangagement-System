import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
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

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/company-user-login" element={<CompanyUserLogin />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/vendor-approval-workflow" element={<VendorApprovalWorkflow />} />
        <Route path="/public-vendor-registration-form" element={<PublicVendorRegistrationForm />} />
        <Route path="/vendor-master-list" element={<VendorMasterList />} />
        <Route path="/vendor-profile-details" element={<VendorProfileDetails />} />
        <Route path="/vendor-profile-details/:vendorId" element={<VendorProfileDetails />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;