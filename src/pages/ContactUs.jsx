import React from "react";
import { Link } from "react-router-dom";
import "./homeContact.css"; // Ganti jika kamu pakai file css lain
function toggleFab() {
  const el = document.getElementById("fabOptions");
  el.classList.toggle("active");
}
export default function ContactUs() {
  return (
    <>
      <section className="contact-title">
        <h2>Contact Us</h2>
        <p>LA RIZYA HOTEL</p>
      </section>

      {/* Contact Card */}
      <section className="reservation">
        <div className="reservation-content">
          <h2>
            Contact For
            <br />
            Reservation
          </h2>
          <ul className="contact-list">
            <li>
              <img src="public/telp.png" alt="Phone Icon" />
              <span>+62 786 8379 9333</span>
            </li>
            <li>
              <img src="public/wa.png" alt="WhatsApp Icon" />
              <span>+62 786 8379 9333</span>
            </li>
            <li>
              <img src="public/email.png" alt="Email Icon" />
              <span>lrizya@gmail.com</span>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn-explore">
          Explore Location
        </Link>
      </section>

      {/* Accommodations */}
      <section className="accommodations">
        <h2>Accommodations</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>
        <div className="accommodation-grid">
          <div className="accommodation-card">
            <img src="/public/images/acm1.png" alt="Check In Icon" />
            <h3>CHECK IN</h3>
            <hr />
            <p className="time">14:00 WIB</p>
          </div>
          <div className="accommodation-card">
            <img src="/public/images/acm2.png" alt="Check Out Icon" />
            <h3>CHECK OUT</h3>
            <hr />
            <p className="time">14:00 WIB</p>
          </div>
          <div className="accommodation-card">
            <img src="/public/images/acm3.png" alt="Cancel Icon" />
            <h3>RESERVATION CANCELLATION</h3>
            <hr />
            <p className="desc">
              Lorem ipsum dolor sit amet, consectetur
            </p>
          </div>
        </div>
      </section>

      <div className="fab-container">
        <div className="fab-options" id="fabOptions">
          <a href="https://www.traveloka.com/id-id/hotel/indonesia/" target="_blank" rel="noopener noreferrer" className="fab-icon">
            <img src="/public/images/traveloka.jpeg" alt="Traveloka" />
          </a>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="fab-icon">
            <img src="/public/images/wa.jpeg" alt="WhatsApp" />
          </a>
          <a href="https://www.instagram.com/your_ig" target="_blank" rel="noopener noreferrer" className="fab-icon">
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