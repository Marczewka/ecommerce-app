import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonDropdown from "./ButtonDropdown";
import SearchBar from "./SearchBar";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { useAppSelector } from "../../app/store";
import { setCart } from "../../features/cartSlice";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setCart([]));
    navigate("/");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  return (
    <nav
      className={`sticky top-0 z-50 grid h-15 grid-cols-6 items-center bg-slate-500 text-gray-100 ${auth.user?.role === "admin" && "top-8"}`}
    >
      <div className="col-start-1 flex justify-center">
        <Link to="/" className="btn-light w-48">
          Home
        </Link>
      </div>

      <div className="col-start-2 flex justify-center">
        {!isAuthPage && <ButtonDropdown />}
      </div>

      <div className="col-span-2 col-start-3 flex justify-center">
        {!isAuthPage && <SearchBar />}
      </div>

      <div className="col-start-5 flex justify-center">
        {!isAuthPage && auth.isAuthenticated && (
          <Link to="/cart" className="btn-light relative w-48">
            Cart
            {cart.length > 0 && (
              <span className="absolute -right-2 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-slate-500 shadow-lg">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        )}
      </div>

      <div className="col-start-6 flex justify-center">
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
