import React, { useState, useEffect } from 'react';
import AdminLayout from '../../component/AdminLayout';
import { motion } from 'framer-motion';
import { 
  Search, Truck, CheckCircle, Clock, 
  MapPin, User, Package, Navigation, 
  AlertCircle, ChevronRight
} from 'lucide-react';
import { deliveryAPI, ordersAPI } from '../../utils/api';

function AdminDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      try {
        const response = await deliveryAPI.getAll();
        setDeliveries(response.data || []);
      } catch {
        const ordersResponse = await ordersAPI.getAll();
        const deliveryOrders = (ordersResponse.data || [])
          .filter(order => ['shipped', 'delivered'].includes(order.status))
          .map(order => ({
            id: order.id,
            order_id: order.id,
            customer_name: order.customer_name,
            shipping_address: order.shipping_address,
            status: order.status === 'delivered' ? 'delivered' : 'in_transit',
            tracking_number: order.tracking_number || `TRK${order.id}`,
            estimated_delivery: order.estimated_delivery,
            created_at: order.created_at
          }));
        setDeliveries(deliveryOrders);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await deliveryAPI.updateStatus(deliveryId, newStatus);
      fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.order_id?.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-500',
      in_transit: 'bg-blue-500/10 text-blue-500',
      out_for_delivery: 'bg-purple-500/10 text-purple-500',
      delivered: 'bg-emerald-500/10 text-emerald-500',
      failed: 'bg-rose-500/10 text-rose-500'
    };
    return styles[status] || 'bg-gray-500/10 text-gray-500';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Delivery Logistics</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor shipments and delivery status</p>
          </div>
          <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto no-scrollbar">
            {['all', 'pending', 'in_transit', 'out_for_delivery', 'delivered', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${filterStatus === status
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search tracking #, customer or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-gray-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white text-sm"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-[2rem] bg-white dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeliveries.map((delivery, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={delivery.id} 
                className="glass-card rounded-[2rem] p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                      <Truck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Tracking Number</p>
                      <p className="font-bold dark:text-white group-hover:text-indigo-500 transition-colors">{delivery.tracking_number}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(delivery.status)}`}>
                    {delivery.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Package size={16} className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Order Info</p>
                      <p className="text-sm font-bold dark:text-gray-200">Order #{delivery.order_id}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <User size={16} className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Customer</p>
                      <p className="text-sm font-bold dark:text-gray-200">{delivery.customer_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin size={16} className="mt-1 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Destination</p>
                      <p className="text-xs dark:text-gray-300 line-clamp-1">{delivery.shipping_address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3">Update Progress</p>
                  <div className="flex flex-wrap gap-2">
                    {['in_transit', 'out_for_delivery', 'delivered'].map((status) => (
                      delivery.status !== status && (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(delivery.id, status)}
                          className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-indigo-600 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                          {status.replace('_', ' ')}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredDeliveries.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No deliveries matching criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
export default AdminDelivery;
