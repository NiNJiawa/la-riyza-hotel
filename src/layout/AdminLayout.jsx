import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/login");
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
