import React, { useState, useEffect } from 'react';

const API_URL = 'https://smartshop-api-c3g4gefbbrakcwhs.centralindia-01.azurewebsites.net';

export default function AdminDashboard({ admin, onLogout }) {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
  return sessionStorage.getItem('activeTab') || 'overview';
});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, lowStockRes] = await Promise.all([
        fetch(`${API_URL}/api/inventory/stats`),
        fetch(`${API_URL}/api/inventory/low-stock`)
      ]);
      const statsData = await statsRes.json();
      const lowStockData = await lowStockRes.json();
      setStats(statsData);
      setLowStock(lowStockData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getStatusColor = (status) => {
    if (status === 'Out of Stock') return 'bg-red-100 text-red-700';
    if (status === 'Critical') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusDot = (status) => {
    if (status === 'Out of Stock') return 'bg-red-500';
    if (status === 'Critical') return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🛒</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800">SmartShoppingCart Admin</h1>
            <p className="text-xs text-gray-500">Welcome, {admin?.username}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'alerts'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                sessionStorage.setItem('activeTab', tab);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'overview' ? '📊 Overview' : '🔔 Alerts'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Products', value: stats.totalProducts, color: 'from-indigo-500 to-purple-600', icon: '📦' },
                    { label: 'Out of Stock', value: stats.outOfStock, color: 'from-red-500 to-red-600', icon: '❌' },
                    { label: 'Critical', value: stats.critical, color: 'from-orange-500 to-orange-600', icon: '⚠️' },
                    { label: 'Low Stock', value: stats.low, color: 'from-yellow-500 to-yellow-600', icon: '📉' },
                  ].map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
                      <div className={`w-10 h-10 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                        <span>{card.icon}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                      <p className="text-sm text-gray-500">{card.label}</p>
                    </div>
                  ))}
                </div>

                {/* Stock Health Bar */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="font-semibold text-gray-800 mb-4">Stock Health Overview</h2>
                  <div className="flex rounded-full overflow-hidden h-6 mb-3">
                    {stats.totalProducts > 0 && (
                      <>
                        <div style={{ width: `${(stats.healthy / stats.totalProducts) * 100}%` }} className="bg-green-500"></div>
                        <div style={{ width: `${(stats.low / stats.totalProducts) * 100}%` }} className="bg-yellow-500"></div>
                        <div style={{ width: `${(stats.critical / stats.totalProducts) * 100}%` }} className="bg-orange-500"></div>
                        <div style={{ width: `${(stats.outOfStock / stats.totalProducts) * 100}%` }} className="bg-red-500"></div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-4 text-sm flex-wrap">
                    {[
                      { label: 'Healthy', color: 'bg-green-500', value: stats.healthy },
                      { label: 'Low', color: 'bg-yellow-500', value: stats.low },
                      { label: 'Critical', color: 'bg-orange-500', value: stats.critical },
                      { label: 'Out of Stock', color: 'bg-red-500', value: stats.outOfStock },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-gray-600">{item.label}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div>
                {loading ? null : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-gray-800">
                        🔔 Low Stock Alerts
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-sm">
                          {lowStock.items?.length || 0}
                        </span>
                      </h2>
                      <p className="text-sm text-gray-500">Threshold: ≤ {lowStock.threshold} units</p>
                    </div>
            
                    {lowStock.items?.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-4xl mb-3">✅</p>
                        <p className="text-gray-500">All products are well stocked!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(
                          lowStock.items?.reduce((acc, item) => {
                            if (!acc[item.category]) acc[item.category] = [];
                            acc[item.category].push(item);
                            return acc;
                          }, {})
                        ).map(([category, items]) => (
                          <div key={category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <button
                              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-sm">📦</span>
                                </div>
                                <div className="text-left">
                                  <p className="font-semibold text-gray-800">{category}</p>
                                  <p className="text-sm text-gray-500">{items.length} item{items.length > 1 ? 's' : ''} need attention</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {items.some(i => i.status === 'Out of Stock') && (
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Out of Stock</span>
                                )}
                                {items.some(i => i.status === 'Critical') && (
                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Critical</span>
                                )}
                                {items.some(i => i.status === 'Low') && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Low</span>
                                )}
                                <span className="text-gray-400">{expandedCategory === category ? '▲' : '▼'}</span>
                              </div>
                            </button>
            
                            {expandedCategory === category && (
                              <div className="border-t border-gray-100 divide-y divide-gray-50">
                                {items
                                  .sort((a, b) => a.quantity - b.quantity)
                                  .map(item => (
                                    <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${
                                          item.status === 'Out of Stock' ? 'bg-red-500' :
                                          item.status === 'Critical' ? 'bg-orange-500' : 'bg-yellow-500'
                                        }`}></div>
                                        <div>
                                          <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                                          <p className="text-xs text-gray-500">{item.brand} · {item.subcategory}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                          item.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                                          item.status === 'Critical' ? 'bg-orange-100 text-orange-700' :
                                          'bg-yellow-100 text-yellow-700'
                                        }`}>
                                          {item.status}
                                        </span>
                                        <p className="text-sm font-bold text-gray-800 mt-1">{item.quantity} units</p>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
