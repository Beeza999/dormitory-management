import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { fmtDate } from '../../utils/format';
import Toast from '../../components/common/Toast';
import { useToast } from '../../components/common/useToast';

export default function UserChatPage() {
  const user = useAuthStore((state) => state.user);
  const [adminId, setAdminId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const { toast, pushToast, clearToast } = useToast();

  const detectAdmin = async () => {
    try {
      const { data } = await api.get('/announcements');
      const found = data.announcements?.find((item) => item.createdBy?._id)?.createdBy?._id || '';
      setAdminId(found);
      return found;
    } catch {
      setAdminId('');
      return '';
    }
  };

  const loadChat = async (targetId = adminId) => {
    if (!targetId) return;
    try {
      const { data } = await api.get(`/chat/${targetId}`);
      setMessages(Array.isArray(data?.chats) ? data.chats : []);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    detectAdmin().then((id) => loadChat(id));
  }, []);

  const send = async (event) => {
    event.preventDefault();
    if (!text.trim() || !adminId) return;
    try {
      await api.post('/chat/send', { receiverId: adminId, message: text.trim() });
      setText('');
      loadChat(adminId);
    } catch (error) {
      pushToast(error.response?.data?.message || 'ສົ່ງບໍ່ສຳເລັດ', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ແຊັດກັບ admin" subtitle={adminId ? 'ພ້ອມສົນທະນາແລ້ວ' : 'ກຳລັງຊອກຫາ admin...'} />
      <div className="card flex h-[70vh] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length > 0 ? messages.map((item) => {
            const isMe = String(item.senderId?._id || item.senderId) === String(user?._id);
            return (
              <div key={item._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm ${isMe ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <p>{item.message}</p>
                  <p className="mt-1 text-[11px] opacity-70">{fmtDate(item.createdAt)}</p>
                </div>
              </div>
            );
          }) : <div className="text-sm text-slate-500">ຍັງບໍ່ມີຂໍ້ຄວາມ</div>}
        </div>
        <form onSubmit={send} className="border-t border-slate-100 p-4">
          <div className="flex gap-3">
            <input className="input" placeholder="ພິມຂໍ້ຄວາມ..." value={text} onChange={(e) => setText(e.target.value)} disabled={!adminId} />
            <button className="btn-primary px-5" type="submit" disabled={!adminId}><Send className="h-4 w-4" /></button>
          </div>
        </form>
      </div>
      <Toast toast={toast} onClose={clearToast} />
    </div>
  );
}
