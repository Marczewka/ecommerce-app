import { Link } from "react-router-dom";
import type { GetAllProductsResponse } from "../../../shared/types/api";
import { QuantityButton } from "./QuantityButton";
import { useAppSelector } from "../app/store";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { addItem, removeItem, updateQuantity } from "../features/cartSlice";

export default function ProductCard({
  product,
}: {
  product: GetAllProductsResponse[number];
}) {
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const quantity = useAppSelector((state) => {
    const itemInCart = state.cart.find((item) => item.id === product?.id);
    return itemInCart ? itemInCart.quantity : 0;
  });

  const handleQuantity = async (type: "plus" | "minus") => {
    if (!product) return;

    const endpoint = `/carts/products/${product.id}`;

    try {
      if (type === "plus") {
        if (quantity === 0) {
          await api.post(endpoint);
          dispatch(addItem(product));
        } else {
          const newQuantity = quantity + 1;
          await api.put(endpoint, { quantity: newQuantity });
          dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
        }
      } else if (type === "minus") {
        if (quantity === 1) {
          await api.delete(endpoint);
          dispatch(removeItem(product.id));
        } else {
          const newQuantity = quantity - 1;
          await api.put(endpoint, { quantity: newQuantity });
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
        <div className="h-48 bg-white/40 p-2">
          {product.image && product.image.length > 0 && (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <div className="bg-slate-50 p-3 transition-colors group-hover:bg-gray-100">
          <div className="line-clamp-2 h-14 text-lg">{product.title}</div>
          <div className="pt-4 text-2xl">${product.price}</div>
        </div>
      </Link>
      <div className="absolute right-4 bottom-4 flex items-center">
        {quantity > 0 && (
          <QuantityButton
            type={"minus"}
            changeQuantity={() => handleQuantity("minus")}
          ></QuantityButton>
        )}
        {quantity > 0 && (
          <span className="text-md min-w-8 text-center font-bold">
            {quantity}
          </span>
        )}
        {isAuthenticated && (
          <QuantityButton
            type={"plus"}
            changeQuantity={() => handleQuantity("plus")}
          ></QuantityButton>
        )}
      </div>
    </div>
  );
}
