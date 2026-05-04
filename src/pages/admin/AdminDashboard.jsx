import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminLayout from '../../component/AdminLayout';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, MessageSquare, 
  ArrowUpRight, ArrowDownRight, Calendar, Filter
} from 'lucide-react';
import { productsAPI, ordersAPI, contactAPI } from '../../utils/api';

function AdminDashboard() {
  const { adminUser } = useAdmin();
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
      const [products, orders, contacts] = await Promise.allSettled([
        productsAPI.getAll(),
        ordersAPI.getAll(),
        contactAPI.getAll()
      ]);

      const productsData = products.status === 'fulfilled' ? products.value.data : [];
      const ordersData = orders.status === 'fulfilled' ? orders.value.data : [];
      const contactsData = contacts.status === 'fulfilled' ? contacts.value.data : [];
      
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);
      const thisYear = new Date().getFullYear();

      const todayOrders = ordersData.filter(o => o.created_at?.startsWith(today));
      const monthOrders = ordersData.filter(o => o.created_at?.startsWith(thisMonth));
      const yearOrders = ordersData.filter(o => o.created_at?.startsWith(thisYear.toString()));

      const calculateTotal = (orders) => orders.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalProducts: productsData.length || 0,
        totalOrders: ordersData.length || 0,
        pendingDeliveries: ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length || 0,
        unreadMessages: contactsData.filter(c => !c.is_read).length || 0,
        todaySales: calculateTotal(todayOrders),
        monthSales: calculateTotal(monthOrders),
        yearSales: calculateTotal(yearOrders),
        totalRevenue: calculateTotal(ordersData)
      });

      generateSalesData(ordersData);
      
      const statusCounts = ordersData.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      setOrderStatusData([
        { name: 'Pending', value: statusCounts.pending || 0, color: '#f59e0b' },
        { name: 'Processing', value: statusCounts.processing || 0, color: '#3b82f6' },
        { name: 'Shipped', value: statusCounts.shipped || 0, color: '#8b5cf6' },
        { name: 'Delivered', value: statusCounts.delivered || 0, color: '#10b981' },
        { name: 'Cancelled', value: statusCounts.cancelled || 0, color: '#ef4444' }
      ]);

      setRecentOrders(ordersData.slice(0, 6));
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
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourStr = hour.getHours().toString().padStart(2, '0');
        const sales = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.getHours() === hour.getHours() && orderDate.getDate() === hour.getDate();
        }).reduce((sum, o) => sum + (o.total || 0), 0);
        data.push({ name: `${hourStr}:00`, sales });
      }
    } else if (selectedPeriod === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const sales = orders.filter(o => o.created_at?.startsWith(dateStr))
          .reduce((sum, o) => sum + (o.total || 0), 0);
        data.push({ name: date.getDate().toString(), sales });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toISOString().slice(0, 7);
        const sales = orders.filter(o => o.created_at?.startsWith(monthStr))
          .reduce((sum, o) => sum + (o.total || 0), 0);
        data.push({ name: date.toLocaleString('default', { month: 'short' }), sales });
      }
    }
    setSalesData(data);
  };

  const StatCard = ({ icon: Icon, title, value, trend, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-[2rem] p-6 group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110 duration-500 bg-current ${color}`} />
      
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-current`}>
          <Icon size={24} className={color} />
        </div>
        <div className="flex items-center space-x-1 text-xs font-bold">
          {trend > 0 ? (
            <span className="text-emerald-500 flex items-center bg-emerald-500/10 px-2 py-1 rounded-lg">
              <TrendingUp size={12} className="mr-1" /> +{trend}%
            </span>
          ) : (
            <span className="text-rose-500 flex items-center bg-rose-500/10 px-2 py-1 rounded-lg">
              <ArrowDownRight size={12} className="mr-1" /> {trend}%
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold mt-1 dark:text-white tabular-nums">
          {typeof value === 'number' && title.toLowerCase().includes('sales') ? `$${value.toLocaleString()}` : value}
        </h3>
      </div>
      
      <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex -space-x-2 mr-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
        <span>Increased by 12% this week</span>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-[#0f111a]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin-slow"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Good Morning, {adminUser?.username}! 👋</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Calendar size={18} className="mr-2 text-indigo-500" /> Jan 31, 2026
            </button>
            <button className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-600/20">
              <Filter size={18} className="mr-2" /> Filters
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={ShoppingBag} 
            title="Total Sales" 
            value={stats.todaySales} 
            trend={12.5} 
            color="text-indigo-600" 
            delay={0.1}
          />
          <StatCard 
            icon={Users} 
            title="Customers" 
            value={1240} 
            trend={8.2} 
            color="text-blue-600" 
            delay={0.2}
          />
          <StatCard 
            icon={ShoppingBag} 
            title="Orders" 
            value={stats.totalOrders} 
            trend={-2.4} 
            color="text-emerald-600" 
            delay={0.3}
          />
          <StatCard 
            icon={MessageSquare} 
            title="Messages" 
            value={stats.unreadMessages} 
            trend={5.7} 
            color="text-rose-600" 
            delay={0.4}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold dark:text-white">Revenue Analytics</h2>
                <p className="text-sm text-gray-500">Track your store earnings over time</p>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                {['day', 'month', 'year'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider
                      ${selectedPeriod === p 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="var(--primary)" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8">
            <h2 className="text-xl font-bold dark:text-white mb-2">Order Status</h2>
            <p className="text-sm text-gray-500 mb-8">Distribution of current orders</p>
            
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold dark:text-white">{stats.totalOrders}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Total</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {orderStatusData.map((s, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: s.color }} />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-indigo-500 transition-colors">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold dark:text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden">
          <div className="p-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold dark:text-white">Recent Transactions</h2>
              <p className="text-sm text-gray-500">You have {recentOrders.length} orders today</p>
            </div>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              View All Orders
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    key={order.id}
                  >
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-indigo-500 font-bold text-xs">
                          #{order.id.toString().slice(-4)}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">Order #{order.id}</p>
                          <p className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="font-semibold dark:text-gray-200">{order.customer_name || 'Guest User'}</p>
                      <p className="text-[10px] text-gray-500">{order.customer_email || 'no-email@store.com'}</p>
                    </td>
                    <td>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                        ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        ${order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : ''}
                        ${order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' : ''}
                        ${order.status === 'shipped' ? 'bg-purple-500/10 text-purple-500' : ''}
                        ${order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' : ''}
                      `}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <p className="font-bold dark:text-white text-lg">${order.total?.toFixed(2)}</p>
                    </td>
                    <td>
                      <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
