import { useEffect, useState } from "react";
import type { GetAllProductsResponse } from "../../../shared/types/products";
import ProductCard from "./ProductCard";

export default function Cart() {
  const [cartItems, setCartItems] = useState<GetAllProductsResponse | null>(
    null,
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:5000/api/carts/my-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data));
  }, [token]);

  const handleRemoveItem = (productId: number) => {
    setCartItems(
      (current) => current?.filter((item) => item.id !== productId) ?? null,
    );
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1>Cart</h1>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,min(240px))] justify-center justify-items-center gap-8">
        {cartItems?.map((item) => (
          <li key={item.id}>
            <ProductCard product={item} onRemove={handleRemoveItem} />
          </li>
        ))}
      </ul>
    </div>
  );
}
