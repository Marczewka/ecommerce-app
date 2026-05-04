import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { GetCategoryFromSlugResponse } from "../../../shared/types/categories";
import ProductCard from "./ProductCard";

export default function Category() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<GetCategoryFromSlugResponse | null>(null);

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/categories/${categorySlug}?search=${searchQuery}`,
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [categorySlug, searchQuery]);

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="mb-8 text-center text-4xl font-bold capitalize">
          {data?.categoryName}
        </h1>
        {searchQuery && (
          <p className="p-6 text-2xl text-gray-600">
            Search results for <span className="italic">"{searchQuery}"</span>
          </p>
        )}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,min(200px))] justify-center justify-items-center gap-8">
        {data?.products.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
