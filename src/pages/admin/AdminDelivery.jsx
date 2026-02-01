import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaTruck, FaCheck, FaClock } from 'react-icons/fa';
import { deliveryAPI, ordersAPI } from '../../utils/api';

function AdminDelivery() {
  const navigate = useNavigate();
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
      // Try to fetch deliveries, fallback to orders with delivery info
      try {
        const response = await deliveryAPI.getAll();
        setDeliveries(response.data || []);
      } catch {
        // Fallback: get orders and filter for shipped/delivered
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
      alert('Error updating delivery status. Please try again.');
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_transit: 'bg-blue-100 text-blue-800 border-blue-300',
      out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'delivered') return <FaCheck className="text-green-600" />;
    if (status === 'in_transit' || status === 'out_for_delivery') return <FaTruck className="text-blue-600" />;
    return <FaClock className="text-yellow-600" />;
  };

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
                Delivery Management
              </h1>
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
              placeholder="Search by tracking number, customer name, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'in_transit', 'out_for_delivery', 'delivered', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Deliveries Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      {getStatusIcon(delivery.status)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tracking #</p>
                      <p className="font-bold text-gray-800">{delivery.tracking_number}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(delivery.status)}`}>
                    {delivery.status?.split('_').join(' ')}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium">#{delivery.order_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{delivery.customer_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-medium text-sm">{delivery.shipping_address || 'N/A'}</p>
                  </div>
                  {delivery.estimated_delivery && (
                    <div>
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-medium">{new Date(delivery.estimated_delivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 mb-3">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {delivery.status !== 'in_transit' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery.id, 'in_transit')}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        In Transit
                      </button>
                    )}
                    {delivery.status !== 'out_for_delivery' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery.id, 'out_for_delivery')}
                        className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"
                      >
                        Out for Delivery
                      </button>
                    )}
                    {delivery.status !== 'delivered' && (
                      <button
                        onClick={() => handleStatusUpdate(delivery.id, 'delivered')}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDeliveries.length === 0 && (
          <div className="text-center py-12">
            <FaTruck className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No deliveries found</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDelivery;
