export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="card w-full max-w-2xl p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          <button type="button" onClick={onClose} className="btn-outline px-3 py-2">ປິດ</button>
        </div>
        {children}
      </div>
    </div>
  );
}
