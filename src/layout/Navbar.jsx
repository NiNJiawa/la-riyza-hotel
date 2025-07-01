import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">La Rizya Hotel</a>
      </div>
      <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`navbar-menu ${isOpen ? "show" : ""}`}>
        <li>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms" onClick={closeMenu}>
            Room
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
