// frontend/src/pages/Login.jsx
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const [mode, setMode] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const endpoint = mode === "Sign Up" ? "/register" : "/login";
      const body =
        mode === "Sign Up" ? { name, email, password } : { email, password };

      const response = await axios.post(
        `${backendUrl}/api/user${endpoint}`,
        body
      );

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(`${mode} successful`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{mode}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {mode === "Sign Up" && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        <p
          onClick={() => setMode(mode === "Login" ? "Sign Up" : "Login")}
          className="cursor-pointer"
        >
          {mode === "Login" ? "Create account" : "Login here"}
        </p>
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {mode === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
