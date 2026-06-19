import { useTranslation } from '../../utils/i18n';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';
import { fmtMoney } from '../../utils/format';

const initialForm = { roomNumber: '', building: 'A', floor: 1, rentPrice: '', waterRate: '', electricRate: '', status: 'vacant' };

export default function RoomsPage() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const { toast, pushToast, clearToast } = useToast();

  const loadRooms = async () => {
    const { data } = await api.get('/rooms');
    setRooms(data.rooms || []);
  };

  useEffect(() => { loadRooms(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/rooms/${editingId}`, form);
        pushToast('ອັບເດດຫ້ອງສຳເລັດ');
      } else {
        await api.post('/rooms', form);
        pushToast('ເພີ່ມຫ້ອງສຳເລັດ');
      }
      setOpen(false);
      setForm(initialForm);
      setEditingId('');
      loadRooms();
    } catch (error) {
      pushToast(error.response?.data?.message || t('k_0057', 'ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ'), 'error');
    }
  };

  const onEdit = (room) => {
    setEditingId(room._id);
    setForm({
      roomNumber: room.roomNumber,
      building: room.building,
      floor: room.floor,
      rentPrice: room.rentPrice,
      waterRate: room.waterRate,
      electricRate: room.electricRate,
      status: room.status,
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm('ຕ້ອງການລຶບຫ້ອງນີ້ບໍ?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      pushToast('ລຶບຫ້ອງສຳເລັດ');
      loadRooms();
    } catch (error) {
      pushToast(error.response?.data?.message || t('k_0095', 'ລຶບບໍ່ສຳເລັດ'), 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('k_0036', 'ຈັດການຫ້ອງ')} action={<button className="btn-primary" onClick={() => { setForm(initialForm); setEditingId(''); setOpen(true); }}>{t('k_0148', 'ເພີ່ມຫ້ອງ')}</button>} />
      <div className="table-wrap">
        <table className="table-ui">
          <thead><tr><th>{t('nav.rooms', 'ຫ້ອງ')}</th><th>{t('k_0132', 'ອາຄານ')}</th><th>{t('k_0040', 'ຊັ້ນ')}</th><th>{t('k_0029', 'ຄ່າເຊົ່າ')}</th><th>{t('k_0025', 'ຄ່ານ້ຳ')}</th><th>{t('k_0030', 'ຄ່າໄຟ')}</th><th>{t('k_0103', 'ສະຖານະ')}</th><th>{t('k_0033', 'ຈັດການ')}</th></tr></thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border-t border-slate-100">
                <td>{room.roomNumber}</td><td>{room.building}</td><td>{room.floor}</td>
                <td>{fmtMoney(room.rentPrice)}</td><td>{fmtMoney(room.waterRate)}</td><td>{fmtMoney(room.electricRate)}</td>
                <td><StatusBadge value={room.status} /></td>
                <td><div className="flex gap-2"><button className="btn-outline py-2" onClick={() => onEdit(room)}>{t('k_0159', 'ແກ້ໄຂ')}</button><button className="btn-danger py-2" onClick={() => onDelete(room._id)}>{t('k_0094', 'ລຶບ')}</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} title={editingId ? t('k_0164', 'ແກ້ໄຂຫ້ອງ') : t('k_0148', 'ເພີ່ມຫ້ອງ')} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {['roomNumber', 'building', 'floor', 'rentPrice', 'waterRate', 'electricRate'].map((name) => (
            <div key={name}>
              <label className="label">{name}</label>
              <input className="input" type={['floor','rentPrice','waterRate','electricRate'].includes(name) ? 'number' : 'text'} value={form[name]} onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))} required={['roomNumber', 'rentPrice'].includes(name)} />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="label">status</label>
            <select className="input" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
              <option value="vacant">{t('k_0102', 'ວ່າງ')}</option><option value="occupied">{t('k_0090', 'ມີຄົນຢູ່')}</option><option value="maintenance">{t('k_0015', 'ກຳລັງແປງ')}</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3"><button type="button" className="btn-outline" onClick={() => setOpen(false)}>{t('k_0049', 'ຍົກເລີກ')}</button><button type="submit" className="btn-primary">{t('k_0055', 'ບັນທຶກ')}</button></div>
        </form>
      </Modal>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
