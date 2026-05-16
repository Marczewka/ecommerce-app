import { Link } from "react-router-dom";
import type { CartItemRes, ProductItemRes } from "@shared/dtos";
import { QuantityButton } from "./QuantityButton";
import { useAppSelector } from "../../app/store";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { addItem, removeItem, updateQuantity } from "../../features/cartSlice";

export default function ProductCard({ product }: { product: ProductItemRes }) {
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const quantity = useAppSelector((state) => {
    const itemInCart = state.cart.find((item) => item.id === product?.id);
    return itemInCart?.quantity ? itemInCart.quantity : 0;
  });

  const handleQuantity = async (type: "plus" | "minus") => {
    if (!product) return;

    const endpoint = `/carts/cartItems/${product.id}`;

    try {
      if (type === "plus") {
        if (quantity === 0) {
          await api.post<CartItemRes>(endpoint);
          dispatch(addItem(product));
        } else {
          const newQuantity = quantity + 1;
          await api.put<CartItemRes>(endpoint, {
            quantity: newQuantity,
          });
          dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
        }
      } else if (type === "minus") {
        if (quantity === 1) {
          await api.delete<CartItemRes>(endpoint);
          dispatch(removeItem(product.id));
        } else {
          const newQuantity = quantity - 1;
          await api.put<CartItemRes>(endpoint, {
            quantity: newQuantity,
          });
          dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative">
      <Link
        to={`/products/${product.slug}`}
        className="group flex w-60 flex-col overflow-hidden rounded-lg shadow-lg transition focus:outline-slate-400"
      >
        <div className="h-48 bg-gray-100 p-2">
          {product.image && product.image.length > 0 && (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <div className="bg-slate-50 p-3 transition-colors group-hover:bg-gray-100 group-active:bg-white">
          <div className="line-clamp-2 h-14 text-lg font-medium text-slate-800">
            {product.title}
          </div>
          <div className="pt-4 text-2xl font-bold text-slate-900">
            ${product.price}
          </div>
        </div>
      </Link>

      {isAuthenticated && (
        <div className="absolute right-1 bottom-1 grid grid-cols-3 items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm">
          {quantity > 0 && (
            <QuantityButton
              type={"minus"}
              changeQuantity={() => handleQuantity("minus")}
            ></QuantityButton>
          )}
          {quantity > 0 && (
            <span className="text-md min-w-8 text-center font-semibold text-slate-700">
              {quantity}
            </span>
          )}
          <QuantityButton
            type={"plus"}
            changeQuantity={() => handleQuantity("plus")}
            className="col-start-3"
          ></QuantityButton>
        </div>
      )}
    </div>
  );
}
