import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [videoThumbnail, setVideoThumbnail] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [slots, setSlots] = useState(0);
  const [sizes, setSizes] = useState([]);

  // ✅ Categories
  const categoryMap = {
    "Live Production Project": ["Event", "Concert", "Festival"],
    "Abroad Project": ["Film", "Documentary", "Music"],
    "Latest Project": ["Film", "Music", "Ad"],
    "Upcoming Project": ["Film", "Music", "Commercial"],
  };

  // ✅ Handle Slots Generation
  const generateSlots = (totalPrice, slotCount) => {
    if (!totalPrice || !slotCount) return [];
    const perSlot = totalPrice / slotCount;
    return Array.from({ length: slotCount }, (_, i) => ({
      slot: i + 1,
      price: perSlot,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("youtubeLink", youtubeLink);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);
      if (videoThumbnail) formData.append("videoThumbnail", videoThumbnail);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setSubCategory("");
        setSizes([]);
        setSlots(0);
        setYoutubeLink("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setVideoThumbnail(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Image Upload */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {[setImage1, setImage2, setImage3, setImage4].map(
            (setImage, index) => (
              <label key={index} htmlFor={`image${index + 1}`}>
                <img
                  className="w-20"
                  src={
                    !eval(`image${index + 1}`)
                      ? assets.upload_area
                      : URL.createObjectURL(eval(`image${index + 1}`))
                  }
                  alt=""
                />
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                />
              </label>
            )
          )}
        </div>
      </div>

      {/* Video Upload */}
      <div>
        <p className="mb-2">Upload Video Thumbnail</p>
        <label htmlFor="videoThumbnail">
          <img
            className="w-20"
            src={
              !videoThumbnail
                ? assets.upload_area
                : URL.createObjectURL(videoThumbnail)
            }
            alt=""
          />
          <input
            onChange={(e) => setVideoThumbnail(e.target.files[0])}
            type="file"
            id="videoThumbnail"
            hidden
          />
        </label>

        <p className="mt-2 mb-1">YouTube Link</p>
        <input
          type="text"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Paste YouTube link"
        />
      </div>

      {/* Name */}
      <div className="w-full">
        <p className="mb-2">Project Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Type here"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Project Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Category, Subcategory, Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Category</p>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
              setSizes([]);
            }}
            className="w-full px-3 py-2"
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

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => {
              setSubCategory(e.target.value);
              setSizes([]);
            }}
            className="w-full px-3 py-2"
            disabled={!category}
            required
          >
            <option value="">Select Sub Category</option>
            {category &&
              categoryMap[category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Total Project Cost</p>
          <input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setSizes(generateSlots(e.target.value, slots));
            }}
            className="w-full px-3 py-2 sm:w-[150px]"
            placeholder="Enter Price"
            required
          />
        </div>

        <div>
          <p className="mb-2">Number of Slots</p>
          <input
            type="number"
            value={slots}
            onChange={(e) => {
              setSlots(e.target.value);
              setSizes(generateSlots(price, e.target.value));
            }}
            className="w-full px-3 py-2 sm:w-[150px]"
            placeholder="Enter Slots"
            required
          />
        </div>
      </div>

      {/* Slots Preview */}
      {sizes.length > 0 && (
        <div className="mt-3">
          <p className="mb-2">Generated Slots</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((slot) => (
              <div key={slot.slot} className="px-3 py-1 bg-slate-200 rounded">
                Slot {slot.slot}: ₹{slot.price}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white rounded"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
