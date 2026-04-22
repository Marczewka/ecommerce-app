import { NavLink } from "react-router-dom";
import DropdownButton from "./DropdownButton";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <nav className="sticky top-0 z-10 flex h-15 items-center justify-around bg-slate-500 text-gray-100">
      <div className="flex h-5/6 flex-1 items-center justify-evenly">
        <NavLink
          to="/"
          className="btn w-48 justify-center rounded border"
          draggable="false"
        >
          Home
        </NavLink>
        <DropdownButton />
      </div>
      <div className="flex h-5/6 flex-1 items-center">
        <SearchBar />
      </div>
      <div className="flex h-5/6 flex-1 items-center"></div>
    </nav>
  );
}
