import { useState } from "react";
import { Shield, Smartphone, Mail, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";

interface AuthScreenProps {
  onAuthenticated: (data: { mobile: string; email: string }) => void;
}

const AuthScreen = ({ onAuthenticated }: AuthScreenProps) => {
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [inputValue, setInputValue] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState<string>("");

  const isEmail = inputValue.includes("@");

  const handleSendOtp = async () => {
    if (!inputValue) {
      toast({
        title: "Error",
        description: "Please enter your email or mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const mode = isEmail ? "email" : "mobile";
      const response = await authApi.register(mode, inputValue);
      console.log("Register response:", response);
      
      if (!response.identifier) {
        throw new Error("No identifier received from server");
      }
      
      setIdentifier(response.identifier);
      setShowOtp(true);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${inputValue}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Verifying OTP with identifier:", identifier, "otp:", otp);
      const response = await authApi.verifyOtp(identifier, otp);
      authApi.setToken(response.access_token);
      toast({
        title: "Success",
        description: "Verification successful!",
      });
      onAuthenticated({
        mobile: isEmail ? "" : inputValue,
        email: isEmail ? inputValue : "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "OTP verification failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="glass-card rounded-2xl p-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {authMode === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {authMode === "signin"
                ? "Sign in to continue your journey"
                : "Join Door2fy as a verified engineer"}
            </p>
          </div>

          {!showOtp ? (
            <>
              {/* Auth Tabs */}
              <Tabs
                value={authMode}
                onValueChange={(v) => setAuthMode(v as "signin" | "register")}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Input */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {isEmail ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <Smartphone className="h-5 w-5" />
                    )}
                  </div>
                  <Input
                    type="text"
                    placeholder="Email or Mobile Number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="input-field pl-12"
                  />
                </div>

                <Button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send OTP
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </>
          ) : (
            /* OTP Verification */
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 mb-4">
                  <Lock className="w-6 h-6 text-success" />
                </div>
                <h2 className="text-lg font-semibold">Enter Verification Code</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We sent a 6-digit code to {inputValue}
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="w-12 h-14 text-lg border-border/60 rounded-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 text-base font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify & Continue"
                )}
              </Button>

              <button
                onClick={() => {
                  setShowOtp(false);
                  setOtp("");
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Change number or email
              </button>
            </div>
          )}
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          <Shield className="inline h-3 w-3 mr-1" />
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;