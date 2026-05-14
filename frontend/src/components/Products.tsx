import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductItemRes, ProductListRes } from "@shared/dtos";
import ProductCard from "./ProductCard";
import api from "../api/axios";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductItemRes[] | null>(null);
  const searchQuery = searchParams.get("search") || "";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getCategoryProducts = async () => {
      try {
        const { data } = await api.get<ProductListRes>(
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
    <div className="p-10">
      <div className="flex flex-col">
        <h1>Products</h1>
        {searchQuery && (
          <h2 className="p-6 text-gray-600">
            Search results for <span className="italic">"{searchQuery}"</span>
          </h2>
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
