import { Link, useLocation, useNavigate } from "react-router-dom";
import DropdownButton from "./DropdownButton";
import SearchBar from "./SearchBar";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { useAppSelector } from "../app/store";
import { setCart } from "../features/cartSlice";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setCart([]));
    navigate("/");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <nav className="sticky top-0 z-10 flex h-15 items-center bg-slate-500 text-gray-100">
      <div className="flex h-5/6 flex-1 items-center justify-evenly">
        <Link to="/" className="btn-light w-48">
          Home
        </Link>
        {!isAuthPage && <DropdownButton />}
      </div>
      <div className="flex h-5/6 flex-1 items-center">
        {!isAuthPage && <SearchBar />}
      </div>
      <div className="flex h-5/6 flex-1 items-center justify-evenly">
        {!isAuthPage && auth.isAuthenticated && (
          <Link to="/cart" className="btn-light w-48">
            Cart
          </Link>
        )}
        {!isAuthPage &&
          (auth.isAuthenticated ? (
            <button onClick={handleLogout} className="btn-light w-48">
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn-light w-48">
              Login
            </Link>
          ))}
      </div>
    </nav>
  );
}
