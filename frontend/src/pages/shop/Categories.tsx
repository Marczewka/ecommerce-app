import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { CategoryRes } from "@shared/dtos";
import api from "../../api/axios";

export default function Categories({ closeMenu }: { closeMenu: () => void }) {
  const [categories, setCategories] = useState<CategoryRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get<CategoryRes[]>("/categories");
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <aside className="absolute top-1/2 left-1/2 -z-10 w-48 -translate-x-1/2 rounded-xl border-2 border-slate-600 bg-slate-500 p-2">
      {isLoading ? (
        <p className="animate-pulse text-center text-slate-500">Loading...</p>
      ) : (
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
      )}
    </aside>
  );
}
