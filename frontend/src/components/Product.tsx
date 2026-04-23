import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { GetProductFromSlugResponse } from "../../../shared/types/products";

export default function Product() {
  const { productSlug } = useParams();
  const [product, setProduct] = useState<GetProductFromSlugResponse | null>(
    null,
  );

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productSlug}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [productSlug]);

  return (
    <main className="overflow-hidden rounded-lg shadow-lg">
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
        <div className="p-4 text-4xl">${product?.price}</div>
        <div className="pt-8 text-gray-600">{product?.description}</div>
      </div>
    </main>
  );
}
