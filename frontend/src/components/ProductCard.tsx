import { Link } from "react-router-dom";
import type { GetAllProductsResponse } from "../../../shared/types/products";
import { QuantityButton } from "./QuantityButton";
import { useState } from "react";

export default function ProductCard({
  product,
  onRemove,
}: {
  product: GetAllProductsResponse[number];
  onRemove?: (productId: number) => void;
}) {
  const [quantity, setQuantity] = useState(product.quantity ?? 0);

  const token = localStorage.getItem("token");

  const handleQuantity = async (type: string) => {
    try {
      if (type === "plus") {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);

        if (quantity === 0) {
          const response = await fetch(
            `http://localhost:5000/api/carts/products/${product.id}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          if (!response.ok) {
            setQuantity(0);
          }
        } else {
          const response = await fetch(
            `http://localhost:5000/api/carts/products/${product.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ quantity: newQuantity }),
            },
          );
          if (!response.ok) {
            setQuantity(quantity);
          }
        }
      }

      if (type === "minus") {
        const newQuantity = quantity - 1;
        setQuantity(newQuantity);
        if (quantity === 1) {
          const response = await fetch(
            `http://localhost:5000/api/carts/products/${product.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          if (response.ok) {
            onRemove?.(product.id);
            return;
          }
          setQuantity(1);
        } else {
          const response = await fetch(
            `http://localhost:5000/api/carts/products/${product.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ quantity: newQuantity }),
            },
          );
          if (!response.ok) {
            setQuantity(quantity);
          }
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
        className="group flex w-60 flex-col overflow-hidden rounded-lg shadow-lg"
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
        <div className="bg-white p-3 transition-colors group-hover:bg-gray-200">
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
        <QuantityButton
          type={"plus"}
          changeQuantity={() => handleQuantity("plus")}
        ></QuantityButton>
      </div>
    </div>
  );
}
