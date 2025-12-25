import { useState, useEffect } from "react";
import AppHeader from "@/components/onboarding/AppHeader";
import AuthScreen from "@/components/onboarding/AuthScreen";
import ProfileScreen from "@/components/onboarding/ProfileScreen";
import KYCScreen from "@/components/onboarding/KYCScreen";
import BankScreen from "@/components/onboarding/BankScreen";
import StatusScreen from "@/components/onboarding/StatusScreen";
import { authApi, engineerApi } from "@/lib/api";

type OnboardingStep =
  | "auth"
  | "profile"
  | "kyc"
  | "bank"
  | "status"
  | "loading";

/**
 * Backend-compatible status values
 */
type BackendStatus =
  | "pending"
  | "completed"
  | "approved"
  | "rejected"
  | "verified"
  | "pending_review";

interface EngineerStatusResponse {
  profile_status: BackendStatus;
  kyc_status: BackendStatus;
  bank_status: BackendStatus;
  overall_status: BackendStatus;
}

const Index = () => {
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("loading");

  /**
   * Decide which screen to show based on backend status
   */
  const resolveStepFromStatus = (
    status: EngineerStatusResponse
  ): OnboardingStep => {
    if (!status.profile_status || status.profile_status === "pending") {
      return "profile";
    }

    if (status.kyc_status === "pending") {
      return "kyc";
    }

    if (status.bank_status === "pending") {
      return "bank";
    }

    return "status";
  };

  /**
   * Check authentication + status on load
   */
  useEffect(() => {
    const init = async () => {
      if (!authApi.isAuthenticated()) {
        setCurrentStep("auth");
        return;
      }

      try {
        const status: EngineerStatusResponse =
          await engineerApi.getStatus();
        setCurrentStep(resolveStepFromStatus(status));
      } catch {
        setCurrentStep("profile");
      }
    };

    init();
  }, []);

  /**
   * Logout
   */
  const handleSignOut = () => {
    authApi.removeToken();
    setCurrentStep("auth");
  };

  /**
   * After OTP authentication
   */
  const handleAuthComplete = async () => {
    setCurrentStep("loading");

    try {
      const status: EngineerStatusResponse =
        await engineerApi.getStatus();
      setCurrentStep(resolveStepFromStatus(status));
    } catch {
      setCurrentStep("profile");
    }
  };

  /**
   * Step completions
   */
  const handleProfileComplete = () => setCurrentStep("kyc");
  const handleKYCComplete = () => setCurrentStep("bank");
  const handleBankComplete = () => setCurrentStep("status");

  const isAuthenticated = currentStep !== "auth";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
      />

      <main>
        {currentStep === "loading" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {currentStep === "auth" && (
          <AuthScreen onAuthenticated={handleAuthComplete} />
        )}

        {currentStep === "profile" && (
          <ProfileScreen onComplete={handleProfileComplete} />
        )}

        {currentStep === "kyc" && (
          <KYCScreen
            onComplete={handleKYCComplete}
            onBack={() => setCurrentStep("profile")}
          />
        )}

        {currentStep === "bank" && (
          <BankScreen
            onComplete={handleBankComplete}
            onBack={() => setCurrentStep("kyc")}
          />
        )}

        {currentStep === "status" && <StatusScreen />}
      </main>
    </div>
  );
};

export default Index;
