import { useTranslation } from '../../utils/i18n';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import { fmtDate } from '../../utils/format';

export default function UserAnnouncementsPage() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/announcements').then((response) => {
      const nextItems = Array.isArray(response.data?.announcements) ? response.data.announcements : [];
      setAnnouncements(nextItems);
    }).catch(() => setAnnouncements([]));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.announcements', 'ປະກາດ')} subtitle={t('k_0022', 'ຂ່າວສານຈາກ admin')} />
      <div className="space-y-4">
        {announcements.length > 0 ? announcements.map((item) => (
          <div key={item._id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600">{item.message}</p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.targetType || 'all'}</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">{fmtDate(item.createdAt)} • {item.createdBy?.name || 'admin'}</p>
          </div>
        )) : <div className="card p-5 text-sm text-slate-500">{t('k_0069', 'ບໍ່ມີປະກາດ')}</div>}
      </div>
    </div>
  );
}
