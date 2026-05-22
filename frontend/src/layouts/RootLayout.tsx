import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { setCart } from "../features/cartSlice";
import api from "../api/axios";
import type { ProductItemRes, UserRes } from "@shared/dtos";
import { Toaster } from "sonner";

export default function RootLayout() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const authData = await api.get<UserRes>("auth/me");
        dispatch(setCredentials({ user: authData.data, token }));
        const cartData = await api.get<ProductItemRes[]>("/carts/my-cart");
        dispatch(setCart(cartData.data));
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <>
      <Toaster richColors closeButton position="bottom-right" />
      <Outlet />
    </>
  );
}
