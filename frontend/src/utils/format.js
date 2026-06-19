import { useTranslation } from './i18n';
export const fmtMoney = (value = 0) =>
  new Intl.NumberFormat('en-US').format(Number(value || 0)) + ' ກີບ';

export const fmtDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-GB');
};

export const fmtMonthYear = (month, year) => `${String(month).padStart(2, '0')}/${year}`;

export const statusLabel = (status = '') => ({
  unpaid: t('k_0032', 'ຄ້າງຈ່າຍ'),
  pending: t('k_0098', 'ລໍກວດສອບ'),
  paid: t('k_0039', 'ຈ່າຍແລ້ວ'),
  approved: t('k_0125', 'ອະນຸມັດແລ້ວ'),
  rejected: t('k_0078', 'ປະຕິເສດແລ້ວ'),
  vacant: t('k_0102', 'ວ່າງ'),
  occupied: t('k_0090', 'ມີຄົນຢູ່'),
  maintenance: t('k_0015', 'ກຳລັງແປງ'),
}[status] || status);
