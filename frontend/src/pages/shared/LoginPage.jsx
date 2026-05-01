import { Building2, KeyRound, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Toast from "../../components/common/Toast";
import { useToast } from "../../components/common/useToast";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { toast, pushToast, clearToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const authMessage = sessionStorage.getItem("auth_message");
    if (authMessage) {
      pushToast(authMessage, "error");
      sessionStorage.removeItem("auth_message");
    }
  }, [pushToast]);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form);
      pushToast("ເຂົ້າລະບົບສຳເລັດ");
      navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard", {
        replace: true,
      });
    } catch (error) {
      const code = error.response?.data?.code;

      pushToast(
        code === "ACCOUNT_DISABLED"
          ? "ບັນຊີຂອງທ່ານຖືກປິດການໃຊ້ງານ ກະລຸນາຕິດຕໍ່ເຈົ້າຂອງຫ້ອງເຊົ່າ"
          : error.response?.data?.message || "ບໍ່ສາມາດເຂົ້າລະບົບໄດ້",
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="card overflow-hidden bg-gradient-to-br from-slate-950 to-brand-700 p-8 text-white">
          <div className="w-fit rounded-3xl bg-white/10 p-4">
            <Building2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-4xl font-black">ບີຫ້ອງເຊົ່າ</h1>
        </div>

        <div className="card p-8">
          <h2 className="text-3xl font-bold text-slate-950">ເຂົ້າລະບົບ</h2>
          <p className="mt-2 text-sm text-slate-500">
            ໃສ່ອີເມວ ແລະ ລະຫັດຜ່ານເພື່ອເຂົ້າໃຊ້ລະບົບ
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">ອີເມວ</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  className="input pl-11"
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">ລະຫັດຜ່ານ</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  className="input pl-11"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "ກຳລັງເຂົ້າລະບົບ..." : "ເຂົ້າລະບົບ"}
            </button>
          </form>
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}