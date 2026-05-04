import React, { useState, useEffect } from 'react';
import AdminLayout from '../../component/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, CheckCircle, XCircle, Truck, 
  Calendar, User, Mail, Phone, MapPin, 
  ShoppingBag, CreditCard, ChevronRight, X
} from 'lucide-react';
import { ordersAPI } from '../../utils/api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await ordersAPI.getById(orderId);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      const order = orders.find(o => o.id === orderId);
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toString().includes(searchTerm) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-500',
      processing: 'bg-blue-500/10 text-blue-500',
      shipped: 'bg-purple-500/10 text-purple-500',
      delivered: 'bg-emerald-500/10 text-emerald-500',
      cancelled: 'bg-rose-500/10 text-rose-500'
    };
    return styles[status] || 'bg-gray-500/10 text-gray-500';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Order Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track and process your customer orders</p>
          </div>
          <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto no-scrollbar">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${filterStatus === status
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-gray-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white text-sm"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-white dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Order Info</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, i) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      key={order.id}
                    >
                      <td>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-indigo-500">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <p className="font-bold dark:text-white">#{order.id}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Standard Shipping</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="font-semibold dark:text-gray-200">{order.customer_name || 'Guest User'}</p>
                        <p className="text-[10px] text-gray-500">{order.customer_email || 'No email'}</p>
                      </td>
                      <td>
                        <p className="font-black dark:text-white text-lg">${order.total?.toFixed(2)}</p>
                      </td>
                      <td>
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={14} className="mr-1.5 text-indigo-500" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => viewOrderDetails(order.id)}
                          className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all rounded-xl group"
                        >
                          <Eye size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No orders found</p>
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {showModal && selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none"
              >
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col border border-gray-100 dark:border-gray-800">
                  <div className="p-8 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                    <div>
                      <h2 className="text-2xl font-black dark:text-white flex items-center">
                        <ShoppingBag className="mr-3 text-indigo-500" />
                        Order Details
                        <span className="ml-3 text-indigo-600 dark:text-indigo-400">#{selectedOrder.id}</span>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-400 hover:text-rose-500 transition-colors shadow-sm"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Customer Info */}
                      <div className="space-y-4">
                        <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center">
                          <User size={14} className="mr-2" /> Customer Information
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-500 shadow-sm font-bold">
                              {selectedOrder.customer_name?.[0] || 'G'}
                            </div>
                            <div>
                              <p className="font-bold dark:text-white">{selectedOrder.customer_name || 'Guest User'}</p>
                              <p className="text-xs text-gray-500">{selectedOrder.customer_email || 'No email provided'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-start space-x-2">
                              <Phone size={14} className="mt-1 text-gray-400" />
                              <span className="text-xs dark:text-gray-300">{selectedOrder.customer_phone || 'N/A'}</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <MapPin size={14} className="mt-1 text-gray-400" />
                              <span className="text-xs dark:text-gray-300 line-clamp-2">{selectedOrder.shipping_address || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="space-y-4">
                        <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center">
                          <CreditCard size={14} className="mr-2" /> Payment Summary
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold dark:text-white">${selectedOrder.subtotal?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Shipping</span>
                            <span className="font-bold dark:text-white">${selectedOrder.shipping_cost?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tax</span>
                            <span className="font-bold dark:text-white">${selectedOrder.tax?.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                            <span className="font-black text-indigo-600">Total</span>
                            <span className="font-black text-xl dark:text-white">${selectedOrder.total?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center">
                        <ShoppingBag size={14} className="mr-2" /> Order Items ({selectedOrder.items?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-indigo-500 shadow-sm">
                                <Package size={20} />
                              </div>
                              <div>
                                <p className="font-bold dark:text-white text-sm">{item.product_name}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Qty: {item.quantity} × ${item.price}</p>
                              </div>
                            </div>
                            <span className="font-black dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center">
                        <Truck size={14} className="mr-2" /> Update Order Status
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                          const isActive = selectedOrder.status === status;
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                              className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${isActive 
                                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600'}`}
                            >
                              {status}
                            </button>
                          );
                        })}
                      </div>
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


export default AdminOrders;
