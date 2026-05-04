import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const isUsernameLongEnough = username.length >= 3;
  const isPasswordLongEnough = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!isUsernameLongEnough)
      newErrors.usernameLength = "At least 3 characters";
    if (!isPasswordLongEnough)
      newErrors.passwordLength = "At least 8 characters";
    if (!hasUpperCase) newErrors.passwordUppercase = "Uppercase letter";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrors({ form: data.message });
      }
    } catch {
      setErrors({ form: "Connection refused" });
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
        <h1>Register</h1>

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
              const newUsername = e.target.value;
              setUsername(newUsername);
              setErrors((prev) => {
                const updated = { ...prev };
                if (newUsername.trim().length >= 3) {
                  delete updated.usernameLength;
                } else {
                  updated.usernameLength = "";
                }
                return updated;
              });
            }}
            placeholder="username"
            className={`w-full rounded border p-2 transition-all focus:outline-none focus:ring-1 ${
              errors.usernameLength
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          />

          {errors.usernameLength && (
            <span className="text-[10px] text-red-500 ml-1">
              {errors.usernameLength}
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
              const newPassword = e.target.value;
              setPassword(newPassword);
              setErrors((prev) => {
                const updated = { ...prev };
                if (newPassword.length >= 8) {
                  delete updated.passwordLength;
                } else {
                  updated.passwordLength = "";
                }
                if (/[A-Z]/.test(newPassword)) {
                  delete updated.passwordUppercase;
                } else {
                  updated.passwordUppercase = "";
                }
                return updated;
              });
            }}
            placeholder="password"
            className={`w-full rounded border p-2 transition-all focus:outline-none focus:ring-1 ${
              errors.passwordLength || errors.passwordUppercase
                ? "border-red-500 ring-1 ring-red-500"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
          />
          <ul className="ml-2 list-disc list-inside text-[12px]">
            <li
              className={
                errors.passwordLength ? "text-red-500" : "text-slate-600"
              }
            >
              At least 8 characters
            </li>
            <li
              className={
                errors.passwordUppercase ? "text-red-500" : "text-slate-600"
              }
            >
              Uppercase letter
            </li>
          </ul>
        </div>

        <button type="submit" className="btn-header mt-8" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
