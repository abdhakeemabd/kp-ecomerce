import React, { useState, useEffect } from 'react';
import AdminLayout from '../../component/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Mail, MailOpen, Trash2, 
  Phone, User, Calendar, MessageSquare, 
  X, CheckCircle, Info
} from 'lucide-react';
import { contactAPI } from '../../utils/api';

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll();
      setContacts(response.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (contactId) => {
    try {
      await contactAPI.markAsRead(contactId);
      fetchContacts();
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactAPI.delete(contactId);
        fetchContacts();
        if (selectedContact?.id === contactId) {
          setShowModal(false);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    if (!contact.is_read) {
      handleMarkAsRead(contact.id);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRead = 
      filterRead === 'all' ||
      (filterRead === 'unread' && !contact.is_read) ||
      (filterRead === 'read' && contact.is_read);
    return matchesSearch && matchesRead;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Customer Inquiries</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage feedback and support messages</p>
          </div>
          <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            {['all', 'unread', 'read'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterRead(filter)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${filterRead === filter
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by sender, email or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-gray-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white text-sm"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-3xl bg-white dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={contact.id}
                onClick={() => viewContactDetails(contact)}
                className={`glass-card rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${
                  !contact.is_read 
                    ? 'border-indigo-500/20 dark:border-indigo-500/30' 
                    : 'border-transparent dark:border-gray-800/50'
                } group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 flex-1">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                      !contact.is_read 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                      {!contact.is_read ? <Mail size={24} /> : <MailOpen size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className={`font-black dark:text-white truncate ${!contact.is_read ? 'text-lg' : 'text-base'}`}>
                          {contact.name}
                        </h3>
                        {!contact.is_read && (
                          <span className="px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-tighter rounded-full">New Message</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-medium mb-2">{contact.email}</p>
                      <p className={`text-sm line-clamp-1 ${!contact.is_read ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                        {contact.subject || 'Inquiry regarding services'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="hidden md:flex flex-col items-end text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center">
                        <Calendar size={10} className="mr-1" />
                        {new Date(contact.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                      className="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredContacts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Inbox is empty</p>
          </div>
        )}

        <AnimatePresence>
          {showModal && selectedContact && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 bg-black/60 z-[100]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
              >
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col border border-gray-100 dark:border-gray-800">
                  <div className="p-8 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <User size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black dark:text-white">{selectedContact.name}</h2>
                        <p className="text-xs text-indigo-500 font-bold">{selectedContact.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-400 hover:text-rose-500 transition-colors shadow-sm"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 flex items-center">
                          <Phone size={10} className="mr-1" /> Contact
                        </p>
                        <p className="font-bold dark:text-white text-sm">{selectedContact.phone || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 flex items-center">
                          <Calendar size={10} className="mr-1" /> Received
                        </p>
                        <p className="font-bold dark:text-white text-sm">{new Date(selectedContact.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Subject</p>
                      <h3 className="text-2xl font-black dark:text-white leading-tight">
                        {selectedContact.subject || 'No subject provided'}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1 flex items-center">
                        <Info size={10} className="mr-1" /> Message Content
                      </p>
                      <div className="bg-indigo-50/30 dark:bg-indigo-900/10 rounded-3xl p-8 border border-indigo-100/50 dark:border-indigo-500/10">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg italic">
                          "{selectedContact.message}"
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={() => handleDelete(selectedContact.id)}
                        className="flex-1 px-8 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center"
                      >
                        <Trash2 size={18} className="mr-2" /> Delete Permanently
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
export default AdminContacts;
