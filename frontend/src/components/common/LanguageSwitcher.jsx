import { useTranslation } from '../../utils/i18n';

export default function LanguageSwitcher({ className = '' }) {
  const { language, changeLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className={`rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-slate-500 cursor-pointer ${className}`}
    >
      <option value="la">🇱🇦 ລາວ</option>
      <option value="vi">🇻🇳 Tiếng Việt</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}
