import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { GetAllCategoriesResponse } from "../../../shared/types/categories";

export default function Categories(props: { closeMenu: () => void }) {
  const [categories, setCategories] = useState<GetAllCategoriesResponse>([]);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <aside className="absolute top-10 left-1/2 w-48 -translate-x-1/2 border bg-slate-500 p-2">
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <NavLink
              to={`/categories/${category.slug}${location.search}`}
              className="btn block capitalize"
              onClick={props.closeMenu}
            >
              {category.name}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to={`/products${location.search}`}
            className="btn block"
            onClick={props.closeMenu}
          >
            All Products
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
