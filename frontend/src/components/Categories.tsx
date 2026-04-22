import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import type { SelectCategories } from "../../../backend/src/db/schema";

export default function Categories(props: { closeMenu: () => void }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <aside className="absolute top-10 left-1/2 w-48 -translate-x-1/2 border bg-slate-500 p-2">
      <ul>
        {categories.map((category: SelectCategories) => (
          <li key={category.id} onClick={props.closeMenu}>
            <NavLink
              to={`/categories/${category.slug}`}
              draggable="false"
              className="btn block"
            >
              {category.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
