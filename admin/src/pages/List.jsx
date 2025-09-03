import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ListInvestmentProducts = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    featured: "",
    active: "true",
  });

  // Fetch products
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
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

  // Delete product
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Get YouTube video ID
  const getYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Investment Products</h2>
        <button
          onClick={() => (window.location.href = "/add-investment-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded border mb-6">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="px-3 py-2 border rounded"
          >
            <option value="">All Categories</option>
            <option value="Music">Music</option>
            <option value="Film">Film</option>
            <option value="Documentary">Documentary</option>
            <option value="Web Series">Web Series</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="funding">Funding</option>
            <option value="in-production">In Production</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.featured}
            onChange={(e) =>
              setFilters({ ...filters, featured: e.target.value })
            }
            className="px-3 py-2 border rounded"
          >
            <option value="">All Products</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>

          <select
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
            className="px-3 py-2 border rounded"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white border rounded-lg p-6 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Product Images */}
              <div className="space-y-3">
                {product.coverImage && (
                  <div>
                    <p className="text-sm font-medium mb-1">Cover Image</p>
                    <img
                      src={product.coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}

                {product.videoThumbnail && (
                  <div>
                    <p className="text-sm font-medium mb-1">Video Thumbnail</p>
                    <img
                      src={product.videoThumbnail}
                      alt="Video Thumbnail"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}

                {product.galleryImages && product.galleryImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Gallery ({product.galleryImages.length})
                    </p>
                    <div className="flex gap-1 overflow-x-auto">
                      {product.galleryImages.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded border flex-shrink-0"
                        />
                      ))}
                      {product.galleryImages.length > 3 && (
                        <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-xs">
                          +{product.galleryImages.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {product.productTitle}
                    </h3>
                    <p className="text-gray-600">{product.artistName}</p>
                    {product.producerName && (
                      <p className="text-sm text-gray-500">
                        Producer: {product.producerName}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {product.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        product.productStatus === "funding"
                          ? "bg-blue-100 text-blue-800"
                          : product.productStatus === "in-production"
                          ? "bg-orange-100 text-orange-800"
                          : product.productStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.productStatus}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm line-clamp-3">
                  {product.description}
                </p>

                <div className="flex gap-4 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  {product.genre && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {product.genre}
                    </span>
                  )}
                </div>

                {/* Media Links */}
                <div className="flex gap-4 text-sm">
                  {product.youtubeLink && (
                    <a
                      href={product.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline"
                    >
                      📺 YouTube
                    </a>
                  )}
                  {product.demoTrack && (
                    <a
                      href={product.demoTrack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      🎵 Demo Track
                    </a>
                  )}
                  {product.videoFile && (
                    <a
                      href={product.videoFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      🎬 Video File
                    </a>
                  )}
                </div>
              </div>

              {/* Funding Info */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Funding Progress</span>
                    <span className="font-semibold">
                      {product.fundingPercentage}%
                    </span>
                  </div>

                  {/* Funding Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(product.fundingPercentage, 100)}%`,
                      }}
                    ></div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Raised:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(product.raisedAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Budget:</span>
                      <span className="font-semibold">
                        {formatCurrency(product.totalBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(product.remainingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Investment:</span>
                      <span className="text-gray-600">
                        {formatCurrency(product.minimumInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investors:</span>
                      <span className="font-semibold text-blue-600">
                        {product.totalInvestors || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      (window.location.href = `/investment-product/${product._id}`)
                    }
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `/edit-investment-product/${product._id}`)
                    }
                    className="bg-yellow-600 text-white px-3 py-2 rounded text-sm hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* YouTube Embed */}
            {product.youtubeLink && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">YouTube Preview</p>
                <div className="aspect-video max-w-md">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      product.youtubeLink
                    )}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchProducts(page)}
                className={`px-3 py-2 border rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No investment products found.</p>
        </div>
      )}
    </div>
  );
};

export default ListInvestmentProducts;
