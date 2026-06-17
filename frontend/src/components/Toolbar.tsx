import { Link, useNavigate } from "react-router-dom";
import type { AuthState } from "../features/authSlice";
import api from "../api/axios";
import type { MessageRes } from "@shared/dtos";

export default function Toolbar({
  auth,
  text,
  path,
}: {
  auth: AuthState;
  text: string;
  path: string;
}) {
  const navigate = useNavigate();
  const handleRestartDatabase = async () => {
    if (!confirm("Are you sure you want to restart the database?")) return;

    try {
      await api.post<MessageRes>("/admin/seed");
      sessionStorage.setItem("seed_success", "true");
      navigate(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="sticky top-0 z-50 grid h-8 grid-cols-3 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 text-xs text-slate-200 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
        <span>
          Admin view (as
          <strong>{" " + auth.user?.username}</strong>)
        </span>
      </div>

      <button
        className="cursor-pointer justify-self-center rounded bg-red-600 px-3 py-0.5 font-medium text-white transition-colors hover:bg-red-700"
        onClick={handleRestartDatabase}
      >
        Restart Database
      </button>

      <Link to={path} className="btn-admin justify-self-end">
        {text}
      </Link>
    </div>
  );
}
