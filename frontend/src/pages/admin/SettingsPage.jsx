import { useTranslation } from '../../utils/i18n';
import PageHeader from '../../components/common/PageHeader';

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.settings', 'ຕັ້ງຄ່າ')} subtitle={t('k_0173', 'ໜ້ານີ້ໃຊ້ສຳລັບສະແດງຂໍ້ມູນລະບົບ ແລະ ຄ່າ config ພື້ນຖານ')} />
      <div className="card p-6 space-y-3 text-sm text-slate-600">
        <p>{t('k_0001', '1. API base URL ຖືກອ່ານຈາກ')}<code>VITE_API_URL</code></p>
        <p>{t('k_0002', '2. API root ສຳລັບໂຫລດຮູບໃບບີນການຈ່າຍເງິນ ອ່ານຈາກ')}<code>VITE_API_ROOT</code></p>
        <p>{t('k_0003', '3. ຂໍ້ມູນການ login ຖືກເກັບໃນ session ຂອງແຕ່ລະ tab')}</p>
      </div>
    </div>
  );
}
