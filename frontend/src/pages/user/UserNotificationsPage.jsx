import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';
import { fmtDate } from '../../utils/format';

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const { toast, pushToast, clearToast } = useToast();

  const load = async () => {
    try {
      const { data } = await api.get('/user/notifications');
      const nextItems = Array.isArray(data?.notifications) ? data.notifications : [];
      setNotifications(nextItems);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/user/notifications/${id}/read`);
      pushToast('ອ່ານແລ້ວ');
      load();
    } catch (error) {
      pushToast(error.response?.data?.message || 'ລົ້ມເຫຼວ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ແຈ້ງເຕືອນ" subtitle="ເບິ່ງ ແລະ ກົດອ່ານແລ້ວ" />
      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((item) => (
          <div key={item._id} className="card p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                <p className="mt-2 text-xs text-slate-400">{fmtDate(item.createdAt)}</p>
              </div>
              {!item.isRead ? <button className="btn-primary" onClick={() => markRead(item._id)}>ອ່ານແລ້ວ</button> : <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">ອ່ານແລ້ວ</span>}
            </div>
          </div>
        )) : <div className="card p-5 text-sm text-slate-500">ບໍ່ມີແຈ້ງເຕືອນ</div>}
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
