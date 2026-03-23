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
  const [engineerData, setEngineerData] = useState<any>(null);

  // 🔁 Decide next step based on backend status
  const determineNextStep = (status: {
    profile_status: string;
    kyc_status: string;
    bank_status: string;
    is_hold: boolean;
    overall_status?: string;
  }): OnboardingStep => {
    // Condition 1: Fully Verified
    if (status.overall_status === "verified") return "status";
    
    // Condition 2: Profile Pending (First login / First step)
    if (status.profile_status === "pending" && !status.is_hold) return "profile"; // Should haven't happened based on current backend but for safety
    if (status.profile_status === "pending") return "profile";

    // Condition 3: Unheld by Admin (status active) but KYC incomplete
    if (!status.is_hold && status.kyc_status === "incomplete") return "kyc";
    
    // Condition 4: Default hold behavior (after profile/kyc/bank)
    if (status.is_hold) return "status";

    // Condition 5: Normal progression
    if (status.kyc_status === "incomplete") return "kyc";
    if (status.bank_status === "incomplete") return "bank";
    
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
        const data = await engineerApi.getEngineerDetails();
        setEngineerData(data);
        setAuthData({
            mobile: data.profile?.phone || "",
            email: data.profile?.email || data.user.email || ""
        });

        const status = await engineerApi.getStatus();
        setIsHold(status.is_hold);

        const nextStep = determineNextStep(status);
        setCurrentStep(nextStep);
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
    setEngineerData(null);
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
      // 🔄 Fetch details first
      const details = await engineerApi.getEngineerDetails();
      setEngineerData(details);

      const status = await engineerApi.getStatus();
      const nextStep = determineNextStep(status);
      setCurrentStep(nextStep);
    } catch (error) {
      setCurrentStep("profile");
    }
  };

  // 👤 Profile complete
  const handleProfileComplete = (_data: any) => {
    setVerificationStatuses((prev) => ({
      ...prev,
      profile: "pending",
    }));

    // Re-fetch details to see if we should go to next/status
    engineerApi.getStatus().then(status => {
        setIsHold(status.is_hold);
        if (status.is_hold) {
            setCurrentStep("status");
        } else if (status.kyc_status !== "incomplete") {
            // Already has KYC (Edit mode), go back to status
            setCurrentStep("status");
        } else {
            setCurrentStep("kyc");
        }
    });
  };

  // 🪪 KYC complete
  const handleKYCComplete = () => {
    setVerificationStatuses((prev) => ({
      ...prev,
      kyc: "pending",
    }));

    // After KYC, if Bank is already done (Edit mode), go to status
    engineerApi.getStatus().then(status => {
      if (status.bank_status !== "incomplete") {
        setCurrentStep("status");
      } else {
        setCurrentStep("bank");
      }
    });
  };

  // 🏦 Bank complete
  const handleBankComplete = () => {
    setVerificationStatuses((prev) => ({
      ...prev,
      bank: "pending",
    }));
    // After bank details, always go to status (Dashboard)
    setCurrentStep("status");
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

        {isHold && currentStep === "status" ? (
          <UnderReviewScreen />
        ) : (
          <>
            {currentStep === "profile" && (
              <ProfileScreen
                initialData={engineerData || { mobile: authData.mobile, email: authData.email }}
                onComplete={handleProfileComplete}
              />
            )}

            {currentStep === "kyc" && (
              <KYCScreen
                initialData={engineerData}
                onComplete={handleKYCComplete}
                onBack={() => setCurrentStep("profile")}
              />
            )}

            {currentStep === "bank" && (
              <BankScreen
                initialData={engineerData}
                onComplete={handleBankComplete}
                onBack={() => setCurrentStep("kyc")}
              />
            )}
            {currentStep === "status" && (
              <StatusScreen
                onStatusChange={(step) => setCurrentStep(step as any)}
                onEdit={() => setCurrentStep("profile")}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
