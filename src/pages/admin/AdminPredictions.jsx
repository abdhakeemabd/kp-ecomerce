import React, { useState, useEffect } from 'react';
import AdminLayout from '../../component/AdminLayout';
import { Trophy, Calendar, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load predictions from localStorage
    const data = JSON.parse(localStorage.getItem('predictionsData') || '[]');
    // Sort by newest first
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setPredictions(data);
  }, []);

  const filteredPredictions = predictions.filter(pred => 
    pred.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pred.phone.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-orange-500" />
              World Cup 2026 Predictions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              View and manage all user submitted predictions.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Predictions</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{predictions.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Spain to Win</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {predictions.filter(p => p.winner === 'Spain').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Argentina to Win</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {predictions.filter(p => p.winner === 'Argentina').length}
            </p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                  <th className="p-4 font-medium">Participant</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium text-center">Predicted Score</th>
                  <th className="p-4 font-medium text-center">Champion</th>
                  <th className="p-4 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredPredictions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No predictions found.
                    </td>
                  </tr>
                ) : (
                  filteredPredictions.map((pred, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={pred.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-white">{pred.name}</div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {pred.phone}
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-gray-200">Spain {pred.score1} - {pred.score2} Arg</span>
                        </div>
                        {pred.isDraw && (
                          <div className="text-xs text-orange-500 mt-1 font-medium">
                            Penalties: {pred.penaltyScore1} - {pred.penaltyScore2}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          pred.winner === 'Spain' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {pred.winner}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(pred.date).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminPredictions;
