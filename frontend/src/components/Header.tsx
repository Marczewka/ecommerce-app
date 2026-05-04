import { Link, useLocation, useNavigate } from "react-router-dom";
import DropdownButton from "./DropdownButton";
import SearchBar from "./SearchBar";
import { useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <nav className="sticky top-0 z-10 flex h-15 items-center bg-slate-500 text-gray-100">
      <div className="flex h-5/6 flex-1 items-center justify-evenly">
        <Link to="/" className="btn-header">
          Home
        </Link>
        {!isAuthPage && <DropdownButton />}
      </div>
      <div className="flex h-5/6 flex-1 items-center">
        {!isAuthPage && <SearchBar />}
      </div>
      <div className="flex h-5/6 flex-1 items-center justify-evenly">
        {isLoggedIn && (
          <Link to="/cart" className="btn-header">
            Cart
          </Link>
        )}
        {!isAuthPage &&
          (isLoggedIn ? (
            <button onClick={handleLogout} className="btn-header">
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-header">
              Login
            </Link>
          ))}
      </div>
    </nav>
  );
}
