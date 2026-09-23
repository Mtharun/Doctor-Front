const STYLES = {
  pending: "bg-[#F59E0B]/10 text-[#F59E0B]",
  confirmed: "bg-[#22C55E]/10 text-[#22C55E]",
  completed: "bg-[#64748B]/10 text-[#64748B]",
  cancelled: "bg-[#94A3B8]/10 text-[#94A3B8]",
  rejected: "bg-[#EF4444]/10 text-[#EF4444]",
  accepted: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  in_progress: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
  resolved: "bg-[#22C55E]/10 text-[#22C55E]",
  critical: "bg-[#EF4444] text-white",
  high: "bg-[#F59E0B] text-white",
  medium: "bg-[#F59E0B]/60 text-white",
};

function label(status) {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ring-1 ring-inset ring-current/10 ${
        STYLES[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {label(status)}
    </span>
  );
}
