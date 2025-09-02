import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MusicProjectList = ({ token }) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const response = await axios.delete(
        `${backendUrl}/api/product/remove/${id}`,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing project:", error);
      toast.error("Failed to remove project");
    }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        { isActive: !currentStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Project status updated");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const toggleFeaturedStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        { isFeatured: !currentStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Featured status updated");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filter and sort logic
  const filteredList = list
    .filter((item) => {
      const matchesSearch =
        item.productTitle?.toLowerCase().includes(search.toLowerCase()) ||
        item.artistName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.productStatus === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return (a.totalBudget || 0) - (b.totalBudget || 0);
      } else {
        return (b.totalBudget || 0) - (a.totalBudget || 0);
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "funding":
        return "bg-blue-100 text-blue-800";
      case "pre-production":
        return "bg-yellow-100 text-yellow-800";
      case "recording":
        return "bg-red-100 text-red-800";
      case "post-production":
        return "bg-purple-100 text-purple-800";
      case "marketing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case "funding":
        return "💰";
      case "pre-production":
        return "📅";
      case "recording":
        return "🎙️";
      case "post-production":
        return "⚙️";
      case "marketing":
        return "📢";
      case "completed":
        return "✅";
      default:
        return "❓";
    }
  };

  const calculateFundingPercentage = (current, total) => {
    if (!total || total === 0) return 0;
    return Math.min((current / total) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const uniqueStatuses = [
    ...new Set(list.map((item) => item.productStatus)),
  ].filter(Boolean);
  const uniqueCategories = [
    ...new Set(list.map((item) => item.category)),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Music Projects
          </h1>
          <p className="text-lg text-gray-600">
            Manage your music investment projects
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or artist..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getStatusEmoji(status)}{" "}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by Budget
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredList.length} of {list.length} projects
            </p>
            <div className="flex gap-2">
              <button
                onClick={fetchList}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>🔄</span> Refresh
              </button>
              <button
                onClick={() => navigate("/add")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>➕</span> Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredList.map((project, index) => {
              const fundingPercentage = calculateFundingPercentage(
                project.currentFunding,
                project.totalBudget
              );

              return (
                <div
                  key={project._id || index}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.productTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-6xl text-white opacity-50">
                          🎵
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        project.productStatus
                      )}`}
                    >
                      {getStatusEmoji(project.productStatus)}{" "}
                      {project.productStatus?.charAt(0).toUpperCase() +
                        project.productStatus?.slice(1)}
                    </div>

                    {/* Featured Badge */}
                    {project.isFeatured && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                        {project.productTitle || "Untitled Project"}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span>👤</span> {project.artistName || "Unknown Artist"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {project.category} • {project.genre}
                      </p>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Funding Progress</span>
                        <span>{fundingPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(fundingPercentage, 2)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          {formatCurrency(project.currentFunding || 0)} raised
                        </span>
                        <span>
                          {formatCurrency(project.totalBudget || 0)} goal
                        </span>
                      </div>
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <p className="font-medium">Min. Investment</p>
                        <p>{formatCurrency(project.minimumInvestment || 0)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Duration</p>
                        <p>{project.expectedDuration || "Not specified"}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          toggleActiveStatus(project._id, project.isActive)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          project.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {project.isActive ? "👁️ Active" : "🚫 Inactive"}
                      </button>

                      <button
                        onClick={() =>
                          toggleFeaturedStatus(project._id, project.isFeatured)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          project.isFeatured
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {project.isFeatured ? "⭐ Featured" : "☆ Feature"}
                      </button>

                      <button
                        onClick={() => removeProduct(project._id)}
                        className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    {/* Created Date */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(
                          project.createdAt || project.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicProjectList;
