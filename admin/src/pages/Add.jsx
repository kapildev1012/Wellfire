import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const MusicProductAdd = ({ token }) => {
  // Product Images
  const [coverImage, setCoverImage] = useState(false);
  const [albumArt, setAlbumArt] = useState(false);
  const [posterImage, setPosterImage] = useState(false);
  const [galleryImage, setGalleryImage] = useState(false);

  // Product Details
  const [productTitle, setProductTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [minimumInvestment, setMinimumInvestment] = useState("");
  const [category, setCategory] = useState("");
  const [genre, setGenre] = useState("");
  const [expectedDuration, setExpectedDuration] = useState("");
  const [artistName, setArtistName] = useState("");
  const [producerName, setProducerName] = useState("");
  const [labelName, setLabelName] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [targetAudience, setTargetAudience] = useState([]);
  const [productStatus, setProductStatus] = useState("funding");

  // Funding Progress (will be calculated from backend)
  const [currentFunding, setCurrentFunding] = useState(0);
  const [investorCount, setInvestorCount] = useState(0);

  // Audio Files
  const [demoTrack, setDemoTrack] = useState(false);
  const [fullTrack, setFullTrack] = useState(false);

  const categoryMap = {
    "Music Album": [
      "Pop",
      "Rock",
      "Hip Hop",
      "Classical",
      "Jazz",
      "Electronic",
      "Folk",
      "Country",
    ],
    "Single Track": [
      "Pop",
      "Rock",
      "Hip Hop",
      "R&B",
      "Electronic",
      "Indie",
      "Folk",
      "Reggae",
    ],
    EP: ["Alternative", "Indie", "Electronic", "Pop", "Rock", "Hip Hop"],
    "Music Video": ["Pop", "Rock", "Hip Hop", "Electronic", "R&B", "Indie"],
    "Live Concert": ["All Genres", "Pop", "Rock", "Classical", "Jazz", "Folk"],
    Documentary: ["Music Biography", "Behind the Scenes", "Concert Film"],
    Podcast: [
      "Music Talk",
      "Artist Interview",
      "Music Education",
      "Industry News",
    ],
    "Music Software": ["DAW", "VST Plugins", "Sample Libraries", "Music Apps"],
  };

  const audienceMap = {
    "Music Album": [
      "Teenagers",
      "Young Adults",
      "Adults",
      "All Ages",
      "Music Enthusiasts",
    ],
    "Single Track": [
      "Radio Listeners",
      "Streaming Users",
      "Young Adults",
      "Teenagers",
    ],
    EP: ["Indie Fans", "Genre Enthusiasts", "Young Adults", "Music Collectors"],
    "Music Video": [
      "YouTube Viewers",
      "Music TV Audience",
      "Social Media Users",
    ],
    "Live Concert": ["Concert Goers", "Local Audience", "Music Festival Fans"],
    Documentary: ["Music Historians", "Fans", "Educational Audience"],
    Podcast: ["Music Industry", "Aspiring Musicians", "Music Fans"],
    "Music Software": [
      "Producers",
      "Musicians",
      "Audio Engineers",
      "Composers",
    ],
  };

  const statusOptions = [
    "funding",
    "pre-production",
    "recording",
    "post-production",
    "marketing",
    "completed",
  ];

  // Calculate funding percentage
  const fundingPercentage =
    totalBudget > 0 ? Math.min((currentFunding / totalBudget) * 100, 100) : 0;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Product Details
      formData.append("productTitle", productTitle);
      formData.append("description", description);
      formData.append("totalBudget", totalBudget);
      formData.append("minimumInvestment", minimumInvestment);
      formData.append("category", category);
      formData.append("genre", genre);
      formData.append("expectedDuration", expectedDuration);
      formData.append("artistName", artistName);
      formData.append("producerName", producerName);
      formData.append("labelName", labelName);
      formData.append("isFeatured", isFeatured);
      formData.append("isActive", isActive);
      formData.append("productStatus", productStatus);
      formData.append("targetAudience", JSON.stringify(targetAudience));

      // Images
      coverImage && formData.append("coverImage", coverImage);
      albumArt && formData.append("albumArt", albumArt);
      posterImage && formData.append("posterImage", posterImage);
      galleryImage && formData.append("galleryImage", galleryImage);

      // Audio Files
      demoTrack && formData.append("demoTrack", demoTrack);
      fullTrack && formData.append("fullTrack", fullTrack);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setProductTitle("");
    setDescription("");
    setTotalBudget("");
    setMinimumInvestment("");
    setCategory("");
    setGenre("");
    setExpectedDuration("");
    setArtistName("");
    setProducerName("");
    setLabelName("");
    setCoverImage(false);
    setAlbumArt(false);
    setPosterImage(false);
    setGalleryImage(false);
    setDemoTrack(false);
    setFullTrack(false);
    setTargetAudience([]);
    setProductStatus("funding");
    setIsFeatured(false);
    setIsActive(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Funding Progress Bar */}
      {totalBudget > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Funding Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${fundingPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{currentFunding.toLocaleString()} raised</span>
            <span>{fundingPercentage.toFixed(1)}%</span>
            <span>₹{parseInt(totalBudget).toLocaleString()} target</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {investorCount} investors
          </p>
        </div>
      )}

      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Upload Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Product Media</h3>

          {/* Images */}
          <div className="mb-4">
            <p className="mb-3 font-medium">Upload Images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  state: coverImage,
                  setter: setCoverImage,
                  id: "cover",
                  label: "Cover Image",
                },
                {
                  state: albumArt,
                  setter: setAlbumArt,
                  id: "album",
                  label: "Album Art",
                },
                {
                  state: posterImage,
                  setter: setPosterImage,
                  id: "poster",
                  label: "Poster",
                },
                {
                  state: galleryImage,
                  setter: setGalleryImage,
                  id: "gallery",
                  label: "Gallery",
                },
              ].map(({ state, setter, id, label }) => (
                <div key={id} className="text-center">
                  <label htmlFor={id} className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                      <img
                        className="w-full h-20 object-cover rounded"
                        src={
                          !state
                            ? assets.upload_area
                            : URL.createObjectURL(state)
                        }
                        alt=""
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{label}</p>
                  </label>
                  <input
                    onChange={(e) => setter(e.target.files[0])}
                    type="file"
                    id={id}
                    accept="image/*"
                    hidden
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Audio Files */}
          <div>
            <p className="mb-3 font-medium">Upload Audio Files</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  state: demoTrack,
                  setter: setDemoTrack,
                  id: "demo",
                  label: "Demo Track",
                },
                {
                  state: fullTrack,
                  setter: setFullTrack,
                  id: "full",
                  label: "Full Track (Optional)",
                },
              ].map(({ state, setter, id, label }) => (
                <div key={id}>
                  <label htmlFor={id} className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors text-center">
                      <div className="text-gray-500">
                        {state ? (
                          <div>
                            <span className="text-green-600">✓</span>{" "}
                            {state.name}
                          </div>
                        ) : (
                          <div>
                            <span className="text-2xl">🎵</span>
                            <p className="mt-1">{label}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                  <input
                    onChange={(e) => setter(e.target.files[0])}
                    type="file"
                    id={id}
                    accept="audio/*"
                    hidden
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <h3 className="text-lg font-semibold">Product Details</h3>

          {/* Product Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your music product..."
              required
            />
          </div>

          {/* Artists and Producers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Artist Name
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Artist name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producer Name
              </label>
              <input
                type="text"
                value={producerName}
                onChange={(e) => setProducerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Producer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label Name
              </label>
              <input
                type="text"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Record label"
              />
            </div>
          </div>
        </div>

        {/* Categories and Budget */}
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <h3 className="text-lg font-semibold">Category & Funding</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setGenre("");
                  setTargetAudience([]);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {Object.keys(categoryMap).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  setTargetAudience([]);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!category}
                required
              >
                <option value="">Select Genre</option>
                {category &&
                  categoryMap[category].map((gen) => (
                    <option key={gen} value={gen}>
                      {gen}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Budget (₹)
              </label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10,00,000"
                required
              />
            </div>

            {/* Minimum Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min. Investment (₹)
              </label>
              <input
                type="number"
                value={minimumInvestment}
                onChange={(e) => setMinimumInvestment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10,000"
                required
              />
            </div>

            {/* Expected Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Duration
              </label>
              <input
                type="text"
                value={expectedDuration}
                onChange={(e) => setExpectedDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3 months"
              />
            </div>
          </div>

          {/* Product Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Status
            </label>
            <select
              value={productStatus}
              onChange={(e) => setProductStatus(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Audience */}
        {category && genre && audienceMap[category] && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
            <div className="flex flex-wrap gap-2">
              {audienceMap[category].map((audience) => (
                <div
                  key={audience}
                  onClick={() =>
                    setTargetAudience((prev) =>
                      prev.includes(audience)
                        ? prev.filter((item) => item !== audience)
                        : [...prev, audience]
                    )
                  }
                  className={`px-3 py-2 rounded-full cursor-pointer text-sm transition-colors ${
                    targetAudience.includes(audience)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {audience}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Product Settings</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={() => setIsFeatured(!isFeatured)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Feature Product
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active for Investment
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default MusicProductAdd;
