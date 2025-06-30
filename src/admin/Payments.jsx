import { useEffect, useState } from "react";
import axios from "../axios";
import Sidebar from "../layout/Sidebar";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("/payments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      setPayments(res.data.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, padding: "3rem" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "2rem",
            color: "#1e293b",
          }}
        >
          💳 Payment Proofs
        </h1>

        {payments.length === 0 ? (
          <p style={{ color: "#64748b" }}>No payment proofs submitted yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {payments.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "1rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "16px",
                    color: "#1e293b",
                  }}
                >
                  Booking Code:{" "}
                  <span style={{ fontWeight: "600" }}>{p.booking_code}</span>
                </h3>
                <div>
                  <img
                    src={`http://localhost:8000/${p.payment_proof}`}
                    alt="Payment Proof"
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      maxHeight: "250px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "0.5rem",
                    color: "#64748b",
                  }}
                >
                  Uploaded: {new Date(p.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
