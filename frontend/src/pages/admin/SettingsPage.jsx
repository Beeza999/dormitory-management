import PageHeader from '../../components/common/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="ຕັ້ງຄ່າ" subtitle="ໜ້ານີ້ໃຊ້ສຳລັບສະແດງຂໍ້ມູນລະບົບ ແລະ ຄ່າ config ພື້ນຖານ" />
      <div className="card p-6 space-y-3 text-sm text-slate-600">
        <p>1. API base URL ຖືກອ່ານຈາກ <code>VITE_API_URL</code></p>
        <p>2. API root ສຳລັບໂຫລດຮູບໃບບີນການຈ່າຍເງິນ ອ່ານຈາກ <code>VITE_API_ROOT</code></p>
        <p>3. ຂໍ້ມູນການ login ຖືກເກັບໃນ session ຂອງແຕ່ລະ tab</p>
      </div>
    </div>
  );
}
