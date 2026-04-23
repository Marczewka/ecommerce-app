import { Link } from "react-router-dom";
import type { GetAllProductsResponse } from "../../../shared/types/products";

export default function ProductCard({
  product,
}: {
  product: GetAllProductsResponse[number];
}) {
  return (
    <Link
      to={`/products/${product.slug}`}
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
      <div className="bg-white p-3 transition-colors group-hover:bg-gray-200">
        <div className="line-clamp-2 h-14 text-lg">{product.title}</div>
        <div className="pt-4 text-2xl">${product.price}</div>
      </div>
    </Link>
  );
}
