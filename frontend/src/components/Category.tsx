import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { SelectProducts } from "../../../backend/src/db/schema";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("categorySlug");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?categorySlug=${categorySlug}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [categorySlug]);

  return (
    <main>
      <ul>
        {products.map((product: SelectProducts) => (
          <li key={product.id}>
            <h3>
              {product.title} - {product.price} zł
            </h3>
            <p>{product.description}</p>
            {product.images && product.images.length > 0 && (
              <img src={product.images[0]} alt={product.title} />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
