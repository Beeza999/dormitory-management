import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api, { getAssetUrl } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';
import { fmtDate, fmtMoney } from '../../utils/format';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);
  const { toast, pushToast, clearToast } = useToast();

  const loadPayments = async () => {
    const { data } = await api.get('/payments');
    setPayments(data.payments || []);
  };

  useEffect(() => { loadPayments(); }, []);

  const review = async (id, type) => {
    try {
      await api.patch(`/payments/${id}/${type}`);
      pushToast(type === 'approve' ? 'ອະນຸມັດແລ້ວ' : 'ປະຕິເສດແລ້ວ');
      loadPayments();
    } catch (error) {
      pushToast(error.response?.data?.message || 'ອັບເດດບໍ່ສຳເລັດ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ກວດສອບການຈ່າຍ" subtitle="ກວດໃບບີນການຈ່າຍເງິນ, ອະນຸມັດ ຫຼື ປະຕິເສດການຈ່າຍ" />
      <div className="table-wrap">
        <table className="table-ui">
          <thead><tr><th>ຜູ້ເຊົ່າ</th><th>ບິນ</th><th>ຍອດ</th><th>ວັນສົ່ງ</th><th>ສະຖານະ</th><th>ຈັດການ</th></tr></thead>
          <tbody>{payments.map((payment) => <tr key={payment._id} className="border-t border-slate-100"><td>{payment.userId?.name || '-'}</td><td>{payment.billId ? `${payment.billId.month}/${payment.billId.year}` : '-'}</td><td>{fmtMoney(payment.amount)}</td><td>{fmtDate(payment.paidAt)}</td><td><StatusBadge value={payment.status} /></td><td><div className="flex flex-wrap gap-2"><button className="btn-outline py-2" onClick={() => setSelected(payment)}>ເບິ່ງໃບບີນການຈ່າຍເງິນ</button><button className="btn-secondary py-2" onClick={() => review(payment._id, 'approve')}>ອະນຸມັດ</button><button className="btn-danger py-2" onClick={() => review(payment._id, 'reject')}>ປະຕິເສດ</button></div></td></tr>)}</tbody>
        </table>
      </div>
      <Modal open={!!selected} title="ຮູບໃບບີນການຈ່າຍເງິນ" onClose={() => setSelected(null)}>
        {selected ? <div className="space-y-4"><img src={getAssetUrl(selected.slipImage)} alt="ຮູບໃບບີນການຈ່າຍເງິນ" className="max-h-[70vh] w-full rounded-3xl object-contain bg-slate-100" /><div className="grid gap-2 text-sm text-slate-600"><p>ຜູ້ສົ່ງ: {selected.userId?.name}</p><p>ຍອດເງິນ: {fmtMoney(selected.amount)}</p><p>ສະຖານະ: {selected.status}</p></div></div> : null}
      </Modal>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
