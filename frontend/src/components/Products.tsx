import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { GetAllProductsResponse } from "../../../backend/src/types/products";

export default function Category() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<GetAllProductsResponse | null>(null);

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?search=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [searchQuery]);

  return (
    <main>
      <div className="flex flex-col">
        <h1 className="mb-8 text-center text-4xl font-bold">products</h1>
        <div className="flex text-2xl">
          {searchQuery && (
            <p className="text-2xl text-gray-600">
              Search results for <span className="italic">"{searchQuery}"</span>
            </p>
          )}
        </div>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,min(200px))] justify-center justify-items-center gap-8">
        {products?.map((product) => (
          <li
            key={product.id}
            className="group flex w-48 flex-col overflow-hidden rounded-lg shadow-lg"
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
            <div className="bg-white pl-4 transition-colors group-hover:bg-gray-200">
              <div className="line-clamp-2 h-14 align-middle text-lg">
                {product.title}
              </div>
              <div className="test-xxl">${product.price}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
