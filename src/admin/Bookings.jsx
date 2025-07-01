import { useEffect, useState } from "react";
import axios from "../axios";
import Sidebar from "../layout/Sidebar";
import "./adminbookings.css";

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
    <div className="admin-page">
      <Sidebar />
      <div className="admin-main">
        <h1 className="page-title">📋 Bookings Management</h1>

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings available yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking Code</th>
                  <th>Room</th>
                  <th>Customer</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total Price</th>
                  <th>Contact</th>
                  <th>Payment Proof</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.booking_code}</td>
                    <td>{b.room?.name || "-"}</td>
                    <td>
                      {b.first_name} {b.last_name}
                    </td>
                    <td>{formatDate(b.check_in)}</td>
                    <td>{formatDate(b.check_out)}</td>
                    <td>Rp {parseInt(b.total_price).toLocaleString()}</td>
                    <td>
                      <div className="contact-info">
                        <span>{b.email}</span>
                        <span>{b.phone}</span>
                      </div>
                    </td>
                    <td>
                      {b.payment_proof ? (
                        <a
                          href={`http://localhost:8000/${b.payment_proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`http://localhost:8000/${b.payment_proof}`}
                            alt="Proof"
                            className="payment-proof"
                          />
                        </a>
                      ) : (
                        <span className="not-uploaded">Not uploaded</span>
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

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("id-ID", options);
}
