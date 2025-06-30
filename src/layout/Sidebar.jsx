import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li>
          <Link to="/admin-rooms">Rooms</Link>
        </li>
        <li>
          <Link to="/admin-bookings">Bookings</Link>
        </li>
        <li>
          <Link to="/admin-payments">Payments</Link>
        </li>
      </ul>
      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
