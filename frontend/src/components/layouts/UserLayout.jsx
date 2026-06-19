import { useTranslation } from '../../utils/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { Bell, CreditCard, LayoutDashboard, Megaphone, MessageCircle, Receipt, User2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const menus = [
  ['/user/dashboard', 'nav.home', 'ໜ້າຫຼັກ', LayoutDashboard],
  ['/user/bills', 'nav.billing', 'ບິນ', Receipt],
  ['/user/payment', 'nav.pay', 'ຈ່າຍ', CreditCard],
  ['/user/announcements', 'nav.announcements', 'ປະກາດ', Megaphone],
  ['/user/notifications', 'nav.notifications', 'ແຈ້ງເຕືອນ', Bell],
  ['/user/chat', 'nav.chat', 'ແຊັດ', MessageCircle],
  ['/user/profile', 'nav.profile', 'ໂປຣໄຟລ໌', User2],
];

export default function UserLayout() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-slate-100 pb-24 md:pb-8">
      <div className="mx-auto max-w-6xl p-4 md:p-6 xl:p-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">{t('login.app_name', 'ບີຫ້ອງເຊົ່າ')}</p>
            <p className="text-xl font-bold text-slate-950">{t('nav.hello', 'ສະບາຍດີ,')}{user?.name || 'User'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {menus.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `hidden rounded-2xl px-4 py-2 text-sm md:inline-flex ${isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {t(key, defaultLabel)}
              </NavLink>
            ))}
            <button type="button" onClick={logout} className="btn-outline w-full md:w-auto">{t('nav.logout', 'ອອກຈາກລະບົບ')}</button>
          </div>
        </div>
        <Outlet />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {menus.slice(0, 5).map(([to, label, Icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] ${isActive ? 'bg-slate-950 text-white' : 'text-slate-500'}`}>
              <Icon className="mb-1 h-4 w-4" />
              <span>{t(key, defaultLabel)}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
