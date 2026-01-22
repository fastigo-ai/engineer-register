import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AppHeader from "@/components/onboarding/AppHeader";
import AuthScreen from "@/components/onboarding/AuthScreen";
import ProfileScreen from "@/components/onboarding/ProfileScreen";
import KYCScreen from "@/components/onboarding/KYCScreen";
import BankScreen from "@/components/onboarding/BankScreen";
import StatusScreen from "@/components/onboarding/StatusScreen";
import UnderReviewScreen from "@/components/onboarding/UnderReviewScreen";

import { authApi, engineerApi } from "@/lib/api";

type OnboardingStep =
  | "auth"
  | "profile"
  | "kyc"
  | "bank"
  | "status"
  | "loading";

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
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("loading");

  const [authData, setAuthData] = useState<AuthData>({
    mobile: "",
    email: "",
  });

  const [verificationStatuses, setVerificationStatuses] =
    useState<VerificationStatuses>({
      profile: "pending",
      kyc: "pending",
      bank: "pending",
    });

  const [isHold, setIsHold] = useState<boolean>(false);

  // 🔁 Decide next step based on backend status
  const determineNextStep = (status: {
    profile_status: string;
    kyc_status: string;
    bank_status: string;
    is_hold: boolean;
  }): OnboardingStep => {
    if (status.profile_status === "pending") return "profile";
    if (status.is_hold) return "status";
    if (status.kyc_status === "pending") return "kyc";
    if (status.bank_status === "pending") return "bank";
    return "status";
  };

  // 🔍 On page load
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!authApi.isAuthenticated()) {
        setCurrentStep("auth");
        return;
      }

      try {
        const status = await engineerApi.getStatus();
        setIsHold(status.is_hold);

        const nextStep = determineNextStep(status);
        setCurrentStep(nextStep);

        if (nextStep === "status") {
          navigate("/status");
        }
      } catch (error) {
        setCurrentStep("profile");
      }
    };

    checkUserStatus();
  }, [navigate]);

  // 🚪 Logout
  const handleSignOut = () => {
    authApi.removeToken();
    setAuthData({ mobile: "", email: "" });
    setVerificationStatuses({
      profile: "pending",
      kyc: "pending",
      bank: "pending",
    });
    setCurrentStep("auth");
    navigate("/");
  };

  // 🔐 Auth complete
  const handleAuthComplete = async (data: AuthData) => {
    setAuthData(data);
    setCurrentStep("loading");

    try {
      const status = await engineerApi.getStatus();
      const nextStep = determineNextStep(status);
      setCurrentStep(nextStep);

      if (nextStep === "status") {
        navigate("/status");
      }
    } catch (error) {
      setCurrentStep("profile");
    }
  };

  // 👤 Profile complete
  const handleProfileComplete = (_data: unknown, hold: boolean) => {
    setVerificationStatuses((prev) => ({
      ...prev,
      profile: "pending",
    }));

    setIsHold(hold);

    if (hold) {
      setCurrentStep("status");
      navigate("/status");
    } else {
      setCurrentStep("kyc");
    }
  };

  // 🪪 KYC complete
  const handleKYCComplete = () => {
    setVerificationStatuses((prev) => ({
      ...prev,
      kyc: "pending",
    }));
    setCurrentStep("bank");
  };

  // 🏦 Bank complete → REDIRECT TO /status
  const handleBankComplete = () => {
    setVerificationStatuses((prev) => ({
      ...prev,
      bank: "pending",
    }));

    setCurrentStep("status");
    navigate("/status"); // ✅ MAIN REDIRECT
  };

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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {currentStep === "auth" && (
          <AuthScreen onAuthenticated={handleAuthComplete} />
        )}

        {isHold ? (
          <UnderReviewScreen />
        ) : (
          currentStep === "profile" && (
            <ProfileScreen
              initialData={authData}
              onComplete={handleProfileComplete}
            />
          )
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
            onBack={() => setCurrentStep("status")}
          />
        )}

        {currentStep === "status" && (
          <StatusScreen
            onStatusChange={(step) => setCurrentStep(step)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
