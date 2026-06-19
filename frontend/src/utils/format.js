import { useLanguageStore } from './i18n';

export const fmtMoney = (value = 0) => {
  const lang = useLanguageStore.getState().language;
  const suffix = lang === 'la' ? ' ກີບ' : (lang === 'vi' ? ' Kíp' : ' LAK');
  return new Intl.NumberFormat('en-US').format(Number(value || 0)) + suffix;
};

export const fmtDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-GB');
};

export const fmtMonthYear = (month, year) => `${String(month).padStart(2, '0')}/${year}`;

export const statusLabel = (status = '') => {
  const lang = useLanguageStore.getState().language;
  const labels = {
    la: {
      unpaid: 'ຄ້າງຈ່າຍ',
      pending: 'ລໍກວດສອບ',
      paid: 'ຈ່າຍແລ້ວ',
      approved: 'ອະນຸມັດແລ້ວ',
      rejected: 'ປະຕິເສດແລ້ວ',
      vacant: 'ວ່າງ',
      occupied: 'ມີຄົນຢູ່',
      maintenance: 'ກຳລັງແປງ',
    },
    vi: {
      unpaid: 'Chưa thanh toán',
      pending: 'Chờ kiểm tra',
      paid: 'Đã trả',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      vacant: 'Trống',
      occupied: 'Có người ở',
      maintenance: 'Đang sửa',
    },
    en: {
      unpaid: 'Unpaid',
      pending: 'Pending',
      paid: 'Paid',
      approved: 'Approved',
      rejected: 'Rejected',
      vacant: 'Vacant',
      occupied: 'Occupied',
      maintenance: 'Maintenance',
    }
  };
  return labels[lang]?.[status] || status;
};
