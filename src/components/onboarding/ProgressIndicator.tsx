import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const ProgressIndicator = ({ steps, currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`step-indicator ${
                  currentStep > step.id
                    ? "step-completed"
                    : currentStep === step.id
                    ? "step-active"
                    : "step-pending"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5 animate-check" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-200 ${
                  currentStep >= step.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 md:w-24 h-0.5 mx-2 transition-colors duration-500 ${
                  currentStep > step.id ? "bg-success" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
