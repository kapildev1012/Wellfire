import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout Components
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";

// Pages
import Services from "./pages/Services";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import LatestCollection1 from "./components/LatestCollection1";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import Verify from "./pages/Verify";
import CategoryPage from "./pages/CategoryPage";
import LatestCollection from "./components/LatestCollection";

const App = () => {
  return (
    <>
      {/* ✅ Toast Notification */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        limit={1}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* ✅ Global UI Components */}
      <Navbar />
      <SearchBar />

      {/* ✅ Main Routes */}
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/Latestcollection1" element={<LatestCollection1 />} />
          <Route path="/Latestcollection" element={<LatestCollection />} />
        </Routes>

        <Footer />
      </div>
    </>
  );
};

export default App;
