import React from 'react';
import Icon from '../../../components/AppIcon';

const FormHeader = ({ currentStep, totalSteps }) => {
  return (
    <div className="bg-surface border-b border-border shadow-subtle">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Company Branding */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={24} color="white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Amber Enterprises India Limited</h1>
              <p className="text-sm text-text-secondary">Vendor Registration Portal</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <React.Fragment key={stepNumber}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-micro ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : isCompleted 
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-text-secondary'
                }`}>
                  {isCompleted ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < totalSteps && (
                  <div className={`w-8 h-0.5 transition-micro ${
                    isCompleted ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Labels */}
        <div className="grid grid-cols-6 gap-2 text-xs text-center text-text-secondary">
          <div className={currentStep === 1 ? 'text-primary font-medium' : ''}>Company Info</div>
          <div className={currentStep === 2 ? 'text-primary font-medium' : ''}>Address Details</div>
          <div className={currentStep === 3 ? 'text-primary font-medium' : ''}>Bank Info</div>
          <div className={currentStep === 4 ? 'text-primary font-medium' : ''}>Categorization</div>
          <div className={currentStep === 5 ? 'text-primary font-medium' : ''}>Compliance</div>
          <div className={currentStep === 6 ? 'text-primary font-medium' : ''}>Agreements</div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;