import Header from "./Header";
import { Outlet, Link } from "react-router-dom";
import { useAppSelector } from "../app/store";

export default function StoreLayout() {
  const auth = useAppSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen flex-col">
      {auth.user?.role === "admin" && (
        <div className="sticky top-0 z-50 flex h-8 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 text-xs text-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
            <span>
              Admin view (as
              <strong>{" " + auth.user?.username}</strong>)
            </span>
          </div>
          <Link
            to="/admin/products"
            className="rounded bg-indigo-600 px-3 py-0.5 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Admin Panel
          </Link>
        </div>
      )}

      <Header />
      <main className="flex grow flex-col bg-indigo-100">
        <Outlet />
      </main>
    </div>
  );
}
