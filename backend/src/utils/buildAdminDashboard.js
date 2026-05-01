function buildAdminDashboard({ rooms = [], bills = [], payments = [], users = [], announcements = [] }) {
  const occupiedRooms = rooms.filter((room) => room.status === 'occupied').length;
  const vacantRooms = rooms.filter((room) => room.status === 'vacant').length;
  const unpaidBills = bills.filter((bill) => ['unpaid', 'overdue', 'pending'].includes(bill.status)).length;
  const paidBills = bills.filter((bill) => bill.status === 'paid');
  const totalRevenue = paidBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const pendingPayments = payments.filter((payment) => payment.status === 'pending').length;
  const totalTenants = users.filter((user) => user.role === 'user' && user.isActive).length;

  return {
    summary: {
      totalRooms: rooms.length,
      occupiedRooms,
      vacantRooms,
      unpaidBills,
      totalRevenue,
      pendingPayments,
      totalTenants,
      totalAnnouncements: announcements.length
    }
  };
}

module.exports = buildAdminDashboard;
