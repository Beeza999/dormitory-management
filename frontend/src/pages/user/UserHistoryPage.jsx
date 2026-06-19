import { useTranslation } from '../../utils/i18n';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import { fmtDate, fmtMoney, fmtMonthYear } from '../../utils/format';

export default function UserHistoryPage() {
  const { t } = useTranslation();
  const [bills, setBills] = useState([]);

  useEffect(() => {
    api.get('/bills/my/history').then((response) => {
      const nextBills = Array.isArray(response.data?.bills) ? response.data.bills : [];
      setBills(nextBills);
    }).catch(() => setBills([]));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title={t('k_0079', 'ປະຫວັດການຈ່າຍ')} subtitle={t('k_0061', 'ບິນທີ່ຈ່າຍແລ້ວທັງໝົດ')} />
      <div className="space-y-4">
        {bills.length > 0 ? bills.map((bill) => (
          <div key={bill._id} className="card p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-bold">{fmtMonthYear(bill.month, bill.year)}</p>
                <p className="text-sm text-slate-500">{t('k_0024', 'ຄົບກຳນົດ')}{fmtDate(bill.dueDate)}</p>
              </div>
              <p className="text-xl font-black text-emerald-600">{fmtMoney(bill.totalAmount)}</p>
            </div>
          </div>
        )) : <div className="card p-5 text-sm text-slate-500">{t('k_0070', 'ບໍ່ມີປະຫວັດການຈ່າຍ')}</div>}
      </div>
    </div>
  );
}
