import { useTranslation } from '../../utils/i18n';
export function FullPageLoader({ text = t('common.loading', 'ກຳລັງໂຫລດ...') }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, text }) {
  const { t } = useTranslation();
  return (
    <div className="card p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}
