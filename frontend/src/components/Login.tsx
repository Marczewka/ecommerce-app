import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setErrors({ form: data.message });
      }
    } catch {
      setErrors({ form: "Connection refused. Is the server running?" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-sm flex-col items-center space-y-4 overflow-hidden rounded-lg bg-white p-10 shadow-lg"
      >
        <h1>Sign in</h1>

        {errors.form && (
          <p className="w-full rounded bg-red-50 p-2 text-sm text-red-600 border border-red-200 text-center">
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
            className={`w-full rounded border p-2 transition-all focus:outline-none focus:ring-1 ${
              errors.username
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          />
          {errors.username && (
            <span className="text-[10px] text-red-500 ml-1">
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
            className={`w-full rounded border p-2 transition-all focus:outline-none focus:ring-1 ${
              errors.password
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          />
          {errors.password && (
            <span className="text-[10px] text-red-500 ml-1">
              {errors.password}
            </span>
          )}
        </div>

        <button type="submit" className="btn-header mt-8" disabled={isLoading}>
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
