import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';
import { fmtDate } from '../../utils/format';

const ຄ່າເລີ່ມຕົ້ນ = {
  name: '',
  email: '',
  password: '123456',
  phone: '',
  roomId: '',
  startDate: '',
};

export default function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ຄ່າເລີ່ມຕົ້ນ);
  const [editingId, setEditingId] = useState('');
  const { toast, pushToast, clearToast } = useToast();

  const loadData = async () => {
    try {
      const [{ data: tenantData }, { data: roomData }] = await Promise.all([
        api.get('/tenants'),
        api.get('/rooms'),
      ]);

      setTenants(tenantData.tenants || []);
      setRooms(
        (roomData.rooms || []).filter(
          (room) => room.status === 'vacant' || room.tenantId?._id === editingId,
        ),
      );
    } catch (error) {
      pushToast(error.response?.data?.message || 'ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, [editingId]);

  const resetForm = () => {
    setForm(ຄ່າເລີ່ມຕົ້ນ);
    setEditingId('');
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        const payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          roomId: form.roomId,
          startDate: form.startDate,
        };

        if (form.password && form.password.trim()) {
          payload.password = form.password.trim();
        }

        await api.put(`/tenants/${editingId}`, payload);
        pushToast('ອັບເດດຜູ້ເຊົ່າສຳເລັດ');
      } else {
        await api.post('/tenants', form);
        pushToast('ເພີ່ມຜູ້ເຊົ່າສຳເລັດ');
      }

      setOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || 'ບັນທຶກບໍ່ສຳເລັດ', 'error');
    }
  };

  const onEdit = (tenant) => {
    setEditingId(tenant._id);
    setForm({
      name: tenant.name || '',
      email: tenant.email || '',
      password: '',
      phone: tenant.phone || '',
      roomId: tenant.roomId?._id || '',
      startDate: tenant.startDate
        ? new Date(tenant.startDate).toISOString().slice(0, 10)
        : '',
    });
    setOpen(true);
  };

  const onToggleStatus = async (tenant) => {
    const isActive = tenant.isActive !== false;
    const confirmMessage = isActive
      ? 'ຕ້ອງການປິດການໃຊ້ງານຜູ້ເຊົ່ານີ້ບໍ?'
      : 'ຕ້ອງການເປີດການໃຊ້ງານຜູ້ເຊົ່ານີ້ບໍ?';

    if (!window.confirm(confirmMessage)) return;

    try {
      const { data } = await api.patch(`/tenants/${tenant._id}/toggle-status`);
      pushToast(
        data?.message ||
          (isActive ? 'ປິດການໃຊ້ງານສຳເລັດ' : 'ເປີດການໃຊ້ງານສຳເລັດ'),
      );
      loadData();
    } catch (error) {
      pushToast(error.response?.data?.message || 'ລົ້ມເຫຼວ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ຈັດການຜູ້ເຊົ່າ"
        subtitle="ສ້າງ, ແກ້ໄຂ, ແລະ ກຳນົດຫ້ອງພັກ"
        action={
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            ເພີ່ມຜູ້ເຊົ່າ
          </button>
        }
      />

      <div className="table-wrap">
        <table className="table-ui">
          <thead>
            <tr>
              <th>ຊື່</th>
              <th>ອີເມວ</th>
              <th>ເບີໂທ</th>
              <th>ຫ້ອງ</th>
              <th>ເລີ່ມພັກ</th>
              <th>ສະຖານະ</th>
              <th>ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length > 0 ? (
              tenants.map((tenant) => {
                const isActive = tenant.isActive !== false;

                return (
                  <tr key={tenant._id} className="border-t border-slate-100">
                    <td>{tenant.name}</td>
                    <td>{tenant.email}</td>
                    <td>{tenant.phone || '-'}</td>
                    <td>
                      {tenant.roomId
                        ? `${tenant.roomId.building}-${tenant.roomId.roomNumber}`
                        : '-'}
                    </td>
                    <td>{fmtDate(tenant.startDate)}</td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isActive ? 'ກຳລັງໃຊ້ງານ' : 'ຖືກປິດ'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn-outline py-2"
                          onClick={() => onEdit(tenant)}
                        >
                          ແກ້ໄຂ
                        </button>
                        <button
                          className={isActive ? 'btn-danger py-2' : 'btn-primary py-2'}
                          onClick={() => onToggleStatus(tenant)}
                        >
                          {isActive ? 'ປິດໃຊ້ງານ' : 'ເປີດໃຊ້ງານ'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-slate-100">
                <td colSpan="7" className="py-8 text-center text-sm text-slate-500">
                  ບໍ່ມີຂໍ້ມູນຜູ້ເຊົ່າ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingId ? 'ແກ້ໄຂຜູ້ເຊົ່າ' : 'ເພີ່ມຜູ້ເຊົ່າ'}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">ຊື່</label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">ອີເມວ</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="label">ເບີໂທ</label>
            <input
              className="input"
              type="text"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">ວັນເລີ່ມພັກ</label>
            <input
              className="input"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          {!editingId ? (
            <div>
              <label className="label">ລະຫັດຜ່ານ</label>
              <input
                className="input"
                type="text"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
          ) : null}

          <div>
            <label className="label">ຫ້ອງ</label>
            <select
              className="input"
              value={form.roomId}
              onChange={(e) => setForm((prev) => ({ ...prev, roomId: e.target.value }))}
            >
              <option value="">ບໍ່ໄດ້ກຳນົດ</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.building}-{room.roomNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
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
              ບັນທຶກ
            </button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}