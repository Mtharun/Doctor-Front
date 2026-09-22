import { Loader2 } from "lucide-react";

// Reused on every data-driven page while a fetch is in flight, so the
// user never sees a blank screen.
export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
      <Loader2 className="w-8 h-8 animate-spin text-[#0EA5E9] mb-3" />
      <p>{label}</p>
    </div>
  );
}
