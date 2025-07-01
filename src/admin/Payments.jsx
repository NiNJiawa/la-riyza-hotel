import { useEffect, useState } from "react";
import axios from "../axios";
import Sidebar from "../layout/Sidebar";
import "./adminpayments.css";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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
    <div className="admin-page">
      <Sidebar />
      <div className="admin-main">
        <h1 className="page-title">💳 Payment Proofs</h1>

        {payments.length === 0 ? (
          <p className="no-payments">No payment proofs submitted yet.</p>
        ) : (
          <div className="payments-grid">
            {payments.map((p) => (
              <div className="payment-card" key={p.id}>
                <h3 className="payment-title">
                  Booking Code: <span className="bold">{p.booking_code}</span>
                </h3>
                <div className="payment-image-wrapper">
                  <img
                    src={`http://localhost:8000/${p.payment_proof}`}
                    alt="Payment Proof"
                    className="payment-image"
                    onClick={() =>
                      setSelectedImage(
                        `http://localhost:8000/${p.payment_proof}`
                      )
                    }
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <p className="uploaded-date">
                  Uploaded: {new Date(p.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modal Preview */}
        {selectedImage && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="modal-image-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
              <img
                src={selectedImage}
                alt="Full Preview"
                className="modal-image"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
