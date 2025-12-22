import { useEffect, useState } from "react";
import { User, FileText, Building2, CheckCircle, Clock, XCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { engineerApi, StatusResponse } from "@/lib/engineer";

const steps = [
  { id: 1, title: "Profile" },
  { id: 2, title: "KYC" },
  { id: 3, title: "Bank" },
  { id: 4, title: "Status" },
];

type VerificationStatus = "pending" | "approved" | "rejected" | "completed";

interface StatusCardProps {
  title: string;
  icon: typeof User;
  status: VerificationStatus;
  details?: string;
}

const StatusCard = ({ title, icon: Icon, status, details }: StatusCardProps) => {
  const normalizedStatus = status === "completed" ? "approved" : status;
  
  const statusConfig = {
    pending: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: Clock,
      iconColor: "text-warning",
      label: "Under Review",
    },
    approved: {
      bg: "bg-success/10",
      border: "border-success/30",
      icon: CheckCircle,
      iconColor: "text-success",
      label: "Approved",
    },
    rejected: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      icon: XCircle,
      iconColor: "text-destructive",
      label: "Rejected",
    },
  };

  const config = statusConfig[normalizedStatus];
  const StatusIcon = config.icon;

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-xl p-5 transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shadow-sm">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {details && (
              <p className="text-xs text-muted-foreground mt-0.5">{details}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusIcon className={`h-4 w-4 ${config.iconColor}`} />
          <span className={`text-sm font-medium ${config.iconColor}`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
};

interface TimelineItem {
  step: number;
  title: string;
  status: VerificationStatus;
  timestamp?: string;
}

const Timeline = ({ items }: { items: TimelineItem[] }) => {
  return (
    <div className="relative pl-8 space-y-6">
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
      {items.map((item, index) => {
        const normalizedStatus = item.status === "completed" ? "approved" : item.status;
        return (
          <div key={item.step} className="relative animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div
              className={`absolute -left-5 w-4 h-4 rounded-full border-2 ${
                normalizedStatus === "approved"
                  ? "bg-success border-success"
                  : normalizedStatus === "rejected"
                  ? "bg-destructive border-destructive"
                  : "bg-warning border-warning"
              }`}
            />
            <div className="bg-card rounded-lg p-3 shadow-sm border border-border/50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-foreground">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.timestamp || "Pending"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface StatusScreenProps {
  rejectionReason?: string;
}

const StatusScreen = ({ rejectionReason }: StatusScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusData, setStatusData] = useState<StatusResponse | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await engineerApi.getStatus();
        setStatusData(data);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading status...</p>
        </div>
      </div>
    );
  }

  const profileStatus = statusData?.profile_status === "completed" ? "approved" : "pending";
  const kycStatus = statusData?.kyc_status || "pending";
  const bankStatus = statusData?.bank_status || "pending";
  const overallStatus = statusData?.overall_status || "pending_review";

  const allApproved = overallStatus === "verified";
  const anyRejected = overallStatus === "rejected";

  const timelineItems: TimelineItem[] = [
    { step: 1, title: "Profile Submitted", status: profileStatus, timestamp: profileStatus === "approved" ? "Completed" : undefined },
    { step: 2, title: "KYC Documents", status: kycStatus, timestamp: kycStatus !== "pending" ? "Submitted" : undefined },
    { step: 3, title: "Bank Verification", status: bankStatus, timestamp: bankStatus !== "pending" ? "Submitted" : undefined },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <ProgressIndicator steps={steps} currentStep={4} />

        <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Verification Status</h1>
              <p className="text-sm text-muted-foreground">Review your application status</p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="space-y-3 mb-8">
            <StatusCard
              title="Profile Status"
              icon={User}
              status={profileStatus}
              details="Personal information verified"
            />
            <StatusCard
              title="KYC Status"
              icon={FileText}
              status={kycStatus}
              details="Identity documents verified"
            />
            <StatusCard
              title="Bank Status"
              icon={Building2}
              status={bankStatus}
              details="Bank account verified"
            />
          </div>

          {/* Final Status Banner */}
          <div
            className={`rounded-xl p-6 text-center ${
              allApproved
                ? "bg-success/10 border border-success/30"
                : anyRejected
                ? "bg-destructive/10 border border-destructive/30"
                : "bg-warning/10 border border-warning/30"
            }`}
          >
            <div className="flex justify-center mb-3">
              {allApproved ? (
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              ) : anyRejected ? (
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-warning" />
                </div>
              )}
            </div>
            <h2
              className={`text-lg font-bold ${
                allApproved
                  ? "text-success"
                  : anyRejected
                  ? "text-destructive"
                  : "text-warning"
              }`}
            >
              {allApproved
                ? "✓ Fully Verified"
                : anyRejected
                ? "✗ Verification Rejected"
                : "⏳ Under Review"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {allApproved
                ? "Congratulations! You can now start accepting service requests."
                : anyRejected
                ? rejectionReason || "Please re-submit the rejected documents."
                : "Your verification is in progress. This usually takes 24-48 hours."}
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Verification Timeline
            </h3>
            <Timeline items={timelineItems} />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            {allApproved ? (
              <Button className="w-full h-12 text-base font-medium">
                Go to Dashboard
              </Button>
            ) : anyRejected ? (
              <Button className="w-full h-12 text-base font-medium">
                Re-submit Documents
              </Button>
            ) : (
              <Button disabled className="w-full h-12 text-base font-medium opacity-50">
                Please wait for verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusScreen;
