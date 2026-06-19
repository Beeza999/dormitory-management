import { useTranslation } from '../../utils/i18n';
import { Bell, CreditCard, FileClock, Megaphone, MessageCircle, Receipt, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import { fmtDate, fmtMoney, fmtMonthYear } from '../../utils/format';

const menus = [
  { to: '/user/bills', label: 'ບິນຂອງຂ້ອຍ', icon: Receipt },
  { to: '/user/payment', label: 'ສົ່ງໃບບີນການຈ່າຍເງິນ', icon: CreditCard },
  { to: '/user/history', label: 'ປະຫວັດຈ່າຍ', icon: FileClock },
  { to: '/user/notifications', label: 'ແຈ້ງເຕືອນ', icon: Bell },
  { to: '/user/announcements', label: 'ປະກາດ', icon: Megaphone },
  { to: '/user/chat', label: 'ແຊັດກັບ admin', icon: MessageCircle },
];

export default function UserDashboardPage() {
  const { t } = useTranslation();
  const [bills, setBills] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const loadData = async () => {
    try {
      const [billRes, notifRes, annRes] = await Promise.all([
        api.get('/bills/my/list'),
        api.get('/user/notifications'),
        api.get('/announcements'),
      ]);
      const nextBills = Array.isArray(billRes.data?.bills) ? billRes.data.bills : [];
      const nextNotifs = Array.isArray(notifRes.data?.notifications) ? notifRes.data.notifications : [];
      const nextAnns = Array.isArray(annRes.data?.announcements) ? annRes.data.announcements : [];
      setBills(nextBills.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      setNotifications(nextNotifs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      setAnnouncements(nextAnns.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
    } catch (error) {
      console.error(error);
      setBills([]);
      setNotifications([]);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const latestBill = bills[0];
  const unpaidAmount = useMemo(() => bills.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + Number(item.totalAmount || 0), 0), [bills]);
  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.home', 'ໜ້າຫຼັກ')} subtitle={t('k_0021', 'ກົດເຂົ້າໜ້າຕ່າງໆໄດ້ທັນທີ')} />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-5"><Receipt className="h-8 w-8 text-brand-600" /><p className="mt-3 text-sm text-slate-500">{t('k_0063', 'ບິນລ່າສຸດ')}</p><p className="mt-2 text-2xl font-black">{latestBill ? fmtMoney(latestBill.totalAmount) : '-'}</p></div>
        <div className="card p-5"><Wallet className="h-8 w-8 text-rose-600" /><p className="mt-3 text-sm text-slate-500">{t('k_0044', 'ຍອດຄ້າງ')}</p><p className="mt-2 text-2xl font-black">{fmtMoney(unpaidAmount)}</p></div>
        <div className="card p-5"><Bell className="h-8 w-8 text-amber-600" /><p className="mt-3 text-sm text-slate-500">{t('k_0166', 'ແຈ້ງເຕືອນໃໝ່')}</p><p className="mt-2 text-2xl font-black">{unreadCount}</p></div>
        <div className="card p-5"><Megaphone className="h-8 w-8 text-sky-600" /><p className="mt-3 text-sm text-slate-500">{t('nav.announcements', 'ປະກາດ')}</p><p className="mt-2 text-2xl font-black">{announcements.length}</p></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menus.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="rounded-2xl bg-slate-100 p-3"><Icon className="h-6 w-6 text-slate-900" /></div>
            <div>
              <p className="font-bold text-slate-900">{label}</p>
              <p className="text-sm text-slate-500">{t('k_0020', 'ກົດເຂົ້າໄດ້ເລີຍ')}</p>
            </div>
          </Link>
        ))}
      </div>

      {latestBill ? (
        <div className="card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold">{t('k_0062', 'ບິນປະຈຳເດືອນ')}{fmtMonthYear(latestBill.month, latestBill.year)}</h3>
              <p className="mt-1 text-sm text-slate-500">{t('k_0024', 'ຄົບກຳນົດ')}{fmtDate(latestBill.dueDate)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatusBadge value={latestBill.status} />
              <Link className="btn-secondary" to="/user/bills">{t('k_0141', 'ເບິ່ງບິນ')}</Link>
              <Link className="btn-primary" to="/user/payment"><CreditCard className="mr-2 h-4 w-4" />{t('k_0131', 'ອັບໃບບີນການຈ່າຍເງິນ')}</Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t('k_0165', 'ແຈ້ງເຕືອນລ່າສຸດ')}</h3>
            <Link to="/user/notifications" className="text-sm font-semibold text-brand-700">{t('k_0140', 'ເບິ່ງທັງໝົດ')}</Link>
          </div>
          <div className="space-y-3">
            {notifications.length > 0 ? notifications.slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </div>
            )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{t('k_0071', 'ບໍ່ມີແຈ້ງເຕືອນ')}</div>}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t('k_0074', 'ປະກາດລ່າສຸດ')}</h3>
            <Link to="/user/announcements" className="text-sm font-semibold text-brand-700">{t('k_0140', 'ເບິ່ງທັງໝົດ')}</Link>
          </div>
          <div className="space-y-3">
            {announcements.length > 0 ? announcements.slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              </div>
            )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{t('k_0069', 'ບໍ່ມີປະກາດ')}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
