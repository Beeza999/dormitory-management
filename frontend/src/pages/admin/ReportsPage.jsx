import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import { fmtMoney } from '../../utils/format';

export default function ReportsPage() {
  const [data, setData] = useState({ revenueByMonth: [], unpaidBills: [], vacantRooms: [] });

  useEffect(() => {
    api.get('/admin/reports').then((response) => setData(response.data));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="ລາຍງານ" subtitle="ຂໍ້ມູນລາຍຮັບ, ບິນຄ້າງ, ແລະ ຫ້ອງວ່າງ" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-slate-500">ເດືອນລາຍຮັບຫຼ້າສຸດ</p><p className="mt-2 text-2xl font-black">{data.revenueByMonth?.length || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">ບິນຄ້າງຈ່າຍ</p><p className="mt-2 text-2xl font-black">{data.unpaidBills?.length || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-slate-500">ຫ້ອງວ່າງ</p><p className="mt-2 text-2xl font-black">{data.vacantRooms?.length || 0}</p></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6"><h3 className="text-lg font-bold">ລາຍຮັບຕາມເດືອນ</h3><div className="mt-4 space-y-3">{data.revenueByMonth?.map((item, index) => <div key={index} className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold">{String(item._id.month).padStart(2, '0')}/{item._id.year}</p><p className="text-sm text-slate-500">{fmtMoney(item.totalRevenue)}</p></div>)}</div></div>
        <div className="card p-6"><h3 className="text-lg font-bold">ຫ້ອງວ່າງ</h3><div className="mt-4 space-y-3">{data.vacantRooms?.map((room) => <div key={room._id} className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold">{room.building}-{room.roomNumber}</p><p className="text-sm text-slate-500">ຊັ້ນ {room.floor}</p></div>)}</div></div>
      </div>
    </div>
  );
}
