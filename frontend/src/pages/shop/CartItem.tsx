import { Link } from "react-router-dom";
import type { CartItemRes, ProductItemRes } from "@shared/dtos";
import { ButtonQuantity } from "./ButtonQuantity";
import { useAppSelector } from "../../app/store";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { addItem, removeItem, updateQuantity } from "../../features/cartSlice";

export default function CartItem({ product }: { product: ProductItemRes }) {
  const dispatch = useDispatch();
  const quantity = useAppSelector((state) => {
    const itemInCart = state.cart.find((item) => item.id === product?.id);
    return itemInCart?.quantity ? itemInCart.quantity : 0;
  });

  const handleQuantity = async (type: "plus" | "minus") => {
    if (!product) return;

    const endpoint = `carts/cartItems/${product.id}`;

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-40 overflow-hidden rounded-lg bg-slate-50 shadow-lg">
      <Link
        to={`/products/${product.slug}`}
        className="h-full w-1/5 bg-gray-100 focus:-outline-offset-2 focus:outline-slate-400"
      >
        {product.image && product.image.length > 0 && (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain p-2"
          />
        )}
      </Link>

      <div className="w-3/5 p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-2xl font-medium text-slate-800">
            {product.title}
          </h3>
        </Link>
      </div>

      <div className="flex w-1/5 flex-col items-end justify-between p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="text-2xl font-bold text-slate-900">
            ${Number(product.price) * quantity}
          </div>

          <div
            className={`${quantity < 2 && "invisible"} text-sm font-bold text-slate-500`}
          >
            per unit ${product.price}
          </div>

          <div className="flex items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm">
            <ButtonQuantity
              type={"minus"}
              changeQuantity={() => handleQuantity("minus")}
            />
            <span className="text-md min-w-8 text-center font-semibold text-slate-700">
              {quantity}
            </span>
            <ButtonQuantity
              type={"plus"}
              changeQuantity={() => handleQuantity("plus")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
