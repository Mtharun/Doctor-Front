export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#0EA5E9]/10 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-[#0EA5E9]" />
        </div>
      )}
      <h3 className="text-lg font-bold text-[#0F172A] mb-1">{title}</h3>
      {message && <p className="text-[#64748B] max-w-sm mb-4">{message}</p>}
      {action}
    </div>
  );
}
