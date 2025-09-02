import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  // Poster upload
  const [poster, setPoster] = useState(false);

  // Product fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [raisedAmount, setRaisedAmount] = useState(0); // not in schema but can keep if needed
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(""); // not in schema
  const [director, setDirector] = useState(""); // not in schema
  const [status, setStatus] = useState("Concept"); // not in schema

  const statusOptions = ["Concept", "In Production", "Completed"];
  const categoryOptions = ["Sci-Fi", "Drama", "Action", "Documentary", "Music"];

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // ✅ match your productModel
      formData.append("name", title);
      formData.append("description", description);
      formData.append("price", targetAmount);
      formData.append("category", category);
      formData.append("subCategory", "General"); // default for now
      formData.append(
        "sizes",
        JSON.stringify([{ size: "Default", price: targetAmount }])
      );

      if (poster) {
        formData.append("poster", poster); // backend should use req.files.poster
      }

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset fields
        setTitle("");
        setDescription("");
        setTargetAmount("");
        setRaisedAmount(0);
        setCategory("");
        setDuration("");
        setDirector("");
        setStatus("Concept");
        setPoster(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Add product error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Upload Poster */}
      <div>
        <p className="mb-2">Upload Poster</p>
        <label htmlFor="poster">
          <img
            className="w-40 h-56 object-cover border rounded"
            src={!poster ? assets.upload_area : URL.createObjectURL(poster)}
            alt="poster"
          />
        </label>
        <input
          onChange={(e) => setPoster(e.target.files[0])}
          type="file"
          id="poster"
          hidden
        />
      </div>

      {/* Title */}
      <div className="w-full">
        <p className="mb-2">Product Title</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="e.g. Digital Dreams"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write product description here"
          required
        />
      </div>

      {/* Category */}
      <div className="w-full sm:w-1/3">
        <p className="mb-2">Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2"
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

      {/* Price */}
      <div className="w-full sm:w-1/3">
        <p className="mb-2">Price (₹)</p>
        <input
          onChange={(e) => setTargetAmount(e.target.value)}
          value={targetAmount}
          className="w-full px-3 py-2"
          type="number"
          placeholder="e.g. 2000000"
          required
        />
      </div>

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
