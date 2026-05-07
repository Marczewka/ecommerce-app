import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCredentials } from "../features/authSlice";
import api from "../api/axios";
import axios from "axios";
import { setCart } from "../features/cartSlice";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (username.trim().length === 0)
      newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const loginRes = await api.post("/users/login", { username, password });
      dispatch(
        setCredentials({
          user: loginRes.data.user,
          token: loginRes.data.token,
        }),
      );
      const cartRes = await api.get("/carts/my-cart");
      dispatch(setCart(cartRes.data));
      window.location.href = "/";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data.message;
        setErrors({ form: message });
      } else {
        setErrors({ form: "Connection refused" });
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-sm flex-col items-center space-y-4 overflow-hidden rounded-lg bg-white p-10 shadow-lg"
      >
        <h1>Sign in</h1>

        {errors.form && (
          <p className="w-full rounded border border-red-200 bg-red-50 p-2 text-center text-sm text-red-600">
            {errors.form}
          </p>
        )}

        <div className="w-full">
          <input
            id="username"
            type="text"
            maxLength={20}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username)
                setErrors((prev) => ({ ...prev, username: "" }));
            }}
            placeholder="username"
            className={`w-full rounded border p-2 transition-all focus:ring-1 focus:outline-none ${
              errors.username
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.username && (
            <span className="ml-1 text-[10px] text-red-500">
              {errors.username}
            </span>
          )}
        </div>

        <div className="w-full">
          <input
            id="password"
            type="password"
            maxLength={20}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="password"
            className={`w-full rounded border p-2 transition-all focus:ring-1 focus:outline-none ${
              errors.password
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.password && (
            <span className="ml-1 text-[10px] text-red-500">
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn-dark mt-8 w-48"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}
