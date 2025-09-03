import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

// Define backend URL - you can move this to a config file
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AddInvestmentProduct = ({ token }) => {
  // Basic Images - initialize as null instead of false
  const [coverImage, setCoverImage] = useState(null);
  const [albumArt, setAlbumArt] = useState(null);
  const [posterImage, setPosterImage] = useState(null);

  // Gallery Images (Multiple)
  const [galleryImages, setGalleryImages] = useState([]);

  // Video
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");

  // Audio
  const [demoTrack, setDemoTrack] = useState(null);
  const [fullTrack, setFullTrack] = useState(null);

  // Form Fields
  const [productTitle, setProductTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artistName, setArtistName] = useState("");
  const [producerName, setProducerName] = useState("");
  const [labelName, setLabelName] = useState("");
  const [category, setCategory] = useState("");
  const [genre, setGenre] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [minimumInvestment, setMinimumInvestment] = useState("");
  const [expectedDuration, setExpectedDuration] = useState("");
  const [productStatus, setProductStatus] = useState("funding");
  const [targetAudience, setTargetAudience] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // ✅ Categories and Genres
  const categoryOptions = [
    "Music",
    "Films",
    "upcoming projects",
    "live production projects",
    "commercial",
    "Documentary",
    "Web Series",
    "Other",
  ];
  const genreOptions = [
    "Pop",
    "Rock",
    "Classical",
    "Jazz",
    "Hip-Hop",
    "Electronic",
    "Folk",
    "Country",
    "R&B",
    "Indie",
    "Other",
  ];
  const statusOptions = ["funding", "in-production", "completed", "cancelled"];
  const audienceOptions = [
    "Youth",
    "Adults",
    "Children",
    "Seniors",
    "Global",
    "Regional",
  ];

  // Handle Gallery Images
  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(files);
  };

  // Handle Target Audience
  const handleAudienceChange = (audience) => {
    if (targetAudience.includes(audience)) {
      setTargetAudience(targetAudience.filter((item) => item !== audience));
    } else {
      setTargetAudience([...targetAudience, audience]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!token) {
      toast.error("Please login to add products");
      return;
    }

    // Enhanced validation
    if (
      !productTitle.trim() ||
      !description.trim() ||
      !artistName.trim() ||
      !totalBudget ||
      !minimumInvestment ||
      !category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Validate budget values
    if (parseFloat(totalBudget) <= 0 || parseFloat(minimumInvestment) <= 0) {
      toast.error("Budget and investment amounts must be greater than 0");
      return;
    }

    if (parseFloat(minimumInvestment) > parseFloat(totalBudget)) {
      toast.error("Minimum investment cannot be greater than total budget");
      return;
    }

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("productTitle", productTitle.trim());
      formData.append("description", description.trim());
      formData.append("artistName", artistName.trim());
      formData.append("producerName", producerName.trim());
      formData.append("labelName", labelName.trim());
      formData.append("category", category);
      formData.append("genre", genre);
      formData.append("totalBudget", totalBudget);
      formData.append("minimumInvestment", minimumInvestment);
      formData.append("expectedDuration", expectedDuration.trim());
      formData.append("productStatus", productStatus);
      formData.append("targetAudience", JSON.stringify(targetAudience));
      formData.append("isFeatured", isFeatured);
      formData.append("isActive", isActive);
      formData.append("youtubeLink", youtubeLink.trim());

      // Single file uploads - only append if file exists
      if (coverImage) formData.append("coverImage", coverImage);
      if (albumArt) formData.append("albumArt", albumArt);
      if (posterImage) formData.append("posterImage", posterImage);
      if (videoThumbnail) formData.append("videoThumbnail", videoThumbnail);
      if (videoFile) formData.append("videoFile", videoFile);
      if (demoTrack) formData.append("demoTrack", demoTrack);
      if (fullTrack) formData.append("fullTrack", fullTrack);

      // Multiple gallery images
      galleryImages.forEach((image) => {
        formData.append("galleryImages", image);
      });

      const response = await axios.post(
        `${backendUrl}/api/investment-product/add`,
        formData,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Investment product added successfully!");

        // Reset form
        setProductTitle("");
        setDescription("");
        setArtistName("");
        setProducerName("");
        setLabelName("");
        setCategory("");
        setGenre("");
        setTotalBudget("");
        setMinimumInvestment("");
        setExpectedDuration("");
        setProductStatus("funding");
        setTargetAudience([]);
        setIsFeatured(false);
        setIsActive(true);
        setYoutubeLink("");

        // Reset files
        setCoverImage(null);
        setAlbumArt(null);
        setPosterImage(null);
        setVideoThumbnail(null);
        setVideoFile(null);
        setDemoTrack(null);
        setFullTrack(null);
        setGalleryImages([]);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to add product");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-4 p-6"
    >
      <h2 className="text-2xl font-bold mb-4">Add Investment Product</h2>

      {/* Basic Information */}
      <div className="w-full border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Product Title*</p>
            <input
              type="text"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter product title"
              required
            />
          </div>

          <div>
            <p className="mb-2">Artist Name*</p>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div>
            <p className="mb-2">Producer Name</p>
            <input
              type="text"
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter producer name"
            />
          </div>

          <div>
            <p className="mb-2">Label Name</p>
            <input
              type="text"
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter label name"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2">Description*</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter product description"
            rows="4"
            required
          />
        </div>
      </div>

      {/* Category & Financial Details */}
      <div className="w-full border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">
          Category & Financial Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="mb-2">Category*</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2">Genre</p>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Genre</option>
              {genreOptions.map((gen) => (
                <option key={gen} value={gen}>
                  {gen}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2">Total Budget (₹)*</p>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="1000000"
              min="1"
              required
            />
          </div>

          <div>
            <p className="mb-2">Minimum Investment (₹)*</p>
            <input
              type="number"
              value={minimumInvestment}
              onChange={(e) => setMinimumInvestment(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="10000"
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="mb-2">Expected Duration</p>
            <input
              type="text"
              value={expectedDuration}
              onChange={(e) => setExpectedDuration(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="3 months"
            />
          </div>

          <div>
            <p className="mb-2">Product Status</p>
            <select
              value={productStatus}
              onChange={(e) => setProductStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Image Uploads */}
      <div className="w-full border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Image Uploads</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Cover Image */}
          <div>
            <p className="mb-2">Cover Image</p>
            <label htmlFor="coverImage">
              <img
                className="w-20 h-20 object-cover border rounded cursor-pointer"
                src={
                  !coverImage
                    ? assets.upload_area
                    : URL.createObjectURL(coverImage)
                }
                alt="Cover"
              />
              <input
                onChange={(e) => setCoverImage(e.target.files[0])}
                type="file"
                id="coverImage"
                accept="image/*"
                hidden
              />
            </label>
          </div>

          {/* Album Art */}
          <div>
            <p className="mb-2">Album Art</p>
            <label htmlFor="albumArt">
              <img
                className="w-20 h-20 object-cover border rounded cursor-pointer"
                src={
                  !albumArt ? assets.upload_area : URL.createObjectURL(albumArt)
                }
                alt="Album Art"
              />
              <input
                onChange={(e) => setAlbumArt(e.target.files[0])}
                type="file"
                id="albumArt"
                accept="image/*"
                hidden
              />
            </label>
          </div>

          {/* Poster Image */}
          <div>
            <p className="mb-2">Poster Image</p>
            <label htmlFor="posterImage">
              <img
                className="w-20 h-20 object-cover border rounded cursor-pointer"
                src={
                  !posterImage
                    ? assets.upload_area
                    : URL.createObjectURL(posterImage)
                }
                alt="Poster"
              />
              <input
                onChange={(e) => setPosterImage(e.target.files[0])}
                type="file"
                id="posterImage"
                accept="image/*"
                hidden
              />
            </label>
          </div>

          {/* Video Thumbnail */}
          <div>
            <p className="mb-2">Video Thumbnail</p>
            <label htmlFor="videoThumbnail">
              <img
                className="w-20 h-20 object-cover border rounded cursor-pointer"
                src={
                  !videoThumbnail
                    ? assets.upload_area
                    : URL.createObjectURL(videoThumbnail)
                }
                alt="Video Thumbnail"
              />
              <input
                onChange={(e) => setVideoThumbnail(e.target.files[0])}
                type="file"
                id="videoThumbnail"
                accept="image/*"
                hidden
              />
            </label>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="mt-4">
          <p className="mb-2">Gallery Images (Multiple)</p>
          <input
            type="file"
            onChange={handleGalleryImageChange}
            className="w-full px-3 py-2 border rounded"
            multiple
            accept="image/*"
          />
          {galleryImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from(galleryImages).map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Gallery ${index + 1}`}
                  className="w-16 h-16 object-cover border rounded"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video & YouTube */}
      <div className="w-full border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Video Content</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Video File Upload */}
          <div>
            <p className="mb-2">Upload Video File</p>
            <input
              type="file"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full px-3 py-2 border rounded"
              accept="video/*"
            />
            {videoFile && (
              <p className="text-sm text-green-600 mt-1">
                Video selected: {videoFile.name}
              </p>
            )}
          </div>

          {/* YouTube Link */}
          <div>
            <p className="mb-2">YouTube Link</p>
            <input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>

      {/* Audio Uploads */}
      <div className="w-full border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Audio Content</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demo Track */}
          <div>
            <p className="mb-2">Demo Track</p>
            <input
              type="file"
              onChange={(e) => setDemoTrack(e.target.files[0])}
              className="w-full px-3 py-2 border rounded"
              accept="audio/*"
            />
            {demoTrack && (
              <p className="text-sm text-green-600 mt-1">
                Demo track: {demoTrack.name}
              </p>
            )}
          </div>

          {/* Full Track */}
          <div>
            <p className="mb-2">Full Track</p>
            <input
              type="file"
              onChange={(e) => setFullTrack(e.target.files[0])}
              className="w-full px-3 py-2 border rounded"
              accept="audio/*"
            />
            {fullTrack && (
              <p className="text-sm text-green-600 mt-1">
                Full track: {fullTrack.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="w-full border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Target Audience</h3>
        <div className="flex flex-wrap gap-2">
          {audienceOptions.map((audience) => (
            <label
              key={audience}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={targetAudience.includes(audience)}
                onChange={() => handleAudienceChange(audience)}
                className="rounded"
              />
              <span className="text-sm">{audience}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="w-full border p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Settings</h3>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded"
            />
            <span>Featured Product</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded"
            />
            <span>Active</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 font-semibold"
      >
        Add Investment Product
      </button>
    </form>
  );
};

export default AddInvestmentProduct;
