import { useTranslation } from '../../utils/i18n';
import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";
import { fmtMoney } from "../../utils/format";
import { EmptyState } from "../../components/common/Feedback";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setData(response.data?.summary || response.data || null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="card p-6">{t('common.loading', 'ກຳລັງໂຫລດ...')}</div>;
  if (!data)
    return (
      <EmptyState title={t('admin.dashboard.no_data', 'ບໍ່ພົບຂໍ້ມູນ')} text={t('k_0072', 'ບໍ່ສາມາດດຶງຂໍ້ມູນຫນ້າແລກໄດ້')} />
    );

  const cards = [
    [t('admin.dashboard.total_rooms', 'ຈຳນວນຫ້ອງ'), data.totalRooms || 0],
    [t('admin.dashboard.total_tenants', 'ຈຳນວນຜູ້ເຊົ່າ'), data.totalTenants || 0],
    [t('admin.dashboard.unpaid_bills', 'ບິນຄ້າງຈ່າຍ'), data.unpaidBills || 0],
    [t('admin.dashboard.pending_payments', 'ໃບບີນການຈ່າຍເງິນລໍກວດ'), data.pendingPayments || 0],
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.dashboard', 'ຫນ້າແລກ')} subtitle={t('admin.dashboard.subtitle', 'ສະຫຼຸບພາບລວມຂອງລະບົບ')} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="card p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-bold">{t('admin.dashboard.total_revenue', 'ລາຍຮັບລວມ')}</h3>
          <p className="mt-3 text-3xl font-black text-emerald-600">
            {fmtMoney(data.totalRevenue || 0)}
          </p>
          <p className="mt-2 text-sm text-slate-500">{t('admin.dashboard.revenue_desc', 'ຍອດເງິນຈາກບິນທີ່ຈ່າຍແລ້ວທັງໝົດ')}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-bold">{t('admin.dashboard.total_announcements', 'ປະກາດທັງໝົດ')}</h3>
          <p className="mt-3 text-3xl font-black text-brand-600">
            {data.totalAnnouncements || 0}
          </p>
          <p className="mt-2 text-sm text-slate-500">{t('admin.dashboard.announce_desc', 'ຈຳນວນປະກາດທີ່ສົ່ງໄປຫາຜູ້ເຊົ່າ')}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-bold">{t('admin.dashboard.room_status', 'ສະຖານະຫ້ອງ')}</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{t('admin.dashboard.occupied_rooms_desc', 'ຫ້ອງມີຄົນຢູ່')}</p>
              <p className="mt-2 text-2xl font-black">
                {data.occupiedRooms || 0}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{t('admin.dashboard.vacant_rooms', 'ຫ້ອງວ່າງ')}</p>
              <p className="mt-2 text-2xl font-black">
                {data.vacantRooms || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
