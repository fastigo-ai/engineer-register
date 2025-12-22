import { useState, useEffect } from "react";
import AppHeader from "@/components/onboarding/AppHeader";
import AuthScreen from "@/components/onboarding/AuthScreen";
import ProfileScreen from "@/components/onboarding/ProfileScreen";
import KYCScreen from "@/components/onboarding/KYCScreen";
import BankScreen from "@/components/onboarding/BankScreen";
import StatusScreen from "@/components/onboarding/StatusScreen";
import { authApi, engineerApi } from "@/lib/api";

type OnboardingStep = "auth" | "profile" | "kyc" | "bank" | "status" | "loading";

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
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("loading");
  const [authData, setAuthData] = useState<AuthData>({ mobile: "", email: "" });
  const [verificationStatuses, setVerificationStatuses] = useState<VerificationStatuses>({
    profile: "pending",
    kyc: "pending",
    bank: "pending",
  });

  // Check for existing auth and status on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!authApi.isAuthenticated()) {
        setCurrentStep("auth");
        return;
      }

      try {
        const status = await engineerApi.getStatus();
        
        // Determine which step to show based on status
        if (status.profile_status === "pending") {
          setCurrentStep("profile");
        } else if (status.kyc_status === "pending") {
          setCurrentStep("kyc");
        } else if (status.bank_status === "pending") {
          setCurrentStep("bank");
        } else {
          // All steps completed, show status page
          setCurrentStep("status");
        }
      } catch (error) {
        // If status fetch fails (e.g., new user), start from profile
        setCurrentStep("profile");
      }
    };

    checkUserStatus();
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
        {currentStep === "loading" && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

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
