import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { GetAllProductsResponse } from "../../../shared/types/api";
import ProductCard from "./ProductCard";
import api from "../api/axios";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<GetAllProductsResponse | null>(null);
  const searchQuery = searchParams.get("search") || "";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getCategoryProducts = async () => {
      try {
        const { data } = await api.get(
          `products/categories/?search=${searchQuery}`,
        );
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    };

    getCategoryProducts();
  }, [searchQuery, token]);

  return (
    <div>
      <div className="flex flex-col">
        <h1>Products</h1>
        {searchQuery && (
          <p className="p-6 text-2xl text-gray-600">
            Search results for <span className="italic">"{searchQuery}"</span>
          </p>
        )}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,min(240px))] justify-center justify-items-center gap-8">
        {products?.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
