import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import { useEffect } from "react";
import AdminHeader from "../pages/admin/Header";

export default function AdminLayout() {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
    } else if (auth.user && auth.user.role !== "admin") {
      navigate("/");
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  return (
    <div>
      <div className="sticky top-0 z-50 flex h-8 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 text-xs text-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          <span>
            Admin view (as
            <strong>{" " + auth.user?.username}</strong>)
          </span>
        </div>
        <Link to="/" className="btn-admin">
          Store Panel
        </Link>
      </div>

      <AdminHeader />
      <main className="flex grow flex-col bg-indigo-100">
        <Outlet />
      </main>
    </div>
  );
}
