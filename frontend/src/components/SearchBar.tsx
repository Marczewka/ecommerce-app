import { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

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

    navigate({
      pathname: location.pathname.startsWith("/products/")
        ? "/products"
        : location.pathname,
      search: newParams.toString(),
    });
  };

  const handleClear = () => {
    setQuery("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");

    navigate({
      pathname: location.pathname,
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
          className="flex-4 rounded-l border p-2 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer px-2 text-xl hover:text-gray-400"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="submit"
        className="btn flex-1 cursor-pointer justify-center rounded-r border"
      >
        Search
      </button>
    </form>
  );
}
