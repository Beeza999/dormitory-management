import { useTranslation } from '../../utils/i18n';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api, { getAssetUrl } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';
import { fmtDate, fmtMoney } from '../../utils/format';

export default function AdminPaymentsPage() {
  const { t } = useTranslation();
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
      pushToast(type === 'approve' ? 'ອະນຸມັດແລ້ວ' : t('k_0078', 'ປະຕິເສດແລ້ວ'));
      loadPayments();
    } catch (error) {
      pushToast(error.response?.data?.message || t('k_0126', 'ອັບເດດບໍ່ສຳເລັດ'), 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('k_0010', 'ກວດສອບການຈ່າຍ')} subtitle={t('k_0011', 'ກວດໃບບີນການຈ່າຍເງິນ, ອະນຸມັດ ຫຼື ປະຕິເສດການຈ່າຍ')} />
      <div className="table-wrap">
        <table className="table-ui">
          <thead><tr><th>{t('nav.tenants', 'ຜູ້ເຊົ່າ')}</th><th>{t('nav.billing', 'ບິນ')}</th><th>{t('k_0043', 'ຍອດ')}</th><th>{t('k_0100', 'ວັນສົ່ງ')}</th><th>{t('k_0103', 'ສະຖານະ')}</th><th>{t('k_0033', 'ຈັດການ')}</th></tr></thead>
          <tbody>{payments.map((payment) => <tr key={payment._id} className="border-t border-slate-100"><td>{payment.userId?.name || '-'}</td><td>{payment.billId ? `${payment.billId.month}/${payment.billId.year}` : '-'}</td><td>{fmtMoney(payment.amount)}</td><td>{fmtDate(payment.paidAt)}</td><td><StatusBadge value={payment.status} /></td><td><div className="flex flex-wrap gap-2"><button className="btn-outline py-2" onClick={() => setSelected(payment)}>{t('k_0142', 'ເບິ່ງໃບບີນການຈ່າຍເງິນ')}</button><button className="btn-secondary py-2" onClick={() => review(payment._id, 'approve')}>{t('k_0124', 'ອະນຸມັດ')}</button><button className="btn-danger py-2" onClick={() => review(payment._id, 'reject')}>{t('k_0077', 'ປະຕິເສດ')}</button></div></td></tr>)}</tbody>
        </table>
      </div>
      <Modal open={!!selected} title={t('k_0134', 'ຮູບໃບບີນການຈ່າຍເງິນ')} onClose={() => setSelected(null)}>
        {selected ? <div className="space-y-4"><img src={getAssetUrl(selected.slipImage)} alt="ຮູບໃບບີນການຈ່າຍເງິນ" className="max-h-[70vh] w-full rounded-3xl object-contain bg-slate-100" /><div className="grid gap-2 text-sm text-slate-600"><p>{t('k_0085', 'ຜູ້ສົ່ງ:')}{selected.userId?.name}</p><p>{t('k_0047', 'ຍອດເງິນ:')}{fmtMoney(selected.amount)}</p><p>{t('k_0104', 'ສະຖານະ:')}{selected.status}</p></div></div> : null}
      </Modal>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
