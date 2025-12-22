import { Check, Clock, X } from "lucide-react";

type Status = "pending" | "approved" | "rejected";

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "status-badge status-pending",
    },
    approved: {
      label: "Approved",
      icon: Check,
      className: "status-badge status-approved",
    },
    rejected: {
      label: "Rejected",
      icon: X,
      className: "status-badge status-rejected",
    },
  };

  const { label, icon: Icon, className } = config[status];
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span className={className}>
      <Icon className={iconSize} />
      {label}
    </span>
  );
};

export default StatusBadge;
