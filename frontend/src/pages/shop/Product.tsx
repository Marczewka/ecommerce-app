import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { CartItemRes, ProductDetailsRes } from "@shared/dtos";
import { ButtonQuantity } from "./ButtonQuantity";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/store";
import { addItem, removeItem, updateQuantity } from "../../features/cartSlice";

export default function Product() {
  const { productSlug } = useParams();
  const [product, setProduct] = useState<ProductDetailsRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get<ProductDetailsRes>(
          `/products/${productSlug}`,
        );
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, [productSlug]);

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
          await api.put<CartItemRes>(endpoint, { quantity: newQuantity });
          dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
        }
      } else if (type === "minus") {
        if (quantity === 1) {
          await api.delete<CartItemRes>(endpoint);
          dispatch(removeItem(product.id));
        } else {
          const newQuantity = quantity - 1;
          await api.put<CartItemRes>(endpoint, { quantity: newQuantity });
          dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10">
      {isLoading ? (
        <p className="animate-pulse text-center text-sm text-slate-500">
          Loading...
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg shadow-lg">
          <div className="h-100 bg-gray-100 p-2">
            {product?.image && product.image.length > 0 && (
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain"
              />
            )}
          </div>

          <div className="bg-white p-20">
            <div className="line-clamp-2 p-4 text-5xl text-slate-800">
              {product?.title}
            </div>
            {product?.price && (
              <div className="p-4 text-4xl font-bold text-slate-900">
                ${product.price}
              </div>
            )}
            <div className="pt-8 text-gray-600">{product?.description}</div>
          </div>

          {isAuthenticated && (
            <div className="absolute top-135 left-35 grid grid-cols-3 items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm">
              {quantity > 0 && (
                <ButtonQuantity
                  type={"minus"}
                  changeQuantity={() => handleQuantity("minus")}
                ></ButtonQuantity>
              )}
              {quantity > 0 && (
                <span className="text-md min-w-8 text-center font-semibold text-slate-700">
                  {quantity}
                </span>
              )}
              <ButtonQuantity
                type={"plus"}
                changeQuantity={() => handleQuantity("plus")}
                className="col-start-3"
              ></ButtonQuantity>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
