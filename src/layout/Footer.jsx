import React from "react";
import "./Footer.css";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaEllipsisH,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Kiri */}
        <div className="footer-left">
          <h1 className="logo">La Rizya</h1>
          <h2 className="hotel">HOTEL</h2>
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur
            <br />
            adipiscing elit, .
          </p>
        </div>

        {/* Kanan */}
        <div className="footer-right">
          <div>
            <h3 className="connect-title">CONNECT WITH US</h3>
            <div className="icons">
              <FaEllipsisH />
              <FaMapMarkerAlt />
              <FaInstagram />
              <FaFacebookF />
            </div>
          </div>

          <div className="contact-block">
            <h2 className="contact-footer">CONTACTS</h2>
            <p>
              <FaPhoneAlt /> <span>+62 786 8379 9333</span>
            </p>
            <p>
              <FaWhatsapp /> <span>+62 786 8379 9333</span>
            </p>
            <p>
              <FaEnvelope /> <span>lrizya@gmail.com</span>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">Copyright© 2025 All Right Reserved</div>
    </footer>
  );
};

export default Footer;
