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
    <aside className="absolute top-1/2 left-1/2 -z-10 w-48 -translate-x-1/2 rounded-xl border-2 border-slate-600 bg-slate-500 p-2">
      <ul className="mt-4">
        {categories.map((category) => (
          <li key={category.slug}>
            <NavLink
              to={`/categories/${category.slug}${location.search}`}
              className="btn-list border-b"
              onClick={closeMenu}
            >
              {category.name}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to={`/products${location.search}`}
            className="btn-list"
            onClick={closeMenu}
          >
            All Products
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
