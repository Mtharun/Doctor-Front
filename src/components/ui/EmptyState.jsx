export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-ink-50 rounded-xl border border-ink-200 border-dashed">
      {Icon && (
        <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center mb-4 border border-ink-200">
          <Icon className="w-7 h-7 text-brand-600" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink-900 mb-1">{title}</h3>
      {message && <p className="text-ink-500 max-w-sm mb-4 text-sm">{message}</p>}
      {action}
    </div>
  );
}
