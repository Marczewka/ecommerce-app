import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="sticky top-8 z-50 grid h-15 grid-cols-3 items-center bg-slate-500 text-gray-100">
      <div className="col-start-1 flex justify-center">
        <NavLink to="/admin/products" className="btn-light w-48">
          Products
        </NavLink>
      </div>

      <div className="col-start-2 flex justify-center">
        <NavLink to="/admin/categories" className="btn-light w-48">
          Categories
        </NavLink>
      </div>

      <div className="col-start-3 flex justify-center">
        <NavLink to="/admin/users" className="btn-light w-48">
          Users
        </NavLink>
      </div>
    </nav>
  );
}
