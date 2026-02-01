import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaBox, FaShoppingCart, FaTruck, FaEnvelope, FaDollarSign, 
  FaUsers, FaChartLine, FaCalendarDay, FaCalendarAlt, FaCalendar 
} from 'react-icons/fa';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { analyticsAPI, ordersAPI, productsAPI, contactAPI } from '../../utils/api';

function AdminDashboard() {
  const { adminUser, logout } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingDeliveries: 0,
    unreadMessages: 0,
    todaySales: 0,
    monthSales: 0,
    yearSales: 0,
    totalRevenue: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data (with fallback for API errors)
      const [products, orders, contacts] = await Promise.allSettled([
        productsAPI.getAll(),
        ordersAPI.getAll(),
        contactAPI.getAll()
      ]);

      // Process products
      const productsData = products.status === 'fulfilled' ? products.value.data : [];
      
      // Process orders
      const ordersData = orders.status === 'fulfilled' ? orders.value.data : [];
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);
      const thisYear = new Date().getFullYear();

      const todayOrders = ordersData.filter(o => o.created_at?.startsWith(today));
      const monthOrders = ordersData.filter(o => o.created_at?.startsWith(thisMonth));
      const yearOrders = ordersData.filter(o => o.created_at?.startsWith(thisYear.toString()));

      // Process contacts
      const contactsData = contacts.status === 'fulfilled' ? contacts.value.data : [];
      const unreadContacts = contactsData.filter(c => !c.is_read);

      // Calculate sales
      const calculateTotal = (orders) => orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalProducts: productsData.length || 0,
        totalOrders: ordersData.length || 0,
        pendingDeliveries: ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length || 0,
        unreadMessages: unreadContacts.length || 0,
        todaySales: calculateTotal(todayOrders),
        monthSales: calculateTotal(monthOrders),
        yearSales: calculateTotal(yearOrders),
        totalRevenue: calculateTotal(ordersData)
      });

      // Generate sales chart data
      generateSalesData(ordersData);
      
      // Generate order status data
      const statusCounts = ordersData.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      setOrderStatusData([
        { name: 'Pending', value: statusCounts.pending || 0, color: '#FFA500' },
        { name: 'Processing', value: statusCounts.processing || 0, color: '#3B82F6' },
        { name: 'Shipped', value: statusCounts.shipped || 0, color: '#8B5CF6' },
        { name: 'Delivered', value: statusCounts.delivered || 0, color: '#10B981' },
        { name: 'Cancelled', value: statusCounts.cancelled || 0, color: '#EF4444' }
      ]);

      // Set recent orders
      setRecentOrders(ordersData.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSalesData = (orders) => {
    const data = [];
    const now = new Date();

    if (selectedPeriod === 'day') {
      // Last 24 hours
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourStr = hour.getHours().toString().padStart(2, '0');
        const sales = orders.filter(o => {
          const orderHour = new Date(o.created_at).getHours();
          return orderHour === hour.getHours();
        }).reduce((sum, o) => sum + (o.total || 0), 0);
        
        data.push({ name: `${hourStr}:00`, sales });
      }
    } else if (selectedPeriod === 'month') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const sales = orders.filter(o => o.created_at?.startsWith(dateStr))
          .reduce((sum, o) => sum + (o.total || 0), 0);
        
        data.push({ name: date.getDate().toString(), sales });
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toISOString().slice(0, 7);
        const sales = orders.filter(o => o.created_at?.startsWith(monthStr))
          .reduce((sum, o) => sum + (o.total || 0), 0);
        
        data.push({ 
          name: date.toLocaleString('default', { month: 'short' }), 
          sales 
        });
      }
    }

    setSalesData(data);
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor, trend }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <FaChartLine className="mr-1" /> {trend}
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {adminUser?.username}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/admin/products')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                Products
              </button>
              <button
                onClick={() => navigate('/admin/orders')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                Orders
              </button>
              <button
                onClick={() => navigate('/admin/delivery')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Delivery
              </button>
              <button
                onClick={() => navigate('/admin/contacts')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                Messages
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaBox}
            title="Total Products"
            value={stats.totalProducts}
            color="bg-blue-500"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={FaShoppingCart}
            title="Total Orders"
            value={stats.totalOrders}
            color="bg-green-500"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={FaTruck}
            title="Pending Deliveries"
            value={stats.pendingDeliveries}
            color="bg-orange-500"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={FaEnvelope}
            title="Unread Messages"
            value={stats.unreadMessages}
            color="bg-purple-500"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Today's Sales</p>
                <p className="text-3xl font-bold mt-2">${stats.todaySales.toFixed(2)}</p>
              </div>
              <FaCalendarDay className="text-5xl opacity-30" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">This Month</p>
                <p className="text-3xl font-bold mt-2">${stats.monthSales.toFixed(2)}</p>
              </div>
              <FaCalendarAlt className="text-5xl opacity-30" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">This Year</p>
                <p className="text-3xl font-bold mt-2">${stats.yearSales.toFixed(2)}</p>
              </div>
              <FaCalendar className="text-5xl opacity-30" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Sales Overview</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedPeriod('day')}
                  className={`px-3 py-1 rounded-lg text-sm ${selectedPeriod === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Day
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-3 py-1 rounded-lg text-sm ${selectedPeriod === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setSelectedPeriod('year')}
                  className={`px-3 py-1 rounded-lg text-sm ${selectedPeriod === 'year' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Year
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
