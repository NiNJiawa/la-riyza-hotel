import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">La Rizya Hotel</a>
      </div>
      <ul className="navbar-menu">
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms">Room</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
      </ul>
    </nav>
  );
}
