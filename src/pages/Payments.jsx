import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "../axios";
import "./paymentupload.css";

export default function PaymentUpload() {
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get("code");
  const [manualCode, setManualCode] = useState("");

  const finalBookingCode = bookingCode || manualCode;

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file || !finalBookingCode.trim()) {
      setMessage("❗ Please select a file and enter a valid booking code.");
      setSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append("booking_code", finalBookingCode.trim());
    formData.append("payment_proof", file);

    try {
      await axios.post("/payment-proof", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Upload successful! We will verify your payment.");
      setSuccess(true);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed. Please try again.");
      setSuccess(false);
    }
  };

  function toggleFab() {
    const el = document.getElementById("fabOptions");
    el.classList.toggle("active");
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Upload Payment Proof</h2>
        <p className="payment-subtitle">Booking Code:</p>

        {bookingCode ? (
          <p className="payment-code">{bookingCode}</p>
        ) : (
          <input
            className="manual-code-input"
            placeholder="Enter your booking code"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
          />
        )}

        <label htmlFor="upload" className="upload-label">
          {file ? file.name : "Choose Image"}
        </label>
        <input
          id="upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="upload-btn" onClick={handleUpload}>
          Submit
        </button>

        {message && (
          <p className={`upload-message ${success ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>

      <div className="fab-container">
        <div className="fab-options" id="fabOptions">
          <a
            href="https://www.traveloka.com/id-id/hotel/indonesia/"
            target="_blank"
            rel="noopener noreferrer"
            className="fab-icon"
          >
            <img src="/public/images/traveloka.jpeg" alt="Traveloka" />
          </a>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="fab-icon"
          >
            <img src="/public/images/wa.jpeg" alt="WhatsApp" />
          </a>
          <a
            href="https://www.instagram.com/your_ig"
            target="_blank"
            rel="noopener noreferrer"
            className="fab-icon"
          >
            <img src="/public/images/ig.jpeg" alt="Instagram" />
          </a>
        </div>

        <div className="fab-button" onClick={toggleFab}>
          <img src="/public/images/menu-logo.jpeg" alt="Menu" />
        </div>
      </div>
    </div>
  );
}
