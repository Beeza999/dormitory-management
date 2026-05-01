import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';
import { fmtDate } from '../../utils/format';

const ຄ່າເລີ່ມຕົ້ນ = { title: '', message: '', targetType: 'all', targetId: '' };

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState(ຄ່າເລີ່ມຕົ້ນ);
  const { toast, pushToast, clearToast } = useToast();

  const loadAnnouncements = async () => {
    const { data } = await api.get('/announcements');
    setAnnouncements(data.announcements || []);
  };

  useEffect(() => {
    loadAnnouncements();
    Promise.all([api.get('/rooms'), api.get('/tenants')]).then(([roomRes, tenantRes]) => {
      setRooms(roomRes.data.rooms || []);
      setTenants(tenantRes.data.tenants || []);
    });
  }, []);

  const ລາຍການເປົ້າໝາຍ = useMemo(() => {
    if (form.targetType === 'room') {
      return rooms.map((room) => ({ value: room._id, label: `${room.building}-${room.roomNumber}` }));
    }
    if (form.targetType === 'user') {
      return tenants.map((tenant) => ({ value: tenant._id, label: tenant.name }));
    }
    return [];
  }, [form.targetType, rooms, tenants]);

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      targetType: form.targetType,
    };

    if (form.targetType !== 'all') {
      payload.targetId = form.targetId || null;
    }

    try {
      await api.post('/announcements', payload);
      pushToast('ສ້າງປະກາດສຳເລັດ');
      setForm(ຄ່າເລີ່ມຕົ້ນ);
      loadAnnouncements();
    } catch (error) {
      pushToast(error.response?.data?.message || 'ສ້າງປະກາດບໍ່ສຳເລັດ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ປະກາດ" subtitle="ປະກາດໄປຫາທຸກຄົນ, ຫ້ອງ, ຫຼື ຜູ້ເຊົ່າລາຍຄົນ" />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={submit} className="card p-6 space-y-4">
          <div>
            <label className="label">ຫົວຂໍ້</label>
            <input className="input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">ເນື້ອໃນ</label>
            <textarea className="input min-h-32" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
          </div>
          <div>
            <label className="label">ກຸ່ມເປົ້າໝາຍ</label>
            <select className="input" value={form.targetType} onChange={(e) => setForm((p) => ({ ...p, targetType: e.target.value, targetId: '' }))}>
              <option value="all">ຜູ້ເຊົ່າທັງໝົດ</option>
              <option value="room">ຫ້ອງສະເພາະ</option>
              <option value="user">ຜູ້ເຊົ່າລາຍຄົນ</option>
            </select>
          </div>

          {form.targetType !== 'all' ? (
            <div>
              <label className="label">ເລືອກເປົ້າໝາຍ</label>
              <select className="input" value={form.targetId} onChange={(e) => setForm((p) => ({ ...p, targetId: e.target.value }))} required>
                <option value="">ເລືອກລາຍການ</option>
                {ລາຍການເປົ້າໝາຍ.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
          ) : null}

          <button type="submit" className="btn-primary w-full">ສົ່ງປະກາດ</button>
        </form>

        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item._id} className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <span className="text-xs text-slate-400">{fmtDate(item.createdAt)}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{item.message}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>ສ້າງໂດຍ: {item.createdBy?.name || '-'}</span>
                <span>•</span>
                <span>
                  {item.targetType === 'all' ? 'ສົ່ງເຖິງທຸກຄົນ' : item.targetType === 'room' ? 'ສົ່ງເຖິງຫ້ອງສະເພາະ' : 'ສົ່ງເຖິງຜູ້ເຊົ່າສະເພາະ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
