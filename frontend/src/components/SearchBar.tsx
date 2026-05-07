import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);

    if (query.trim()) {
      newParams.set("search", query);
    } else {
      newParams.delete("search");
    }

    const isProductsPage = location.pathname === "/products";
    const isCategoryPage = location.pathname.startsWith("/categories");

    const targetPath =
      isProductsPage || isCategoryPage ? location.pathname : "/products";

    navigate({
      pathname: targetPath,
      search: newParams.toString(),
    });
  };

  const handleClear = () => {
    setQuery("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");

    const isProductsPage = location.pathname === "/products";
    const isCategoryPage = location.pathname.startsWith("/categories");

    const targetPath =
      isProductsPage || isCategoryPage ? location.pathname : "/products";

    navigate({
      pathname: targetPath,
      search: newParams.toString(),
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full gap-1">
      <div className="relative flex flex-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search here..."
          className="flex-4 rounded-2xl border-2 border-slate-600 bg-white p-2 text-slate-600 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer px-2 text-xl text-gray-400 hover:text-black"
          >
            ✕
          </button>
        )}
      </div>

      <button type="submit" className="btn-light flex-1">
        Search
      </button>
    </form>
  );
}
