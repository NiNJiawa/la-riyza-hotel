import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "../axios";

export default function PaymentUpload() {
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get("code");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file || !bookingCode) {
      setMessage("Please select a file and ensure booking code is valid.");
      setSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append("booking_code", bookingCode);
    formData.append("payment_proof", file);

    try {
      await axios.post("/payment-proof", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Upload successful! We will verify your payment.");
      setSuccess(true);
    } catch (err) {
      setMessage("❌ Upload failed. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Upload Payment Proof</h2>
        <p style={styles.subtitle}>Booking Code:</p>
        <p style={styles.code}>{bookingCode || "Not Provided"}</p>

        <label htmlFor="upload" style={styles.uploadLabel}>
          {file ? file.name : "Choose File"}
        </label>
        <input
          id="upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button style={styles.button} onClick={handleUpload}>
          Submit
        </button>

        {message && (
          <p
            style={{
              ...styles.message,
              color: success ? "#28a745" : "#dc3545",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f6f8fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "480px",
    textAlign: "center",
  },
  title: {
    marginBottom: "12px",
    fontSize: "24px",
    color: "#333",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "4px",
    color: "#555",
  },
  code: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "24px",
    color: "#222",
  },
  uploadLabel: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#f1f1f1",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "20px",
    border: "1px solid #ccc",
    transition: "0.3s",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "20px",
    fontSize: "15px",
  },
};
