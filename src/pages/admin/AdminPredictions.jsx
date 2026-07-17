import React, { useState, useEffect } from 'react';
import AdminLayout from '../../component/AdminLayout';
import { Trophy, Search, Trash2, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { BaseTable } from '../../components/shadcn-custom/BaseTable';
import { BaseDropdown } from '../../components/shadcn-custom/BaseDropdown';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage] = useState(25);

  useEffect(() => {
    loadPredictions();
  }, []);

  useEffect(() => {
    setSearchParams(prev => {
      if (currentPage === 1) prev.delete('page');
      else prev.set('page', currentPage);
      return prev;
    }, { replace: true });
  }, [currentPage, setSearchParams]);

  const loadPredictions = () => {
    setLoading(true);
    setTimeout(() => {
      const data = JSON.parse(localStorage.getItem('predictionsData') || '[]');
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPredictions(data);
      setLoading(false);
    }, 300); // simulate network
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this prediction!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = predictions.filter(p => p.id !== id);
        localStorage.setItem('predictionsData', JSON.stringify(updated));
        setPredictions(updated);
        Swal.fire('Deleted!', 'The prediction has been deleted.', 'success');
      }
    });
  };

  const filteredPredictions = predictions.filter(pred => {
    const matchesSearch = 
      pred.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pred.phone.includes(searchQuery);
    const matchesTeam = filterTeam === 'all' || pred.winner.toLowerCase() === filterTeam.toLowerCase();
    return matchesSearch && matchesTeam;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPredictions = filteredPredictions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    return Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);
  };

  const tableHeaders = [
    { label: '#' },
    { label: 'Participant' },
    { label: 'Predicted Score' },
    { label: 'Champion' },
    { label: 'Date' },
    { label: 'Actions', className: 'text-center' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 px-4 md:px-8 py-6 w-full max-w-[1600px] mx-auto">
        <div className="bg-card text-card-foreground rounded-3xl shadow-md border border-border overflow-hidden">
          
          <div className="p-6 border-b border-border space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center">
                  <Trophy className="mr-3 text-primary" />
                  World Cup 2026 Predictions
                </h1>
                <p className="text-muted-foreground text-sm mt-1">View and manage all user submitted predictions.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                <h3 className="text-muted-foreground text-sm font-medium">Total Predictions</h3>
                <p className="text-3xl font-bold text-foreground mt-2">{predictions.length}</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                <h3 className="text-muted-foreground text-sm font-medium">Spain to Win</h3>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {predictions.filter(p => p.winner === 'Spain').length}
                </p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                <h3 className="text-muted-foreground text-sm font-medium">Argentina to Win</h3>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {predictions.filter(p => p.winner === 'Argentina').length}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative bg-muted/30 p-3 rounded-xl border border-border/50">
              <div className="relative group w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-sm transition-all outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex items-center bg-background border border-border rounded-lg px-3 py-2">
                  <Layers size={14} className="text-muted-foreground mr-2" />
                  <select 
                    value={filterTeam}
                    onChange={(e) => {
                      setFilterTeam(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent border-none text-sm text-foreground outline-none cursor-pointer pr-4 uppercase tracking-wider font-semibold"
                  >
                    <option value="all">All Teams</option>
                    <option value="spain">Spain</option>
                    <option value="argentina">Argentina</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-0">
            <BaseTable 
              headers={tableHeaders} 
              isLoading={loading} 
              skeletonCount={5}
              data={paginatedPredictions}
              emptyMessage="No predictions found."
              emptySubMessage="Adjust your search or wait for new submissions."
              renderRow={(pred, i) => (
                <tr key={pred.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-6 align-middle text-sm text-muted-foreground font-medium">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  
                  {/* Participant Info */}
                  <td className="px-2 py-6 align-middle">
                    <p className="font-bold text-foreground text-sm">{pred.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{pred.phone}</p>
                  </td>
                  
                  {/* Predicted Score */}
                  <td className="px-2 py-6 align-middle">
                    <div className="inline-flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
                      <span className="font-semibold text-foreground text-sm">Spain {pred.score1} - {pred.score2} Arg</span>
                    </div>
                    {pred.isDraw && (
                      <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1.5">
                        Penalties: {pred.penaltyScore1} - {pred.penaltyScore2}
                      </p>
                    )}
                  </td>
                  
                  {/* Champion */}
                  <td className="px-2 py-6 align-middle">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      pred.winner === 'Spain' 
                        ? 'bg-red-500/10 text-red-600 border-red-500/30'
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                    }`}>
                      {pred.winner}
                    </span>
                  </td>
                  
                  {/* Date */}
                  <td className="px-2 py-6 align-middle">
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(pred.date).toLocaleDateString()}
                    </p>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-6 align-middle text-center flex justify-center">
                    <BaseDropdown 
                      label="Actions"
                      items={[
                        { 
                          label: 'Delete Prediction', 
                          onClick: () => handleDelete(pred.id),
                          icon: <Trash2 size={14} className="mr-2 text-destructive" />,
                          className: 'text-destructive focus:text-destructive'
                        }
                      ]}
                    />
                  </td>
                </tr>
              )}
            />
          </div>

          {!loading && filteredPredictions.length > 0 && (
            <div className="p-4 border-t border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground font-medium">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPredictions.length)} of {filteredPredictions.length} predictions
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-1">
                  {getPageNumbers().map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        currentPage === number 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-foreground hover:bg-muted border border-transparent'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPredictions;
