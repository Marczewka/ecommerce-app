import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import type { GetAllProductsResponse } from "../../../shared/types/products";

export default function Category() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<GetAllProductsResponse | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/products/categories/${categorySlug}?search=${searchQuery}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setCategoryName(data.categoryName);
      });
  }, [categorySlug, searchQuery]);

  return (
    <div>
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
      <ul className="grid grid-cols-[repeat(auto-fit,min(200px))] justify-center justify-items-center gap-8">
        {products?.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
