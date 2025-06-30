import { useEffect, useState } from "react";
import axios from "../axios";
import Sidebar from "../layout/Sidebar";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
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
          📋 Bookings Management
        </h1>

        {bookings.length === 0 ? (
          <p style={{ color: "#64748b" }}>No bookings available yet.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1000px",
              }}
            >
              <thead style={{ background: "#1e3a8a", color: "#fff" }}>
                <tr>
                  <th style={thStyle}>Booking Code</th>
                  <th style={thStyle}>Room</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Check-in</th>
                  <th style={thStyle}>Check-out</th>
                  <th style={thStyle}>Total Price</th>
                  <th style={thStyle}>Contact</th>
                  <th style={thStyle}>Payment Proof</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={tdStyle}>{b.booking_code}</td>
                    <td style={tdStyle}>{b.room?.name || "-"}</td>
                    <td style={tdStyle}>
                      {b.first_name} {b.last_name}
                    </td>
                    <td style={tdStyle}>{formatDate(b.check_in)}</td>
                    <td style={tdStyle}>{formatDate(b.check_out)}</td>
                    <td style={tdStyle}>
                      Rp {parseInt(b.total_price).toLocaleString()}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{b.email}</span>
                        <span>{b.phone}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {b.payment_proof ? (
                        <a
                          href={`http://localhost:8000/${b.payment_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`http://localhost:8000/${b.payment_proof}`}
                            alt="Proof"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                            }}
                          />
                        </a>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>Not uploaded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "500",
  fontSize: "14px",
};

const tdStyle = {
  padding: "14px 12px",
  fontSize: "14px",
  color: "#334155",
};

// Format date
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("id-ID", options);
}
