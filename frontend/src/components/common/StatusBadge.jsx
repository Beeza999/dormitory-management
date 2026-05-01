import { statusLabel } from '../../utils/format';

const styles = {
  unpaid: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  vacant: 'bg-sky-100 text-sky-700',
  occupied: 'bg-violet-100 text-violet-700',
  maintenance: 'bg-orange-100 text-orange-700',
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[value] || 'bg-slate-100 text-slate-700'}`}>
      {statusLabel(value)}
    </span>
  );
}
