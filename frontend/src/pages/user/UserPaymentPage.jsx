import { useTranslation } from '../../utils/i18n';
import { useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";
import Toast from "../../components/common/Toast";
import { useToast } from "../../components/common/useToast";
import { fmtDate, fmtMoney, fmtMonthYear } from "../../utils/format";
import qrImage from "../../assets/QR.jpg";

export default function UserPaymentPage() {
  const { t } = useTranslation();
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({
    billId: "",
    amount: "",
    slipImage: null,
  });
  const fileInputRef = useRef(null);
  const { toast, pushToast, clearToast } = useToast();

  const loadBills = async () => {
    try {
      const response = await api.get("/bills/my/list");
      const items = Array.isArray(response.data?.bills) ? response.data.bills : [];

      const unpaidBills = items
        .filter((item) => item.status !== "paid")
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );

      setBills(unpaidBills);
    } catch (error) {
      setBills([]);
      pushToast(error.response?.data?.message || t('k_0170', 'ໂຫຼດບິນບໍ່ສຳເລັດ'), "error");
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const selectedBill = useMemo(() => {
    return bills.find((item) => item._id === form.billId);
  }, [bills, form.billId]);

  const onBillChange = (billId) => {
    const bill = bills.find((item) => item._id === billId);

    setForm((prev) => ({
      ...prev,
      billId,
      amount: bill?.totalAmount || "",
      slipImage: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.billId) {
      pushToast("ກະລຸນາເລືອກບິນ", "error");
      return;
    }

    if (!form.slipImage) {
      pushToast("ກະລຸນາເລືອກຮູບໃບບີນການຈ່າຍເງິນ", "error");
      return;
    }

    try {
      const body = new FormData();
      body.append("billId", form.billId);
      body.append("amount", form.amount);
      body.append("slipImage", form.slipImage);

      await api.post("/payments/upload-slip", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      pushToast("ອັບໂຫລດໃບບີນການຈ່າຍເງິນສຳເລັດ");

      setForm({
        billId: "",
        amount: "",
        slipImage: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      loadBills();
    } catch (error) {
      pushToast(
        error.response?.data?.message || t('k_0113', 'ສົ່ງໃບບີນການຈ່າຍເງິນບໍ່ສຳເລັດ'),
        "error",
      );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('k_0037', 'ຈ່າຍເງິນ')}
        subtitle={t('k_0152', 'ເລືອກບິນ ແລະ ອັບໂຫລດຮູບໃບບີນການຈ່າຍເງິນ')}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={submit} className="card space-y-4 p-6">
          <div>
            <label className="label">{t('k_0151', 'ເລືອກບິນ')}</label>
            <select
              className="input"
              value={form.billId}
              onChange={(e) => onBillChange(e.target.value)}
              required
            >
              <option value="">{t('k_0151', 'ເລືອກບິນ')}</option>
              {bills.map((bill) => (
                <option key={bill._id} value={bill._id}>
                  {fmtMonthYear(bill.month, bill.year)} - {fmtMoney(bill.totalAmount)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{t('k_0045', 'ຍອດຈ່າຍ')}</label>
            <input
              className="input"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="label">{t('k_0134', 'ຮູບໃບບີນການຈ່າຍເງິນ')}</label>
            <input
              ref={fileInputRef}
              className="input"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  slipImage: e.target.files?.[0] || null,
                }))
              }
              required
            />
          </div>

          <button className="btn-primary w-full" type="submit">{t('k_0112', 'ສົ່ງໃບບີນການຈ່າຍເງິນ')}</button>

          {bills.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{t('k_0068', 'ບໍ່ມີບິນທີ່ຕ້ອງຊຳລະ')}</div>
          ) : null}
        </form>

        <div className="card p-6">
          <h3 className="text-lg font-bold">{t('k_0091', 'ລາຍລະອຽດບິນ')}</h3>

          {selectedBill ? (
            <div className="mt-4 space-y-4 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-slate-500">{t('k_0136', 'ເດືອນ/ປີ')}</span>
                <p className="mt-1 font-semibold">
                  {fmtMonthYear(selectedBill.month, selectedBill.year)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-slate-500">{t('nav.rooms', 'ຫ້ອງ')}</span>
                <p className="mt-1 font-semibold">
                  {selectedBill.roomId
                    ? `${selectedBill.roomId.building}-${selectedBill.roomId.roomNumber}`
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-slate-500">{t('k_0024', 'ຄົບກຳນົດ')}</span>
                <p className="mt-1 font-semibold">{fmtDate(selectedBill.dueDate)}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <span className="text-slate-500">{t('k_0046', 'ຍອດລວມ')}</span>
                <p className="mt-1 text-lg font-semibold text-emerald-600">
                  {fmtMoney(selectedBill.totalAmount)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <span className="text-slate-500">{t('k_0005', 'QR ສຳລັບຊຳລະເງິນ')}</span>

                <div className="mt-4 flex justify-center">
                  <img
                    src={qrImage}
                    alt="qr"
                    className="h-44 w-44 rounded-xl border border-slate-200 object-cover"
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">{t('k_0105', 'ສະແກນເພື່ອຊຳລະ')}{fmtMoney(selectedBill.totalAmount)}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">{t('k_0153', 'ເລືອກບິນເພື່ອເບິ່ງລາຍລະອຽດ')}</div>
          )}
        </div>
      </div>

      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}