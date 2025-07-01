import React from "react";
import "./homeContact.css";
import { Link } from "react-router-dom";

function toggleFab() {
  const el = document.getElementById("fabOptions");
  el.classList.toggle("active");
}

export default function Home() {
  return (
    <>
      <section className="title-section">
        <div className="title-grid">
          <div className="title-left">
            <span className="text-orange">Welcome</span>{" "}
            <span className="text-blue">to</span>
          </div>
          <div className="title-right">
            <span className="text-blue">L’Rizya</span>{" "}
            <span className="text-orange">hotel</span>
          </div>
        </div>
        <div className="subtitle-container">
          <p>
            Welcome to our Modern Luxury and
            <br />
            Timeless living hotel room
          </p>
          <a href="/rooms" className="btn-title">
            Book Now
          </a>
        </div>
      </section>

      <div className="title-image">
        <img src="/public/images/title-img.png" alt="Hotel Front View" />
        <div className="overlay"></div>
      </div>

      <section className="services">
        <div className="service-box">
          <div className="icon-bg">
            <img src="/public/images/service1.png" alt="Service 1" />
          </div>
          <p>Lorem ipsum dolor sit amet</p>
        </div>

        <div className="service-box">
          <div className="icon-bg">
            <img src="/public/images/service2.png" alt="Service 2" />
          </div>
          <p>Lorem ipsum dolor sit amet</p>
        </div>

        <div className="service-box">
          <div className="icon-bg">
            <img src="/public/images/service3.png" alt="Service 3" />
          </div>
          <p>Lorem ipsum dolor sit amet</p>
        </div>
      </section>

      <section className="about">
        <h2>About Us</h2>
        <div className="about-content">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            quibusdam sapiente reiciendis explicabo provident deleniti quis
            tempora numquam, culpa sequi saepe, eum inventore illum cum
            dolorem, error ratione qui molestias labore. Dignissimos odio
            nesciunt consequatur qui, tenetur voluptate minima nostrum saepe hic
            aut ad, consequuntur facere fuga, dolor aperiam consectetur dolore
            molestias at. Praesentium perferendis hic reprehenderit tempore
            doloremque, commodi asperiores doloribus fugit sunt laboriosam omnis
            amet adipisci vero. Quas aspernatur consequuntur vitae, reiciendis
            tempore officiis quae. Fuga, perferendis enim?
          </p>
          <a href="/contact" className="btn">
            Contact Us
          </a>
        </div>
      </section>

      <section className="gallery">
        <h2>Gallery</h2>
        <div className="gallery-grid">
          <img src="/public/images/gallery1.png" alt="Gallery 1" className="img-1" />
          <img src="/public/images/gallery2.png" alt="Gallery 2" className="img-2" />
          <img src="/public/images/gallery3.png" alt="Gallery 3" className="img-3" />
          <img src="/public/images/gallery4.png" alt="Gallery 4" className="img-4" />
          <a href="/rooms" className="btn-booking">
            Booking Now
          </a>
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