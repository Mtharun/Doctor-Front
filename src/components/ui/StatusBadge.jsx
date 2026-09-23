const STYLES = {
  pending: "bg-warning-50 text-warning-600 border-warning-600/15",
  confirmed: "bg-success-50 text-success-600 border-success-600/15",
  completed: "bg-ink-100 text-ink-600 border-ink-300",
  cancelled: "bg-ink-100 text-ink-500 border-ink-300",
  rejected: "bg-danger-50 text-danger-600 border-danger-600/15",
  accepted: "bg-info-50 text-info-600 border-info-600/15",
  in_progress: "bg-info-50 text-info-600 border-info-600/15",
  resolved: "bg-success-50 text-success-600 border-success-600/15",
  critical: "bg-danger-600 text-white border-danger-600",
  high: "bg-warning-600 text-white border-warning-600",
  medium: "bg-warning-50 text-warning-600 border-warning-600/20",
};

function label(status) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STYLES[status] || "bg-ink-100 text-ink-600 border-ink-300"}`}>
      {label(status)}
    </span>
  );
}
