import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { GetAllCategoriesResponse } from "../../../shared/types/api";
import api from "../api/axios";

export default function Categories({ closeMenu }: { closeMenu: () => void }) {
  const [categories, setCategories] = useState<GetAllCategoriesResponse>([]);
  const location = useLocation();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getCategories();
  }, []);

  return (
    <aside className="absolute top-10 left-1/2 w-48 -translate-x-1/2 border bg-slate-500 p-2">
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <NavLink
              to={`/categories/${category.slug}${location.search}`}
              className="btn block capitalize"
              onClick={closeMenu}
            >
              {category.name}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to={`/products${location.search}`}
            className="btn block"
            onClick={closeMenu}
          >
            All Products
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
