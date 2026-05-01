import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { AdminRoute, GuestRoute, UserRoute } from './components/routes/ProtectedRoutes';
import LoginPage from './pages/shared/LoginPage';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import RoomsPage from './pages/admin/RoomsPage';
import TenantsPage from './pages/admin/TenantsPage';
import BillingPage from './pages/admin/BillingPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AnnouncementsPage from './pages/admin/AnnouncementsPage';
import AdminChatPage from './pages/admin/AdminChatPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import UserDashboardPage from './pages/user/UserDashboardPage';
import UserBillsPage from './pages/user/UserBillsPage';
import UserPaymentPage from './pages/user/UserPaymentPage';
import UserHistoryPage from './pages/user/UserHistoryPage';
import UserNotificationsPage from './pages/user/UserNotificationsPage';
import UserAnnouncementsPage from './pages/user/UserAnnouncementsPage';
import UserChatPage from './pages/user/UserChatPage';
import UserProfilePage from './pages/user/UserProfilePage';

export default function App() {
  const loadUserFromStorage = useAuthStore((state) => state.loadUserFromStorage);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="chat" element={<AdminChatPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/user" element={<UserRoute><UserLayout /></UserRoute>}>
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="bills" element={<UserBillsPage />} />
        <Route path="payment" element={<UserPaymentPage />} />
        <Route path="history" element={<UserHistoryPage />} />
        <Route path="notifications" element={<UserNotificationsPage />} />
        <Route path="announcements" element={<UserAnnouncementsPage />} />
        <Route path="chat" element={<UserChatPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
