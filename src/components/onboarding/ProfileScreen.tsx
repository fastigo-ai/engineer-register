import { useState } from "react";
import { User, Phone, Mail, MapPin, Wrench, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ProgressIndicator from "./ProgressIndicator";
import { engineerApi } from "@/lib/api";

const steps = [
  { id: 1, title: "Profile" },
  { id: 2, title: "KYC" },
  { id: 3, title: "Bank" },
  { id: 4, title: "Status" },
];

const skillCategories = {
  "💻 Desktop & Laptop": [
    "Laptop & Desktop Troubleshooting (Hardware + Software)",
    "Windows / macOS Installation & Configuration",
    "Software Installation, Errors & Performance Fix",
    "Virus, Malware & Security Cleanup",
    "Data Backup, Recovery & OS Optimization",
  ],
  "🌐 Networking & IT Infrastructure": [
    "LAN / WAN / Wi-Fi Setup & Troubleshooting",
    "Router, Switch & Firewall (Basic–Intermediate)",
    "IP Configuration, DNS, DHCP Understanding",
    "Printer, Scanner & Peripheral Setup",
  ],
  "☁️ Cloud & Remote Support": [
    "Remote Support Tools (AnyDesk, TeamViewer, RDP)",
    "Basic Cloud Knowledge (AWS / Azure fundamentals)",
    "Email Setup (Google Workspace, Outlook, IMAP/POP)",
    "Backup & Cloud Storage Support",
  ],
};

const specializations = [
  "Laptop Support",
  "Desktop Support",
  "Macbook Support",
];

const genderOptions = ["Male", "Female", "Other"];

interface ProfileData {
  fullName: string;
  dob: string;
  gender: string;
  contactNumber: string;
  email: string;
  skillCategory: string[];
  specializations: string[];
  preferredCity: string;
  currentLocation: string;
  willingToRelocate: boolean;
}

interface ProfileScreenProps {
  initialData: { mobile: string; email: string };
  onComplete: (data: ProfileData) => void;
}

const ProfileScreen = ({ initialData, onComplete }: ProfileScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    dob: "",
    gender: "",
    contactNumber: initialData.mobile,
    email: initialData.email,
    skillCategory: [],
    specializations: [],
    preferredCity: "",
    currentLocation: "",
    willingToRelocate: false,
  });

 const toggleSkillCategory = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillCategory: prev.skillCategory.includes(skill)
        ? prev.skillCategory.filter((s) => s !== skill)
        : [...prev.skillCategory, skill],
    }));
  };

  const toggleSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.dob || !formData.gender || !formData.contactNumber || !formData.email) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (formData.skillCategory.length === 0) {
      toast({
        title: "Select Skill Category",
        description: "Please select at least one skill category",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await engineerApi.saveProfile({
        full_name: formData.fullName,
        dob: formData.dob,
        gender: formData.gender,
        contact_number: formData.contactNumber,
        email: formData.email,
        skill_category: formData.skillCategory,
        specializations: formData.specializations,
        preferred_city: formData.preferredCity,
        current_location: formData.currentLocation,
        willing_to_relocate: formData.willingToRelocate,
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

            {/* DOB & Gender Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <div className="flex gap-2">
                  {genderOptions.map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`chip flex-1 ${
                        formData.gender === gender ? "chip-selected" : "chip-default"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Email Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    readOnly={!!initialData.mobile}
                    placeholder="Enter contact number"
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className={`input-field pl-11 ${initialData.mobile ? "bg-muted/50" : ""}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
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

            {/* Skill Category - Multiple Selection */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                Skill Category * (Select multiple)
              </Label>
              {Object.entries(skillCategories).map(([category, skills]) => (
                <div key={category} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkillCategory(skill)}
                        className={`chip ${
                          formData.skillCategory.includes(skill) ? "chip-selected" : "chip-default"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Specializations */}
            <div className="space-y-3">
              <Label>Specializations (Optional)</Label>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialization(spec)}
                    className={`chip ${
                      formData.specializations.includes(spec) ? "chip-selected" : "chip-default"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentLocation">Current Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentLocation"
                    placeholder="Enter current city"
                    value={formData.currentLocation}
                    onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredCity">Preferred City</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="preferredCity"
                    placeholder="Enter preferred city"
                    value={formData.preferredCity}
                    onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                    className="input-field pl-11"
                  />
                </div>
              </div>
            </div>

            {/* Willing to Relocate */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, willingToRelocate: !formData.willingToRelocate })}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  formData.willingToRelocate
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border"
                }`}
              >
                {formData.willingToRelocate && (
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <Label className="cursor-pointer" onClick={() => setFormData({ ...formData, willingToRelocate: !formData.willingToRelocate })}>
                Willing to relocate
              </Label>
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