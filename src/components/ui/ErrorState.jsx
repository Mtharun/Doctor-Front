import { AlertTriangle, RotateCcw } from "lucide-react";

// Shown whenever a data fetch fails, with a retry button so the user
// isn't stuck looking at a dead page after a flaky network request.
export default function ErrorState({ message = "Unable to load this data.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-[#FEF2F2] rounded-3xl border border-[#EF4444]/20">
      <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
      </div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-1">Something went wrong</h3>
      <p className="text-[#64748B] max-w-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EF4444] text-white font-semibold hover:bg-[#DC2626] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
