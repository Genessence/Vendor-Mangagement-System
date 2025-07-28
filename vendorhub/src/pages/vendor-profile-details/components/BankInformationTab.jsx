import React from 'react';
import Icon from '../../../components/AppIcon';

const BankInformationTab = ({ vendor }) => {
  const bankAccounts = [
    {
      id: 1,
      accountName: vendor.companyName,
      accountNumber: 'XXXX-XXXX-XXXX-4567',
      bankName: 'State Bank of India',
      branchName: 'Mumbai Central Branch',
      ifscCode: 'SBIN0001234',
      accountType: 'Current Account',
      currency: 'INR',
      isPrimary: true,
      status: 'Verified',
      verificationDate: '15/03/2024'
    },
    {
      id: 2,
      accountName: vendor.companyName,
      accountNumber: 'XXXX-XXXX-XXXX-8901',
      bankName: 'HDFC Bank',
      branchName: 'Andheri East Branch',
      ifscCode: 'HDFC0002345',
      accountType: 'Savings Account',
      currency: 'INR',
      isPrimary: false,
      status: 'Pending Verification',
      verificationDate: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'bg-success text-success-foreground';
      case 'pending verification':
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
      <div className="space-y-4">
        {bankAccounts.map((account) => (
          <div key={account.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="CreditCard" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <span>{account.bankName}</span>
                    {account.isPrimary && (
                      <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                        Primary
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-text-secondary">{account.branchName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(account.status)}`}>
                  {account.status}
                </span>
                <Icon name="MoreVertical" size={20} className="text-text-secondary cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Account Holder Name</label>
                <p className="text-sm text-foreground font-medium">{account.accountName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Account Number</label>
                <p className="text-sm text-foreground font-mono">{account.accountNumber}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">IFSC Code</label>
                <p className="text-sm text-foreground font-mono">{account.ifscCode}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Account Type</label>
                <p className="text-sm text-foreground">{account.accountType}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Currency</label>
                <p className="text-sm text-foreground">{account.currency}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Verification Date</label>
                <p className="text-sm text-foreground">
                  {account.verificationDate || 'Not verified'}
                </p>
              </div>
            </div>

            {/* Bank Proof Documents */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Supporting Documents</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                  <Icon name="FileText" size={16} className="text-text-secondary" />
                  <span className="text-sm text-foreground">Cancelled Cheque</span>
                  <Icon name="Download" size={14} className="text-primary cursor-pointer" />
                </div>
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                  <Icon name="FileText" size={16} className="text-text-secondary" />
                  <span className="text-sm text-foreground">Bank Statement</span>
                  <Icon name="Download" size={14} className="text-primary cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment History Summary */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2" />
          Payment History Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">₹45,67,890</div>
            <div className="text-sm text-text-secondary">Total Payments Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">247</div>
            <div className="text-sm text-text-secondary">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-foreground mb-1">2.4 days</div>
            <div className="text-sm text-text-secondary">Average Payment Time</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="History" size={20} className="mr-2" />
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Date</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Invoice</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 text-sm font-medium text-text-secondary">Account</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 text-sm text-foreground">22/07/2024</td>
                <td className="py-3 text-sm text-foreground">INV-2024-1247</td>
                <td className="py-3 text-sm text-foreground font-medium">₹2,45,000</td>
                <td className="py-3">
                  <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                </td>
                <td className="py-3 text-sm text-foreground">SBI - 4567</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 text-sm text-foreground">20/07/2024</td>
                <td className="py-3 text-sm text-foreground">INV-2024-1246</td>
                <td className="py-3 text-sm text-foreground font-medium">₹1,85,000</td>
                <td className="py-3">
                  <span className="bg-warning text-warning-foreground text-xs px-2 py-1 rounded-full">
                    Processing
                  </span>
                </td>
                <td className="py-3 text-sm text-foreground">HDFC - 8901</td>
              </tr>
              <tr>
                <td className="py-3 text-sm text-foreground">18/07/2024</td>
                <td className="py-3 text-sm text-foreground">INV-2024-1245</td>
                <td className="py-3 text-sm text-foreground font-medium">₹3,25,000</td>
                <td className="py-3">
                  <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                </td>
                <td className="py-3 text-sm text-foreground">SBI - 4567</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankInformationTab;