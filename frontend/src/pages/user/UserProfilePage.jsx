import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';

export default function UserProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const { toast, pushToast, clearToast } = useToast();

  useEffect(() => {
    setForm({ name: user?.name || '', phone: user?.phone || '' });
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.put('/user/profile', form);
      updateUser(data.user);
      pushToast('ອັບເດດໂປຣໄຟລ໌ສຳເລັດ');
    } catch (error) {
      pushToast(error.response?.data?.message || 'ອັບເດດບໍ່ສຳເລັດ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ໂປຣໄຟລ໌" subtitle="ດຶງຂໍ້ມູນຈາກ auth ແລະ ອັບເດດຜ່ານ backend" />
      <form onSubmit={submit} className="card max-w-2xl p-6 space-y-4">
        <div><label className="label">ຊື່</label><input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required /></div>
        <div><label className="label">ອີເມວ</label><input className="input bg-slate-50" value={user?.email || ''} disabled /></div>
        <div><label className="label">ເບີໂທ</label><input className="input" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
        <button className="btn-primary" type="submit">ບັນທຶກ</button>
      </form>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
