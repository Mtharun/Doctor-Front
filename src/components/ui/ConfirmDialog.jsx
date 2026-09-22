// A lightweight confirmation modal used before destructive/important
// actions (cancelling an appointment, rejecting a request) so a stray
// click never silently changes something important.
export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-bold text-[#0F172A] mb-2">{title}</h3>
        <p className="text-sm text-[#64748B] mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-[#64748B] font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white font-semibold transition-all ${
              danger ? "bg-[#EF4444] hover:bg-[#DC2626]" : "bg-[#0EA5E9] hover:bg-[#0284C7]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
