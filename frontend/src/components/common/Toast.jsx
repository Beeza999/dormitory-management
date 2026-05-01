export default function Toast({ toast, onClose }) {
  if (!toast?.show) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-soft ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-white'}`}>
        <div className="flex items-center gap-3">
          <span>{toast.message}</span>
          <button type="button" onClick={onClose} className="text-white/80">✕</button>
        </div>
      </div>
    </div>
  );
}
