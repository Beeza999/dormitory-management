import { useTranslation } from '../utils/i18n';
import { create } from 'zustand';
import api from '../services/api';

const ອ່ານ = (key, fallback = '') => sessionStorage.getItem(key) || fallback;
const ຂຽນ = (key, value) => sessionStorage.setItem(key, value);
const ລຶບ = (key) => sessionStorage.removeItem(key);

const ຂໍ້ຄວາມບັນຊີຖືກປິດ =
  t('login.disabled', 'ບັນຊີຂອງທ່ານຖືກປິດການໃຊ້ງານ ກະລຸນາຕິດຕໍ່ເຈົ້າຂອງຫ້ອງເຊົ່າ');

const ຈັດຮູບແບບຜູ້ໃຊ້ = (user) => ({
  _id: user?._id || user?.id || '',
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  role: user?.role || '',
  roomId: user?.roomId || null,
  isActive: user?.isActive ?? true,
});

export const useAuthStore = create((set, get) => ({
  token: ອ່ານ('token'),
  user: JSON.parse(ອ່ານ('user', 'null')),
  isAuthenticated: !!ອ່ານ('token'),
  isLoading: false,

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = data.token;
      const user = ຈັດຮູບແບບຜູ້ໃຊ້(data.user);

      if (user.isActive === false) {
        sessionStorage.setItem('auth_message', ຂໍ້ຄວາມບັນຊີຖືກປິດ);
        set({ isLoading: false });
        throw new Error('ACCOUNT_DISABLED');
      }

      ຂຽນ('token', token);
      ຂຽນ('user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (error) {
      const code = error.response?.data?.code;
      if (code === 'ACCOUNT_DISABLED') {
        sessionStorage.setItem(
          'auth_message',
          error.response?.data?.message || ຂໍ້ຄວາມບັນຊີຖືກປິດ,
        );
      }

      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ບໍ່ເປັນຫຍັງ
    }
    ລຶບ('token');
    ລຶບ('user');
    set({ token: '', user: null, isAuthenticated: false });
  },

  loadUserFromStorage: async () => {
    const token = ອ່ານ('token');
    const rawUser = ອ່ານ('user', 'null');

    if (!token) {
      set({ token: '', user: null, isAuthenticated: false });
      return;
    }

    set({
      token,
      isAuthenticated: true,
      user: rawUser ? JSON.parse(rawUser) : null,
    });

    try {
      const { data } = await api.get('/auth/me');
      const user = ຈັດຮູບແບບຜູ້ໃຊ້(data.user);

      if (user.isActive === false) {
        sessionStorage.setItem('auth_message', ຂໍ້ຄວາມບັນຊີຖືກປິດ);
        await get().logout();
        window.location.href = '/login';
        return;
      }

      ຂຽນ('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (error) {
      const code = error.response?.data?.code;
      const message = error.response?.data?.message;

      if (code === 'ACCOUNT_DISABLED') {
        sessionStorage.setItem(
          'auth_message',
          message || ຂໍ້ຄວາມບັນຊີຖືກປິດ,
        );
      }

      await get().logout();

      if (code === 'ACCOUNT_DISABLED') {
        window.location.href = '/login';
      }
    }
  },

  updateUser: (nextUser) => {
    const user = ຈັດຮູບແບບຜູ້ໃຊ້(nextUser);
    ຂຽນ('user', JSON.stringify(user));
    set({ user });
  },
}));