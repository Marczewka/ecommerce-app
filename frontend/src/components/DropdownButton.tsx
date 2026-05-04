import { useState, useEffect, useRef } from "react";
import Categories from "./Categories";

export default function DropdownButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="btn-header">
        Categories {isOpen ? "▲" : "▼"}
      </button>
      <div className={isOpen ? "block" : "hidden"}>
        <Categories closeMenu={() => setIsOpen(false)} />
      </div>
    </div>
  );
}
