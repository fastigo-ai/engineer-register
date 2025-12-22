import { useState, useRef } from "react";
import { Building2, Upload, Check, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import ProgressIndicator from "./ProgressIndicator";
import StatusBadge from "./StatusBadge";

const steps = [
  { id: 1, title: "Profile" },
  { id: 2, title: "KYC" },
  { id: 3, title: "Bank" },
  { id: 4, title: "Status" },
];

interface UploadedFile {
  name: string;
  preview: string;
  status: "pending" | "approved" | "rejected";
}

interface BankData {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  chequeImage: UploadedFile | null;
}

interface BankScreenProps {
  onComplete: (data: BankData) => void;
  onBack: () => void;
}

const BankScreen = ({ onComplete, onBack }: BankScreenProps) => {
  const [formData, setFormData] = useState<BankData>({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    chequeImage: null,
  });

  const chequeRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          chequeImage: {
            name: file.name,
            preview: reader.result as string,
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

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, chequeImage: null }));
  };

  const handleSubmit = () => {
    if (
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.ifscCode ||
      !formData.bankName
    ) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      toast({
        title: "Account Number Mismatch",
        description: "Account numbers do not match",
        variant: "destructive",
      });
      return;
    }
    if (!formData.chequeImage) {
      toast({
        title: "Document Required",
        description: "Please upload cancelled cheque or passbook",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Bank Details Submitted",
      description: "Your bank details are under review",
    });
    onComplete(formData);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator steps={steps} currentStep={3} />

        <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Bank Account Details</h1>
              <p className="text-sm text-muted-foreground">Step 3 of 4</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="holderName">Account Holder Name *</Label>
              <Input
                id="holderName"
                placeholder="As per bank records"
                value={formData.accountHolderName}
                onChange={(e) =>
                  setFormData({ ...formData, accountHolderName: e.target.value })
                }
                className="input-field"
              />
            </div>

            {/* Account Numbers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  className="input-field"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmAccount">Confirm Account Number *</Label>
                <Input
                  id="confirmAccount"
                  placeholder="Re-enter account number"
                  value={formData.confirmAccountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmAccountNumber: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            {/* IFSC & Bank Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ifsc">IFSC Code *</Label>
                <Input
                  id="ifsc"
                  placeholder="e.g., SBIN0001234"
                  value={formData.ifscCode}
                  onChange={(e) =>
                    setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })
                  }
                  className="input-field"
                  maxLength={11}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  placeholder="e.g., State Bank of India"
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            {/* Cheque Upload */}
            <div className="space-y-2 pt-4">
              <Label>Cancelled Cheque / Passbook Image *</Label>
              <input
                ref={chequeRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {formData.chequeImage ? (
                <div className="relative bg-muted/30 rounded-xl p-4 border border-border/50 animate-scale-in">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={formData.chequeImage.preview}
                        alt="Cheque"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {formData.chequeImage.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-xs text-success">Uploaded</span>
                      </div>
                      <StatusBadge status={formData.chequeImage.status} size="sm" />
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => chequeRef.current?.click()}
                  className="upload-zone w-full"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Click to upload
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Clear image of cancelled cheque or passbook
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1 h-12">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1 h-12 text-base font-medium">
                Submit Bank Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankScreen;
