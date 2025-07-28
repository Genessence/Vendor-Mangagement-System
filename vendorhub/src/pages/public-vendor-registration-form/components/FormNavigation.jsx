import React from 'react';
import Button from '../../../components/ui/Button';

const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit, 
  isSubmitting,
  canProceed 
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="bg-surface border-t border-border px-6 py-4 sticky bottom-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Previous Button */}
        <div className="flex-1">
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={onPrevious}
              iconName="ChevronLeft"
              iconPosition="left"
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex-1 text-center">
          <span className="text-sm text-text-secondary">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Next/Submit Button */}
        <div className="flex-1 flex justify-end">
          {isLastStep ? (
            <Button
              variant="default"
              onClick={onSubmit}
              loading={isSubmitting}
              disabled={!canProceed || isSubmitting}
              iconName="Send"
              iconPosition="right"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={onNext}
              disabled={!canProceed}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormNavigation;