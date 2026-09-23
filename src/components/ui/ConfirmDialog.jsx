// A lightweight confirmation modal used before destructive/important
// actions (cancelling an appointment, rejecting a request) so a stray
// click never silently changes something important.
export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink-900/45" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-ink-200 p-6">
        <h3 className="text-lg font-semibold text-ink-900 mb-2">{title}</h3>
        <p className="text-sm text-ink-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-outline flex-1">
            Cancel
          </button>
          <button onClick={onConfirm} className={`btn flex-1 ${danger ? "btn-danger" : "btn-primary"}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
