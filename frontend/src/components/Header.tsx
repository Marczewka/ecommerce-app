import { NavLink } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/categories" },
];

export default function Header() {
  return (
    <nav className="header">
      {navLinks.map((link) => (
        <NavLink key={link.path} to={link.path}>
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
}
