import React, { useState, useEffect } from 'react';
import { getContactMessages } from '../../services/dbService';
import { doc, deleteDoc } from 'firebase/firestore';
import { db as firestoreDb } from '../../firebase';
import { toast } from 'react-toastify';
import { 
  Search, 
  Trash2, 
  Mail, 
  User, 
  Calendar,
  MessageSquare,
  FolderOpen
} from 'lucide-react';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const docRef = doc(firestoreDb, "contactMessages", id);
        await deleteDoc(docRef);
        toast.success("Message deleted successfully");
        loadMessages();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete message");
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 inset-y-0 my-auto text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search messages by name, email, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2 text-xs w-full sm:w-80 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* MESSAGES LIST */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded-2xl text-slate-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          No messages or inquiries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                {/* META INFO */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-400" />
                      {msg.name}
                    </p>
                    <p className="text-slate-400 text-xs flex items-center gap-1.5 hover:text-slate-200 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 bg-slate-950 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 rounded-xl transition"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* MESSAGE TEXT */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
                  <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>

              {/* DATE */}
              <div className="text-[10px] text-slate-500 flex items-center gap-1 border-t border-slate-850 pt-3">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Received: {msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-IN') : 'N/A'}</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MessagesManager;
