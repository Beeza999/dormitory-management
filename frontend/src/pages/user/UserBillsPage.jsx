import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import { fmtDate, fmtMoney, fmtMonthYear } from '../../utils/format';

export default function UserBillsPage() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    api.get('/bills/my/list').then((response) => {
      const nextBills = Array.isArray(response.data?.bills) ? response.data.bills : [];
      setBills(nextBills.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
    }).catch(() => setBills([]));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="ບິນຂອງຂ້ອຍ" subtitle="ດຶງຈາກ GET /api/bills/my/list" />
      <div className="table-wrap">
        <table className="table-ui">
          <thead><tr><th>ເດືອນ/ປີ</th><th>ຫ້ອງ</th><th>ຍອດລວມ</th><th>ຄົບກຳນົດ</th><th>ສະຖານະ</th><th>ຈັດການ</th></tr></thead>
          <tbody>
            {bills.length > 0 ? bills.map((bill) => (
              <tr key={bill._id} className="border-t border-slate-100">
                <td>{fmtMonthYear(bill.month, bill.year)}</td>
                <td>{bill.roomId ? `${bill.roomId.building}-${bill.roomId.roomNumber}` : '-'}</td>
                <td>{fmtMoney(bill.totalAmount)}</td>
                <td>{fmtDate(bill.dueDate)}</td>
                <td><StatusBadge value={bill.status} /></td>
                <td>{bill.status !== 'paid' ? <Link className="btn-outline py-2" to="/user/payment">ຈ່າຍເລີຍ</Link> : <span className="text-sm text-emerald-600">ຊຳລະແລ້ວ</span>}</td>
              </tr>
            )) : <tr className="border-t border-slate-100"><td colSpan="6" className="py-8 text-center text-sm text-slate-500">ບໍ່ມີບິນ</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
