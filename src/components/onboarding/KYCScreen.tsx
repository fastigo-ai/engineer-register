import { useState, useRef } from "react";
import { FileText, Upload, Check, X, Camera, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ProgressIndicator from "./ProgressIndicator";
import StatusBadge from "./StatusBadge";
import { engineerApi } from "@/lib/engineer";

const steps = [
  { id: 1, title: "Profile" },
  { id: 2, title: "KYC" },
  { id: 3, title: "Bank" },
  { id: 4, title: "Status" },
];

interface UploadedFile {
  name: string;
  preview: string;
  file: File;
  status: "pending" | "approved" | "rejected";
}

interface KYCData {
  aadhaarNumber: string;
  panNumber: string;
  profilePhoto: UploadedFile | null;
  addressProof: UploadedFile | null;
}

interface KYCScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const KYCScreen = ({ onComplete, onBack }: KYCScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<KYCData>({
    aadhaarNumber: "",
    panNumber: "",
    profilePhoto: null,
    addressProof: null,
  });

  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const addressProofRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profilePhoto" | "addressProof"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: {
            name: file.name,
            preview: reader.result as string,
            file: file,
            status: "pending" as const,
          },
        }));
        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field: "profilePhoto" | "addressProof") => {
    setFormData((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async () => {
    if (!formData.aadhaarNumber || !formData.panNumber) {
      toast({
        title: "Incomplete Form",
        description: "Please enter Aadhaar and PAN numbers",
        variant: "destructive",
      });
      return;
    }
    if (!formData.profilePhoto || !formData.addressProof) {
      toast({
        title: "Documents Required",
        description: "Please upload all required documents",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await engineerApi.uploadKyc(
        formData.aadhaarNumber,
        formData.panNumber,
        "address_proof",
        formData.addressProof.file,
        formData.profilePhoto.file
      );
      toast({
        title: "KYC Submitted",
        description: "Your documents are under review",
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit KYC",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const UploadZone = ({
    label,
    icon: Icon,
    file,
    inputRef,
    field,
  }: {
    label: string;
    icon: typeof Camera;
    file: UploadedFile | null;
    inputRef: React.RefObject<HTMLInputElement>;
    field: "profilePhoto" | "addressProof";
  }) => (
    <div className="space-y-2">
      <Label>{label} *</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, field)}
        className="hidden"
      />
      {file ? (
        <div className="relative bg-muted/30 rounded-xl p-4 border border-border/50 animate-scale-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img
                src={file.preview}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {file.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Check className="h-4 w-4 text-success" />
                <span className="text-xs text-success">Uploaded</span>
              </div>
              <StatusBadge status={file.status} size="sm" />
            </div>
            <button
              onClick={() => removeFile(field)}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-destructive" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="upload-zone w-full"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator steps={steps} currentStep={2} />

        <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">KYC Verification</h1>
              <p className="text-sm text-muted-foreground">Step 2 of 4</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* ID Numbers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar / ID Number *</Label>
                <Input
                  id="aadhaar"
                  placeholder="Enter 12-digit Aadhaar"
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, aadhaarNumber: e.target.value })
                  }
                  className="input-field"
                  maxLength={12}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number *</Label>
                <Input
                  id="pan"
                  placeholder="Enter PAN (e.g., ABCDE1234F)"
                  value={formData.panNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })
                  }
                  className="input-field"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Document Uploads */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <UploadZone
                label="Profile Photo"
                icon={Camera}
                file={formData.profilePhoto}
                inputRef={profilePhotoRef}
                field="profilePhoto"
              />
              <UploadZone
                label="Address Proof"
                icon={Image}
                file={formData.addressProof}
                inputRef={addressProofRef}
                field="addressProof"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1 h-12">
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="flex-1 h-12 text-base font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit KYC"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCScreen;
