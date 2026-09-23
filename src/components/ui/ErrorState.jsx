import { AlertTriangle, RotateCcw } from "lucide-react";

// Shown whenever a data fetch fails, with a retry button so the user
// isn't stuck looking at a dead page after a flaky network request.
export default function ErrorState({ message = "Unable to load this data.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-danger-50 rounded-xl border border-danger-600/15">
      <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center mb-4 border border-danger-600/15">
        <AlertTriangle className="w-7 h-7 text-danger-600" />
      </div>
      <h3 className="text-lg font-semibold text-ink-900 mb-1">Something went wrong</h3>
      <p className="text-ink-600 max-w-sm mb-4 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-danger btn-sm">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
