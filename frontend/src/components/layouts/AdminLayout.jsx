import { Bell, Building2, CreditCard, DoorOpen, FileBarChart2, LayoutDashboard, Megaphone, MessageCircle, Receipt, Settings, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const menus = [
  ['dashboard', 'ຫນ້າແລກ', LayoutDashboard],
  ['rooms', 'ຫ້ອງ', DoorOpen],
  ['tenants', 'ຜູ້ເຊົ່າ', Users],
  ['billing', 'ບິນ', Receipt],
  ['payments', 'ການຈ່າຍ', CreditCard],
  ['announcements', 'ປະກາດ', Megaphone],
  ['chat', 'ແຊັດ', MessageCircle],
  ['reports', 'ລາຍງານ', FileBarChart2],
  ['settings', 'ຕັ້ງຄ່າ', Settings],
];

export default function AdminLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen xl:grid-cols-[280px_1fr]">
        <aside className="bg-slate-950 p-5 text-white xl:block">
          <div className="sticky top-5">
            <div className="mb-6 flex items-center gap-3 rounded-3xl bg-white/10 p-4">
              <div className="rounded-2xl bg-white/10 p-3"><Building2 className="h-6 w-6" /></div>
              <div>
                <p className="text-lg font-bold">ບີຫ້ອງເຊົ່າ</p>
                <p className="text-xs text-slate-400">ໜ້າຄວບຄຸມຜູ້ດູແລ</p>
              </div>
            </div>
            <nav className="space-y-2">
              {menus.map(([path, label, Icon]) => (
                <NavLink
                  key={path}
                  to={`/admin/${path}`}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="p-4 md:p-6 xl:p-8">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">ຜູ້ດູແລລະບົບ</p>
              <p className="text-xl font-bold text-slate-950">{user?.name || 'ຜູ້ດູແລ'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600"><Bell className="h-5 w-5" /></div>
              <button type="button" className="btn-outline" onClick={logout}>ອອກຈາກລະບົບ</button>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
