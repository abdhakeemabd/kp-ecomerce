import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaEnvelope, FaEnvelopeOpen, FaTrash, FaPhone, FaUser } from 'react-icons/fa';
import { contactAPI } from '../../utils/api';

function AdminContacts() {
  const navigate = useNavigate();
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
        alert('Error deleting message. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Contact Messages
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-indigo-800">
                  {contacts.filter(c => !c.is_read).length} Unread
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'read'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterRead(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterRead === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => viewContactDetails(contact)}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  !contact.is_read ? 'border-l-4 border-indigo-600' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-full ${contact.is_read ? 'bg-gray-100' : 'bg-indigo-100'}`}>
                      {contact.is_read ? (
                        <FaEnvelopeOpen className="text-gray-600" />
                      ) : (
                        <FaEnvelope className="text-indigo-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-lg font-semibold ${!contact.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {contact.name}
                        </h3>
                        {!contact.is_read && (
                          <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{contact.email}</p>
                      <p className={`text-sm ${!contact.is_read ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                        {contact.subject || 'No subject'}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-xs text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <FaEnvelope className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No messages found</p>
          </div>
        )}
      </main>

      {/* Message Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-[#03030373] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaUser className="text-indigo-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <FaEnvelope className="text-indigo-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                    <FaPhone className="text-indigo-600 text-xl" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedContact.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Received</p>
                    <p className="font-medium">{new Date(selectedContact.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              {selectedContact.subject && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Subject</h3>
                  <p className="text-lg font-semibold text-gray-800">{selectedContact.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete Message
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContacts;
