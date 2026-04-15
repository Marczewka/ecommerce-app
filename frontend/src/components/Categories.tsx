import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SelectCategories } from "../../../backend/src/db/schema";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <main>
      <h1>Categories</h1>
      <ul>
        {categories.map((category: SelectCategories) => (
          <li key={category.id}>
            <Link to={`/products?categorySlug=${category.slug}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
