import { useState, useEffect } from "react";
import AppHeader from "@/components/onboarding/AppHeader";
import AuthScreen from "@/components/onboarding/AuthScreen";
import ProfileScreen from "@/components/onboarding/ProfileScreen";
import KYCScreen from "@/components/onboarding/KYCScreen";
import BankScreen from "@/components/onboarding/BankScreen";
import StatusScreen from "@/components/onboarding/StatusScreen";
import { authApi } from "@/lib/api";

type OnboardingStep = "auth" | "profile" | "kyc" | "bank" | "status";

interface AuthData {
  mobile: string;
  email: string;
}

type VerificationStatus = "pending" | "approved" | "rejected";

interface VerificationStatuses {
  profile: VerificationStatus;
  kyc: VerificationStatus;
  bank: VerificationStatus;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("auth");
  const [authData, setAuthData] = useState<AuthData>({ mobile: "", email: "" });
  const [verificationStatuses, setVerificationStatuses] = useState<VerificationStatuses>({
    profile: "pending",
    kyc: "pending",
    bank: "pending",
  });

  // Check for existing auth on mount
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      setCurrentStep("profile");
    }
  }, []);

  const handleSignOut = () => {
    authApi.removeToken();
    setCurrentStep("auth");
    setAuthData({ mobile: "", email: "" });
    setVerificationStatuses({
      profile: "pending",
      kyc: "pending",
      bank: "pending",
    });
  };

  const handleAuthComplete = (data: AuthData) => {
    setAuthData(data);
    setCurrentStep("profile");
  };

  const handleProfileComplete = () => {
    setVerificationStatuses((prev) => ({ ...prev, profile: "approved" }));
    setCurrentStep("kyc");
  };

  const handleKYCComplete = () => {
    setVerificationStatuses((prev) => ({ ...prev, kyc: "pending" }));
    setCurrentStep("bank");
  };

  const handleBankComplete = () => {
    setVerificationStatuses((prev) => ({ ...prev, bank: "pending" }));
    setCurrentStep("status");
  };

  const isAuthenticated = currentStep !== "auth";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />

      <main>
        {currentStep === "auth" && (
          <AuthScreen onAuthenticated={handleAuthComplete} />
        )}

        {currentStep === "profile" && (
          <ProfileScreen
            initialData={authData}
            onComplete={handleProfileComplete}
          />
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
