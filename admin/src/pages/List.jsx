import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const ListInvestmentProducts = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    featured: "",
    active: "",
  });

  // Modal states
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fundingData, setFundingData] = useState({
    currentFunding: 0,
    totalInvestors: 0,
    fundingDeadline: "",
    fundingStatus: "active",
  });

  // Analytics states
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalFunding: 0,
    activeFunding: 0,
    completedProjects: 0,
    averageFunding: 0,
  });

  // View mode
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"

  // Fetch products with enhanced filtering
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 15,
        search: searchTerm,
        ...filters,
      });

      const response = await axios.get(
        `${backendUrl}/api/investment-product/list?${params}`,
        { headers: { token } }
      );

      if (response.data.success) {
        setProducts(response.data.products);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/investment-product/admin/analytics`,
        { headers: { token } }
      );

      if (response.data.success) {
        setAnalytics(response.data.analytics.overview || {});
      }
    } catch (error) {
      console.error("Fetch analytics error:", error);
    }
  };

  // Update product actions
  const updateProductStatus = async (productId, status) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/investment-product/${productId}`,
        { productStatus: status },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product status updated successfully");
        fetchProducts(currentPage);
        fetchAnalytics();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleFeatured = async (productId, isFeatured) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/investment-product/${productId}`,
        { isFeatured: !isFeatured },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(isFeatured ? "Product unfeatured" : "Product featured");
        fetchProducts(currentPage);
      }
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  const toggleActive = async (productId, isActive) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/investment-product/${productId}`,
        { isActive: !isActive },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(isActive ? "Product deactivated" : "Product activated");
        fetchProducts(currentPage);
      }
    } catch (error) {
      toast.error("Failed to update active status");
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/investment-product/${productId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProducts(currentPage);
        fetchAnalytics();
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const calculateFundingPercentage = (current, total) => {
    if (total <= 0) return 0;
    return Math.min((current / total) * 100, 100);
  };

  const getStatusColor = (status) => {
    const colors = {
      funding: "bg-blue-500",
      "in-production": "bg-orange-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const openFundingModal = (product) => {
    setSelectedProduct(product);
    setFundingData({
      currentFunding: product.currentFunding || 0,
      totalInvestors: product.totalInvestors || 0,
      fundingDeadline: product.fundingDeadline || "",
      fundingStatus: product.fundingStatus || "active",
    });
    setShowFundingModal(true);
  };

  const openDetailsModal = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investment Products</h1>
              <p className="text-gray-600 mt-1">Manage your investment portfolio</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {viewMode === "grid" ? "📋 Table View" : "🎯 Grid View"}
              </button>
              <button
                onClick={() => (window.location.href = "/add")}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                ➕ Add New Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">📊</span>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Total Products</p>
                <p className="text-xl font-bold text-blue-600">{analytics.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">💰</span>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Total Funding</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(analytics.totalFunding || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-xl">🚀</span>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Active Funding</p>
                <p className="text-xl font-bold text-orange-600">{analytics.activeFunding}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Completed</p>
                <p className="text-xl font-bold text-purple-600">{analytics.completedProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-xl">📈</span>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Avg Funding</p>
                <p className="text-xl font-bold text-indigo-600">{formatCurrency(analytics.averageFunding || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by title, artist, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-lg">🔍</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                <option value="Music">🎵 Music</option>
                <option value="Film">🎬 Film</option>
                <option value="Documentary">📹 Documentary</option>
                <option value="Web Series">📺 Web Series</option>
                <option value="Other">📦 Other</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Status</option>
                <option value="funding">💰 Funding</option>
                <option value="in-production">🚧 In Production</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>

              <select
                value={filters.featured}
                onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Products</option>
                <option value="true">⭐ Featured Only</option>
                <option value="false">📋 Not Featured</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200">
                  {product.coverImage ? (
                    <img
                      src={product.coverImage}
                      alt={product.productTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl">🎵</span>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(product.productStatus)}`}>
                      {product.productStatus}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                      {product.productTitle}
                    </h3>
                    <p className="text-gray-600 text-sm">by {product.artistName}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-blue-600">
                        {calculateFundingPercentage(product.currentFunding || 0, product.totalBudget).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${calculateFundingPercentage(product.currentFunding || 0, product.totalBudget)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{formatCurrency(product.currentFunding || 0)} raised</span>
                      <span>Goal: {formatCurrency(product.totalBudget)}</span>
                    </div>
                  </div>

                  {/* Category & Genre Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                      {product.category}
                    </span>
                    {product.genre && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                        {product.genre}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDetailsModal(product)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      👁️ View Details
                    </button>
                    <button
                      onClick={() => openFundingModal(product)}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      💰 Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table View
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Funding</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img
                            src={product.coverImage || "/placeholder.png"}
                            alt={product.productTitle}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{product.productTitle}</div>
                            <div className="text-sm text-gray-600">by {product.artistName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(product.productStatus)}`}>
                          {product.productStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="font-semibold text-green-600">
                            {formatCurrency(product.currentFunding || 0)}
                          </div>
                          <div className="text-gray-600">
                            of {formatCurrency(product.totalBudget)}
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-green-500 h-1 rounded-full"
                              style={{
                                width: `${calculateFundingPercentage(product.currentFunding || 0, product.totalBudget)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailsModal(product)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openFundingModal(product)}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs hover:bg-green-200"
                          >
                            Manage
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button
                onClick={() => fetchProducts(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                ← Previous
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => fetchProducts(page)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => fetchProducts(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => (window.location.href = "/add")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Funding Management Modal */}
      {showFundingModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                💰 Manage Funding
              </h3>
              <button
                onClick={() => setShowFundingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-lg">{selectedProduct.productTitle}</h4>
              <p className="text-gray-600">by {selectedProduct.artistName}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Funding (₹)
                </label>
                <input
                  type="number"
                  value={fundingData.currentFunding}
                  onChange={(e) =>
                    setFundingData({
                      ...fundingData,
                      currentFunding: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max={selectedProduct.totalBudget}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Investors
                </label>
                <input
                  type="number"
                  value={fundingData.totalInvestors}
                  onChange={(e) =>
                    setFundingData({
                      ...fundingData,
                      totalInvestors: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Funding Deadline
                </label>
                <input
                  type="date"
                  value={fundingData.fundingDeadline}
                  onChange={(e) =>
                    setFundingData({
                      ...fundingData,
                      fundingDeadline: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Funding Status
                </label>
                <select
                  value={fundingData.fundingStatus}
                  onChange={(e) =>
                    setFundingData({
                      ...fundingData,
                      fundingStatus: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">🟢 Active</option>
                  <option value="paused">⏸️ Paused</option>
                  <option value="completed">✅ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>

              {/* Progress Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-3">📊 Progress Preview</p>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress:</span>
                  <span className="font-semibold text-blue-600">
                    {calculateFundingPercentage(
                      fundingData.currentFunding,
                      selectedProduct.totalBudget
                    ).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${calculateFundingPercentage(
                        fundingData.currentFunding,
                        selectedProduct.totalBudget
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Raised: {formatCurrency(fundingData.currentFunding)}</span>
                  <span>Goal: {formatCurrency(selectedProduct.totalBudget)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  // updateFundingProgress(selectedProduct._id, fundingData);
                  setShowFundingModal(false);
                  toast.success("Funding updated successfully!");
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold"
              >
                💾 Update Funding
              </button>
              <button
                onClick={() => setShowFundingModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedProduct.productTitle}
                  </h3>
                  <p className="text-gray-600">by {selectedProduct.artistName}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Images and Media */}
                <div className="space-y-6">
                  {/* Cover Image */}
                  {selectedProduct.coverImage && (
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">🖼️ Cover Image</h4>
                      <img
                        src={selectedProduct.coverImage}
                        alt="Cover"
                        className="w-full h-64 object-cover rounded-xl border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Gallery Images */}
                  {selectedProduct.galleryImages && selectedProduct.galleryImages.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">
                        🖼️ Gallery ({selectedProduct.galleryImages.length} images)
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProduct.galleryImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media Links */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">🎵 Media Assets</h4>
                    <div className="space-y-2">
                      {selectedProduct.youtubeLink && (
                        <a
                          href={selectedProduct.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <span className="text-xl">📺</span>
                          <span className="font-medium">Watch on YouTube</span>
                        </a>
                      )}
                      {selectedProduct.demoTrack && (
                        <a
                          href={selectedProduct.demoTrack}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <span className="text-xl">🎵</span>
                          <span className="font-medium">Listen to Demo Track</span>
                        </a>
                      )}
                      {selectedProduct.fullTrack && (
                        <a
                          href={selectedProduct.fullTrack}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <span className="text-xl">🎼</span>
                          <span className="font-medium">Full Track</span>
                        </a>
                      )}
                      {selectedProduct.videoFile && (
                        <a
                          href={selectedProduct.videoFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <span className="text-xl">🎬</span>
                          <span className="font-medium">Video File</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-3 text-gray-900">📋 Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Artist:</span>
                        <span className="font-medium">{selectedProduct.artistName}</span>
                      </div>
                      {selectedProduct.producerName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Producer:</span>
                          <span className="font-medium">{selectedProduct.producerName}</span>
                        </div>
                      )}
                      {selectedProduct.labelName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Label:</span>
                          <span className="font-medium">{selectedProduct.labelName}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {selectedProduct.category}
                        </span>
                      </div>
                      {selectedProduct.genre && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Genre:</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {selectedProduct.genre}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">📝 Description</h4>
                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Funding Details */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold mb-4 text-gray-900">💰 Funding Details</h4>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-bold text-blue-600">
                          {calculateFundingPercentage(
                            selectedProduct.currentFunding || 0,
                            selectedProduct.totalBudget
                          ).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${calculateFundingPercentage(
                              selectedProduct.currentFunding || 0,
                              selectedProduct.totalBudget
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Budget:</span>
                        <span className="font-bold text-lg">{formatCurrency(selectedProduct.totalBudget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Funding:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(selectedProduct.currentFunding || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(selectedProduct.totalBudget - (selectedProduct.currentFunding || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Investment:</span>
                        <span className="font-medium">{formatCurrency(selectedProduct.minimumInvestment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Investors:</span>
                        <span className="font-semibold text-blue-600">
                          {selectedProduct.totalInvestors || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Target Audience */}
                  {selectedProduct.targetAudience && selectedProduct.targetAudience.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">🎯 Target Audience</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.targetAudience.map((audience, idx) => (
                          <span
                            key={idx}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status and Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">⚙️ Settings</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${selectedProduct.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-sm">{selectedProduct.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${selectedProduct.isFeatured ? 'bg-yellow-500' : 'bg-gray-300'}`}></span>
                          <span className="text-sm">{selectedProduct.isFeatured ? 'Featured' : 'Not Featured'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">📅 Dates</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>Created: {new Date(selectedProduct.createdAt).toLocaleDateString()}</div>
                        <div>Updated: {new Date(selectedProduct.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        openFundingModal(selectedProduct);
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold"
                    >
                      💰 Manage Funding
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => toggleFeatured(selectedProduct._id, selectedProduct.isFeatured)}
                        className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                          selectedProduct.isFeatured
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {selectedProduct.isFeatured ? "⭐ Unfeature" : "⭐ Feature"}
                      </button>
                      
                      <button
                        onClick={() => toggleActive(selectedProduct._id, selectedProduct.isActive)}
                        className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                          selectedProduct.isActive
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {selectedProduct.isActive ? "🔴 Deactivate" : "🟢 Activate"}
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this product?")) {
                          handleDelete(selectedProduct._id);
                          setShowDetailsModal(false);
                        }
                      }}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                    >
                      🗑️ Delete Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && products.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListInvestmentProducts;