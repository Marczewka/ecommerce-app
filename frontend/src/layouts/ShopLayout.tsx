import Header from "../pages/shop/Header";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../app/store";
import Toolbar from "../components/Toolbar";

export default function StoreLayout() {
  const auth = useAppSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen flex-col">
      {auth.user?.role === "admin" && (
        <Toolbar auth={auth} text="Admin Panel" path="/admin" />
      )}

      <Header />

      <main className="flex grow flex-col bg-indigo-100">
        <Outlet />
      </main>
    </div>
  );
}
