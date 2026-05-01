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
      pushToast(error.response?.data?.message || 'ບັນທຶກຂໍ້ມູນບໍ່ສຳເລັດ', 'error');
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
      pushToast(error.response?.data?.message || 'ລຶບບໍ່ສຳເລັດ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ຈັດການຫ້ອງ" action={<button className="btn-primary" onClick={() => { setForm(initialForm); setEditingId(''); setOpen(true); }}>ເພີ່ມຫ້ອງ</button>} />
      <div className="table-wrap">
        <table className="table-ui">
          <thead><tr><th>ຫ້ອງ</th><th>ອາຄານ</th><th>ຊັ້ນ</th><th>ຄ່າເຊົ່າ</th><th>ຄ່ານ້ຳ</th><th>ຄ່າໄຟ</th><th>ສະຖານະ</th><th>ຈັດການ</th></tr></thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border-t border-slate-100">
                <td>{room.roomNumber}</td><td>{room.building}</td><td>{room.floor}</td>
                <td>{fmtMoney(room.rentPrice)}</td><td>{fmtMoney(room.waterRate)}</td><td>{fmtMoney(room.electricRate)}</td>
                <td><StatusBadge value={room.status} /></td>
                <td><div className="flex gap-2"><button className="btn-outline py-2" onClick={() => onEdit(room)}>ແກ້ໄຂ</button><button className="btn-danger py-2" onClick={() => onDelete(room._id)}>ລຶບ</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} title={editingId ? 'ແກ້ໄຂຫ້ອງ' : 'ເພີ່ມຫ້ອງ'} onClose={() => setOpen(false)}>
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
              <option value="vacant">ວ່າງ</option><option value="occupied">ມີຄົນຢູ່</option><option value="maintenance">	ກຳລັງແປງ</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3"><button type="button" className="btn-outline" onClick={() => setOpen(false)}>ຍົກເລີກ</button><button type="submit" className="btn-primary">ບັນທຶກ</button></div>
        </form>
      </Modal>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
