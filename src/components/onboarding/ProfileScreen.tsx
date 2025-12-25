import { useState } from "react";
import { User, Phone, Mail, MapPin, Wrench, Calendar } from "lucide-react";
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
    if (!formData.fullName || !formData.dob || !formData.gender) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all required fields",
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
        description:
          error instanceof Error ? error.message : "Failed to save profile",
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

        <div className="glass-card rounded-2xl p-6 md:p-8 mt-6">
          <h1 className="text-xl font-bold mb-6">Complete Your Profile</h1>

          {/* Full Name */}
          <Label>Full Name *</Label>
          <Input
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />

          {/* DOB */}
          <Label className="mt-4">Date of Birth *</Label>
          <Input
            type="date"
            value={formData.dob}
            onChange={(e) =>
              setFormData({ ...formData, dob: e.target.value })
            }
          />

          {/* Gender */}
          <div className="flex gap-2 mt-4">
            {genderOptions.map((g) => (
              <button
                key={g}
                type="button"
                className={`chip ${
                  formData.gender === g ? "chip-selected" : "chip-default"
                }`}
                onClick={() => setFormData({ ...formData, gender: g })}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Skill Category */}
          <div className="mt-6">
            <Label>Skill Category *</Label>
            {Object.entries(skillCategories).map(([group, skills]) => (
              <div key={group}>
                <p className="text-sm mt-3">{group}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkillCategory(skill)}
                      className={`chip ${
                        formData.skillCategory.includes(skill)
                          ? "chip-selected"
                          : "chip-default"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <Button className="w-full mt-6" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
