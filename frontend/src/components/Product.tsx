import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { GetProductFromSlugResponse } from "../../../shared/types/api";
import { QuantityButton } from "./QuantityButton";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/store";
import { addItem, removeItem, updateQuantity } from "../features/cartSlice";

export default function Product() {
  const { productSlug } = useParams();
  const [product, setProduct] = useState<GetProductFromSlugResponse | null>(
    null,
  );
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await api.get(`/products/${productSlug}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
  }, [productSlug]);

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
        <div className="p-4 text-5xl">{product?.title}</div>
        {product?.price && <div className="p-4 text-4xl">${product.price}</div>}
        <div className="pt-8 text-gray-600">{product?.description}</div>
      </div>
      <div className="absolute top-135 right-100 flex items-center">
        {quantity > 0 && (
          <QuantityButton
            type={"minus"}
            changeQuantity={() => handleQuantity("minus")}
          ></QuantityButton>
        )}
        {quantity > 0 && (
          <span className="min-w-16 text-center text-2xl font-bold">
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
