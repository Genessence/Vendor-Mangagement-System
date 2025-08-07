import React from 'react';
import Icon from '../../../components/AppIcon';

const BankInformationTab = ({ vendor }) => {
  // Use real vendor bank data instead of static data
  const bankAccounts = vendor?.bank_info ? [vendor.bank_info] : [];

  // If no bank info in relationship, try to use main vendor fields
  if (bankAccounts.length === 0 && vendor?.bank_name) {
    bankAccounts.push({
      id: 1,
      bank_name: vendor.bank_name,
      branch_name: vendor.branch_name,
      account_number: vendor.account_number,
      ifsc_code: vendor.ifsc_code,
      swift_code: vendor.swift_code,
      account_type: vendor.account_type,
      bank_address: vendor.bank_address,
      isPrimary: true,
      status: 'Pending Verification',
      verificationDate: null
    });
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'bg-success text-success-foreground';
      case 'pending verification':
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'rejected':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Bank Accounts */}
      {bankAccounts.length > 0 ? (
        <div className="space-y-4">
          {bankAccounts.map((account, index) => (
            <div key={account.id || index} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="CreditCard" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                      <span>{account.bank_name || 'N/A'}</span>
                      {account.isPrimary && (
                        <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                          Primary
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-text-secondary">{account.branch_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(account.status)}`}>
                    {account.status || 'Pending Verification'}
                  </span>
                  <Icon name="MoreVertical" size={20} className="text-text-secondary cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Account Holder Name</label>
                  <p className="text-sm text-foreground font-medium">{vendor?.company_name || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Account Number</label>
                  <p className="text-sm text-foreground font-mono">{account.account_number || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {vendor?.country_origin === 'IN' ? 'IFSC Code' : 'Swift Code'}
                  </label>
                  <p className="text-sm text-foreground font-mono">
                    {vendor?.country_origin === 'IN' ? (account.ifsc_code || 'N/A') : (account.swift_code || 'N/A')}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Account Type</label>
                  <p className="text-sm text-foreground">{account.account_type || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Currency</label>
                  <p className="text-sm text-foreground">{vendor?.preferred_currency || 'INR'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Verification Date</label>
                  <p className="text-sm text-foreground">
                    {account.verificationDate || 'Not verified'}
                  </p>
                </div>
              </div>

              {/* Bank Address */}
              {account.bank_address && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Bank Address</label>
                    <p className="text-sm text-foreground">{account.bank_address}</p>
                  </div>
                </div>
              )}

              {/* Bank Proof Documents */}
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">Supporting Documents</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                    <Icon name="FileText" size={16} className="text-text-secondary" />
                    <span className="text-sm text-foreground">
                      {vendor?.country_origin === 'IN' ? 'Cancelled Cheque' : 'Signed Letterhead'}
                    </span>
                    <Icon name="Download" size={14} className="text-primary cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="CreditCard" size={64} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Bank Information Available</h3>
          <p className="text-text-secondary mb-6">This vendor hasn't provided bank information yet.</p>
        </div>
      )}

      {/* Payment History Summary - Empty for new vendors */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2" />
          Payment History Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">₹0</div>
            <div className="text-sm text-text-secondary">Total Payments Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">0</div>
            <div className="text-sm text-text-secondary">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">N/A</div>
            <div className="text-sm text-text-secondary">Average Payment Time</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions - Empty for new vendors */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="History" size={20} className="mr-2" />
          Recent Transactions
        </h3>
        <div className="text-center py-8">
          <Icon name="History" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No transaction history available</p>
          <p className="text-sm text-text-secondary mt-1">Transactions will appear here once the vendor starts receiving payments</p>
        </div>
      </div>
    </div>
  );
};

export default BankInformationTab;