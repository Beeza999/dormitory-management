import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FullPageLoader } from '../common/Feedback';

function RedirectByRole() {
  const user = useAuthStore((state) => state.user);
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'user') return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <RedirectByRole />;
  }
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return <FullPageLoader text="ກຳລັງໂຫລດຂໍ້ມູນ..." />;
  if (user.role !== 'admin') return <RedirectByRole />;
  return children;
}

export function UserRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return <FullPageLoader text="ກຳລັງໂຫລດຂໍ້ມູນ..." />;
  if (user.role !== 'user') return <RedirectByRole />;
  return children;
}
