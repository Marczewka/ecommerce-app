import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/store";
import { useEffect } from "react";
import AdminHeader from "../pages/admin/Header";
import Toolbar from "../components/Toolbar";

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
      <Toolbar auth={auth} text="Store Panel" path="/" />

      <AdminHeader />

      <main className="flex grow flex-col bg-indigo-100">
        <Outlet />
      </main>
    </div>
  );
}
