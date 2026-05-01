import { Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { fmtDate } from '../../utils/format';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';

export default function AdminChatPage() {
  const user = useAuthStore((state) => state.user);
  const [tenants, setTenants] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { toast, pushToast, clearToast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/tenants');
      setTenants(data.tenants || []);
      if (data.tenants?.length) setSelectedId(data.tenants[0]._id);
    };
    load();
  }, []);

  const selectedTenant = useMemo(() => tenants.find((item) => item._id === selectedId), [tenants, selectedId]);

  const loadChat = async () => {
    if (!selectedId) return;
    const { data } = await api.get(`/chat/${selectedId}`);
    setMessages(data.chats || []);
  };

  useEffect(() => { loadChat(); }, [selectedId]);

  const send = async (event) => {
    event.preventDefault();
    if (!text.trim() || !selectedId) return;
    try {
      await api.post('/chat/send', { receiverId: selectedId, message: text });
      setText('');
      loadChat();
    } catch (error) {
      pushToast(error.response?.data?.message || 'ສົ່ງຂໍ້ຄວາມບໍ່ສຳເລັດ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ແຊັດກັບຜູ້ເຊົ່າ" subtitle="ດຶງບົດສົນທະນາ 2 ທາງ ແລະ ສົ່ງຂໍ້ຄວາມ" />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card p-4 space-y-3">{tenants.map((tenant) => <button key={tenant._id} type="button" className={`w-full rounded-2xl p-4 text-left ${selectedId === tenant._id ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-700'}`} onClick={() => setSelectedId(tenant._id)}><p className="font-semibold">{tenant.name}</p><p className={`mt-1 text-xs ${selectedId === tenant._id ? 'text-slate-300' : 'text-slate-500'}`}>{tenant.email}</p></button>)}</div>
        <div className="card flex h-[70vh] flex-col overflow-hidden">
          <div className="border-b border-slate-100 p-4"><h3 className="font-bold">{selectedTenant?.name || 'ເລືອກຜູ້ເຊົ່າ'}</h3></div>
          <div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((item) => <div key={item._id} className={`flex ${String(item.senderId?._id || item.senderId) === String(user?._id) ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm ${String(item.senderId?._id || item.senderId) === String(user?._id) ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-800'}`}><p>{item.message}</p><p className="mt-1 text-[11px] opacity-70">{fmtDate(item.createdAt)}</p></div></div>)}</div>
          <form onSubmit={send} className="border-t border-slate-100 p-4"><div className="flex gap-3"><input className="input" placeholder="ພິມຂໍ້ຄວາມ..." value={text} onChange={(e) => setText(e.target.value)} /><button className="btn-primary px-5" type="submit"><Send className="h-4 w-4" /></button></div></form>
        </div>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
