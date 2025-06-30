import { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Kita buat style terpisah

export default function Login() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", form);
      localStorage.setItem("admin_token", res.data.token);
      navigate("/admin-rooms");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        {error && <div className="login-error">{error}</div>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
