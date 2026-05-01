export const fmtMoney = (value = 0) =>
  new Intl.NumberFormat('en-US').format(Number(value || 0)) + ' ກີບ';

export const fmtDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-GB');
};

export const fmtMonthYear = (month, year) => `${String(month).padStart(2, '0')}/${year}`;

export const statusLabel = (status = '') => ({
  unpaid: 'ຄ້າງຈ່າຍ',
  pending: 'ລໍກວດສອບ',
  paid: 'ຈ່າຍແລ້ວ',
  approved: 'ອະນຸມັດແລ້ວ',
  rejected: 'ປະຕິເສດແລ້ວ',
  vacant: 'ວ່າງ',
  occupied: 'ມີຄົນຢູ່',
  maintenance: 'ກຳລັງແປງ',
}[status] || status);
