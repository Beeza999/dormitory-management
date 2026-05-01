import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';
import { fmtDate, fmtMoney, fmtMonthYear } from '../../utils/format';

const ຕົວເລກ = (value) => Number(value || 0);

const ສ້າງຟອມເລີ່ມຕົ້ນ = () => ({
  userId: '',
  roomId: '',
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  waterUnits: 0,
  electricUnits: 0,
  otherAmount: 0,
  dueDate: '',
  note: '',
  status: 'unpaid',

  rentAmount: 0,
  waterRate: 0,
  electricRate: 0,
  waterAmount: 0,
  electricAmount: 0,
  totalAmount: 0,
});

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(ສ້າງຟອມເລີ່ມຕົ້ນ());
  const { toast, pushToast, clearToast } = useToast();

  const loadData = async () => {
    try {
      const [billRes, tenantRes, roomRes] = await Promise.all([
        api.get('/bills'),
        api.get('/tenants'),
        api.get('/rooms'),
      ]);

      setBills(Array.isArray(billRes.data?.bills) ? billRes.data.bills : []);
      setTenants(Array.isArray(tenantRes.data?.tenants) ? tenantRes.data.tenants : []);
      setRooms(Array.isArray(roomRes.data?.rooms) ? roomRes.data.rooms : []);
    } catch (error) {
      pushToast(error.response?.data?.message || 'ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const ຄ່ານ້ຳ = ຕົວເລກ(form.waterUnits) * ຕົວເລກ(form.waterRate);
    const ຄ່າໄຟ = ຕົວເລກ(form.electricUnits) * ຕົວເລກ(form.electricRate);
    const ຍອດລວມ =
      ຕົວເລກ(form.rentAmount) +
      ຄ່ານ້ຳ +
      ຄ່າໄຟ +
      ຕົວເລກ(form.otherAmount);

    setForm((prev) => ({
      ...prev,
      waterAmount: ຄ່ານ້ຳ,
      electricAmount: ຄ່າໄຟ,
      totalAmount: ຍອດລວມ,
    }));
  }, [
    form.waterUnits,
    form.electricUnits,
    form.otherAmount,
    form.rentAmount,
    form.waterRate,
    form.electricRate,
  ]);

  const roomsAvailable = useMemo(() => {
    return rooms.filter((room) => room.status !== 'maintenance');
  }, [rooms]);

  const resetForm = () => {
    setEditingId('');
    setForm(ສ້າງຟອມເລີ່ມຕົ້ນ());
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const fillRoomData = (roomId, userId = form.userId) => {
    const room = rooms.find((item) => item._id === roomId);

    setForm((prev) => ({
      ...prev,
      userId,
      roomId,
      rentAmount: Number(room?.rentPrice || 0),
      waterRate: Number(room?.waterRate || 0),
      electricRate: Number(room?.electricRate || 0),
    }));
  };

  const onTenantChange = (userId) => {
    const tenant = tenants.find((item) => item._id === userId);
    const roomId = tenant?.roomId?._id || tenant?.roomId || '';
    const room = rooms.find((item) => item._id === roomId);

    setForm((prev) => ({
      ...prev,
      userId,
      roomId,
      rentAmount: Number(room?.rentPrice || 0),
      waterRate: Number(room?.waterRate || 0),
      electricRate: Number(room?.electricRate || 0),
    }));
  };

  const openEdit = (bill) => {
    const roomId = bill.roomId?._id || bill.roomId || '';
    const userId = bill.userId?._id || bill.userId || '';
    const room = rooms.find((item) => item._id === roomId);

    setEditingId(bill._id);
    setForm({
      userId,
      roomId,
      month: bill.month || '',
      year: bill.year || '',
      waterUnits: bill.waterUnits || 0,
      electricUnits: bill.electricUnits || 0,
      otherAmount: bill.otherAmount || 0,
      dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().slice(0, 10) : '',
      note: bill.note || '',
      status: bill.status || 'unpaid',

      rentAmount: Number(bill.rentAmount || room?.rentPrice || 0),
      waterRate: Number(room?.waterRate || 0),
      electricRate: Number(room?.electricRate || 0),
      waterAmount: Number(bill.waterAmount || 0),
      electricAmount: Number(bill.electricAmount || 0),
      totalAmount: Number(bill.totalAmount || 0),
    });

    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      userId: form.userId,
      roomId: form.roomId,
      month: ຕົວເລກ(form.month),
      year: ຕົວເລກ(form.year),
      waterUnits: ຕົວເລກ(form.waterUnits),
      electricUnits: ຕົວເລກ(form.electricUnits),
      otherAmount: ຕົວເລກ(form.otherAmount),
      dueDate: form.dueDate,
      note: form.note,
    };

    if (editingId) {
      payload.status = form.status;
    }

    try {
      if (editingId) {
        await api.put(`/bills/${editingId}`, payload);
        pushToast('ແກ້ໄຂບິນສຳເລັດ');
      } else {
        await api.post('/bills', payload);
        pushToast('ສ້າງບິນສຳເລັດ');
      }

      setOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || 'ບັນທຶກບິນບໍ່ສຳເລັດ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ຈັດການບິນ"
        subtitle="ສ້າງ ແລະ ແກ້ໄຂບິນພ້ອມຄຳນວນຄ່ານ້ຳຄ່າໄຟອັດຕະໂນມັດ"
        action={
          <button className="btn-primary" onClick={openCreate}>
            ສ້າງບິນໃໝ່
          </button>
        }
      />

      <div className="table-wrap">
        <table className="table-ui">
          <thead>
            <tr>
              <th>ຜູ້ເຊົ່າ</th>
              <th>ຫ້ອງ</th>
              <th>ເດືອນ/ປີ</th>
              <th>ຍອດລວມ</th>
              <th>ຄົບກຳນົດ</th>
              <th>ສະຖານະ</th>
              <th>ຈັດການ</th>
            </tr>
          </thead>

          <tbody>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <tr key={bill._id} className="border-t border-slate-100">
                  <td>{bill.userId?.name || '-'}</td>
                  <td>
                    {bill.roomId ? `${bill.roomId.building}-${bill.roomId.roomNumber}` : '-'}
                  </td>
                  <td>{fmtMonthYear(bill.month, bill.year)}</td>
                  <td>{fmtMoney(bill.totalAmount)}</td>
                  <td>{fmtDate(bill.dueDate)}</td>
                  <td>
                    <StatusBadge value={bill.status} />
                  </td>
                  <td>
                    {bill.status === 'paid' ? (
                      <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                        ແກ້ໄຂບໍ່ໄດ້
                      </span>
                    ) : (
                      <button className="btn-outline py-2" onClick={() => openEdit(bill)}>
                        ແກ້ໄຂ
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-slate-100">
                <td colSpan="7" className="py-8 text-center text-sm text-slate-500">
                  ບໍ່ມີຂໍ້ມູນບິນ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        title={editingId ? 'ແກ້ໄຂບິນ' : 'ສ້າງບິນໃໝ່'}
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">ຜູ້ເຊົ່າ</label>
            <select
              className="input"
              value={form.userId}
              onChange={(e) => onTenantChange(e.target.value)}
              required
            >
              <option value="">ເລືອກຜູ້ເຊົ່າ</option>
              {tenants.map((tenant) => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">ຫ້ອງ</label>
            <select
              className="input"
              value={form.roomId}
              onChange={(e) => fillRoomData(e.target.value)}
              required
            >
              <option value="">ເລືອກຫ້ອງ</option>
              {roomsAvailable.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.building}-{room.roomNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">ເດືອນ</label>
            <input
              className="input"
              type="number"
              min="1"
              max="12"
              value={form.month}
              onChange={(e) => setForm((prev) => ({ ...prev, month: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">ປີ</label>
            <input
              className="input"
              type="number"
              value={form.year}
              onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">ຄ່າຫ້ອງ</label>
            <input className="input bg-slate-50" type="number" value={form.rentAmount} readOnly />
            <p className="mt-1 text-xs text-slate-500">ດຶງຈາກຂໍ້ມູນຫ້ອງອັດຕະໂນມັດ</p>
          </div>

          <div>
            <label className="label">ວັນຄົບກຳນົດ</label>
            <input
              className="input"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">ໜ່ວຍນ້ຳ</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.waterUnits}
              onChange={(e) => setForm((prev) => ({ ...prev, waterUnits: e.target.value }))}
            />
            <p className="mt-1 text-xs text-slate-500">
              ຄ່ານ້ຳຕໍ່ໜ່ວຍ {fmtMoney(form.waterRate)}
            </p>
          </div>

          <div>
            <label className="label">ຄ່ານ້ຳ</label>
            <input className="input bg-slate-50" type="number" value={form.waterAmount} readOnly />
          </div>

          <div>
            <label className="label">ໜ່ວຍໄຟ</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.electricUnits}
              onChange={(e) => setForm((prev) => ({ ...prev, electricUnits: e.target.value }))}
            />
            <p className="mt-1 text-xs text-slate-500">
              ຄ່າໄຟຕໍ່ໜ່ວຍ {fmtMoney(form.electricRate)}
            </p>
          </div>

          <div>
            <label className="label">ຄ່າໄຟ</label>
            <input
              className="input bg-slate-50"
              type="number"
              value={form.electricAmount}
              readOnly
            />
          </div>

          <div>
            <label className="label">ຄ່າອື່ນ</label>
            <input
              className="input"
              type="number"
              min="0"
              value={form.otherAmount}
              onChange={(e) => setForm((prev) => ({ ...prev, otherAmount: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">ຍອດລວມ</label>
            <input className="input bg-slate-50" type="number" value={form.totalAmount} readOnly />
          </div>

          {editingId ? (
            <div>
              <label className="label">ສະຖານະ</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="unpaid">unpaid</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
              </select>
            </div>
          ) : (
            <div />
          )}

          <div className="md:col-span-2">
            <label className="label">ໝາຍເຫດ</label>
            <textarea
              className="input min-h-[110px]"
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              placeholder="ລາຍລະອຽດເພີ່ມເຕີມ"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              ຍົກເລີກ
            </button>

            <button type="submit" className="btn-primary">
              {editingId ? 'ບັນທຶກການແກ້ໄຂ' : 'ສ້າງບິນ'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}