import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import type { ProductListRes } from "@shared/dtos";
import api from "../api/axios";

export default function Category() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductListRes["products"] | null>(
    null,
  );
  const [categoryName, setCategoryName] =
    useState<ProductListRes["categoryName"]>();

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const getCategoryProducts = async () => {
      try {
        const { data } = await api.get<ProductListRes>(
          `products/categories/${categorySlug}?search=${searchQuery}`,
        );
        setProducts(data.products);
        setCategoryName(data.categoryName);
      } catch (error) {
        console.error(error);
      }
    };

    getCategoryProducts();
  }, [categorySlug, searchQuery]);

  return (
    <div className="p-10">
      <div className="flex flex-col">
        <h1 className="mb-8 text-center text-4xl font-bold capitalize">
          {categoryName}
        </h1>
        {searchQuery && (
          <p className="p-6 text-2xl text-gray-600">
            Search results for <span className="italic">"{searchQuery}"</span>
          </p>
        )}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,min(240px))] justify-center justify-items-center gap-8">
        {products?.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
