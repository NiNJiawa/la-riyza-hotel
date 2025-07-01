import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./booking.css";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    roomId,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
  } = location.state || {};

  const [checkIn, setCheckIn] = useState(
    initialCheckIn ? new Date(initialCheckIn) : null
  );
  const [checkOut, setCheckOut] = useState(
    initialCheckOut ? new Date(initialCheckOut) : null
  );
  const [room, setRoom] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    personal_request: "",
  });

  const [result, setResult] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalNights =
    checkIn && checkOut
      ? Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = room ? room.price_per_night * totalNights : 0;

  useEffect(() => {
    if (roomId) {
      axios.get(`/rooms/${roomId}`).then((res) => setRoom(res.data.data));
      axios.get(`/rooms/${roomId}/booked-dates`).then((res) => {
        const dates = [];
        res.data.booked_ranges.forEach(({ start, end }) => {
          let cur = new Date(start);
          const last = new Date(end);
          cur.setHours(0, 0, 0, 0);
          last.setHours(0, 0, 0, 0);
          while (cur <= last) {
            dates.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
          }
        });
        setBookedDates(dates);
      });
    }
  }, [roomId]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitBooking = async () => {
    if (!checkIn || !checkOut || totalNights <= 0) {
      alert("Please select valid Check-In and Check-Out dates.");
      return;
    }

    if (!form.first_name || !form.last_name || !form.phone || !form.email) {
      alert("Please fill in all required customer fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post("/bookings", {
        room_id: roomId,
        check_in: checkIn.toISOString().split("T")[0],
        check_out: checkOut.toISOString().split("T")[0],
        ...form,
      });

      console.log("Booking success:", response.data);
      setResult(response.data);
      setPopupVisible(true);
    } catch (err) {
      console.error("Booking error:", err.response || err);
      if (err.response?.status === 409) {
        alert(
          err.response.data.message ||
            "Booking conflict. Please choose another date."
        );
      } else {
        alert("Booking failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  function toggleFab() {
    const el = document.getElementById("fabOptions");
    el.classList.toggle("active");
  }

  return (
    <>
      <div className="hero-booking-full">
        <div className="hero-content">
          <section className="booking-title">
            <h2>Booking</h2>
            <p>LA RIZYA HOTEL</p>
          </section>
        </div>
      </div>

      <section className="checkin-row">
        <div className="checkin-item">
          <span className="label">Check In</span>
          <DatePicker
            selected={checkIn}
            onChange={(date) => {
              setCheckIn(date);
              if (checkOut && date >= checkOut) setCheckOut(null);
            }}
            placeholderText="Select date"
            dateFormat="dd/MM/yyyy"
            className="date-input"
            excludeDates={bookedDates}
            minDate={new Date()}
          />
        </div>
        <div className="checkin-item">
          <span className="label">Check Out</span>
          <DatePicker
            selected={checkOut}
            onChange={setCheckOut}
            placeholderText="Select date"
            dateFormat="dd/MM/yyyy"
            className="date-input"
            excludeDates={bookedDates}
            minDate={
              checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()
            }
            filterDate={(date) => (checkIn ? date > checkIn : true)}
          />
        </div>
        <div className="checkin-item guest-info">
          <i className="fa fa-users"></i>
          <span>Up to {room?.max_guest || 2} Guest</span>
        </div>
      </section>

      <div className="booking-container">
        <section className="card-booking">
          <h2>Customer Information</h2>
          <div className="input-row">
            <input
              name="first_name"
              placeholder="First Name"
              onChange={handleInputChange}
            />
            <input
              name="last_name"
              placeholder="Last Name"
              onChange={handleInputChange}
            />
          </div>
          <div className="input-row">
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleInputChange}
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
          </div>
          <label>Personal request</label>
          <textarea name="personal_request" onChange={handleInputChange} />
        </section>

        <section className="card-booking">
          <h2>Payment Method</h2>
          <div className="info-box">
            <i className="fa fa-info-circle"></i> Cancellation not allowed after
            payment. 100% fee applies.
          </div>
          <p className="payment-subtitle">
            We accept Transfer and E-Wallet only
          </p>
          <div className="payment-logos">
            <img src="/logos/ovo.png" alt="OVO" />
            <img src="/logos/gopay.png" alt="GoPay" />
            <img src="/logos/mandiri.png" alt="Mandiri" />
            <img src="/logos/bca.png" alt="BCA" />
          </div>
        </section>

        <section className="card-booking booking-details">
          <h2>Booking Details</h2>
          <div className="detail-row">
            <span>Check In: {checkIn?.toLocaleDateString("en-GB") || "-"}</span>
            <span>
              Check Out: {checkOut?.toLocaleDateString("en-GB") || "-"}
            </span>
            <span>
              <i className="fa fa-users"></i> Up to {room?.max_guest || 2} Guest
            </span>
          </div>
          <div className="room-price">
            <span>{room?.name || "Room"}</span>
            <span>
              {room
                ? `IDR ${Number(room.price_per_night).toLocaleString()}/night`
                : "-"}
            </span>
          </div>
          <div className="total-price">
            <span>Total:</span>
            <span>
              {room ? `IDR ${Number(totalPrice).toLocaleString()}` : "-"}
            </span>
          </div>
        </section>

        <button
          type="button"
          className="confirm-booking-btn"
          onClick={handleSubmitBooking}
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Confirm Booking"}
        </button>
      </div>

      {popupVisible && result && (
        <div className="booking-popup-overlay">
          <div className="booking-popup-content">
            <h2>Booking Successful!</h2>
            <p>
              <p
                style={{
                  color: "crimson",
                  fontWeight: "bold",
                  marginTop: "-8px",
                }}
              >
                ⚠️ Please remember your booking code!
              </p>
              <strong>Booking Code:</strong> {result.booking_code}{" "}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.booking_code);
                  alert("Booking code copied to clipboard!");
                }}
                className="copy-btn"
              >
                Copy
              </button>
            </p>

            <p>
              <strong>Total:</strong> Rp{" "}
              {Number(result.total_price || 0).toLocaleString()}
            </p>
            <hr />
            <p>Please transfer your payment to:</p>
            <p>
              <strong>Bank:</strong> BCA
            </p>
            <p>
              <strong>Account No.:</strong> 1234567890
            </p>
            <p>
              <strong>Account Name:</strong> La Rizya Hotel
            </p>
            <hr />
            <p>
              <em>We will contact you via:</em>
            </p>
            <p>
              <strong>Email:</strong> {form.email}
            </p>
            <p>
              <strong>Phone:</strong> {form.phone}
            </p>

            <div className="or-separator">or</div>

            <p>You can also upload your payment proof manually.</p>

            <button
              className="popup-button primary"
              onClick={() => navigate(`/payment?code=${result.booking_code}`)}
            >
              Upload Payment Proof
            </button>

            <button
              className="popup-button secondary"
              onClick={() => setPopupVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
    </>
  );
}
