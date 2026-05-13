import { useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { setCart } from "../features/cartSlice";
import api from "../api/axios";
import type { ProductItemRes, UserRes } from "@shared/dtos";

export default function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const authData = await api.get<UserRes>("auth/me");
        dispatch(setCredentials({ user: authData.data, token }));
        const cartData = await api.get<ProductItemRes[]>("/carts/my-cart");
        dispatch(setCart(cartData.data));
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow bg-indigo-100 p-10">
        <Outlet />
      </main>
    </div>
  );
}
