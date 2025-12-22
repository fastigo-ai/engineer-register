import { useState } from "react";
import { User, Phone, Mail, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ProgressIndicator from "./ProgressIndicator";
import { engineerApi } from "@/lib/api";

const steps = [
  { id: 1, title: "Profile" },
  { id: 2, title: "KYC" },
  { id: 3, title: "Bank" },
  { id: 4, title: "Status" },
];

const skillOptions = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Carpentry",
  "Painting",
  "Appliance Repair",
  "Masonry",
  "Welding",
  "Roofing",
  "Flooring",
];

interface ProfileData {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  skills: string[];
}

interface ProfileScreenProps {
  initialData: { mobile: string; email: string };
  onComplete: (data: ProfileData) => void;
}

const ProfileScreen = ({ initialData, onComplete }: ProfileScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    mobile: initialData.mobile,
    email: initialData.email,
    address: "",
    city: "",
    state: "",
    pinCode: "",
    skills: [],
  });

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.address || !formData.city || !formData.pinCode) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (formData.skills.length === 0) {
      toast({
        title: "Select Skills",
        description: "Please select at least one skill",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await engineerApi.saveProfile({
        full_name: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pin_code: formData.pinCode,
        skills: formData.skills,
      });
      toast({
        title: "Profile Saved",
        description: "Your profile details have been saved successfully",
      });
      onComplete(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator steps={steps} currentStep={1} />

        <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Complete Your Profile</h1>
              <p className="text-sm text-muted-foreground">Step 1 of 4</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field pl-11"
                />
              </div>
            </div>

            {/* Mobile & Email Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    readOnly={!!initialData.mobile}
                    placeholder="Enter mobile number"
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className={`input-field pl-11 ${initialData.mobile ? "bg-muted/50" : ""}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    readOnly={!!initialData.email}
                    placeholder="Enter email address"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`input-field pl-11 ${initialData.email ? "bg-muted/50" : ""}`}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-11 min-h-[80px] resize-none border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* City, State, PIN Row */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code *</Label>
                <Input
                  id="pinCode"
                  placeholder="PIN Code"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                Skills / Expertise *
              </Label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`chip ${
                      formData.skills.includes(skill) ? "chip-selected" : "chip-default"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="w-full h-12 text-base font-medium mt-6"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save & Continue"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
