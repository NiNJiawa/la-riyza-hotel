import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";
import "./roomdetails.css";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/rooms/${id}`)
      .then((res) => {
        setRoom(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch room data:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading room...</p>;
  if (!room) return <p>Room not found.</p>;

  function toggleFab() {
    const el = document.getElementById("fabOptions");
    el.classList.toggle("active");
  }

  return (
    <div className="room-details-container">
      <img
        className="room-image-banner"
        src={`http://localhost:8000/storage/${room.image}`}
        alt={room.name}
      />

      <div className="room-details-content">
        <h1 className="room-title">{room.name}</h1>
        <p className="room-description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
          quibusdam sapiente reiciendis explicabo provident deleniti quis
          tempora numquam, culpa sequi saepe, eum inventore illum cum dolorem
        </p>

        <div className="room-icons">
          <div>
            <span>🛏️</span> King Bed
          </div>
          <div>
            <span>📐</span> 30 m²
          </div>
          <div>
            <span>👥</span> Up to {room.max_guest} Guest
          </div>
          <div>
            <span>📶</span> Wifi
          </div>
        </div>

        <h2 className="facility-title">Room Facilities</h2>
        <div className="facility-list">
          {room.room_facilities?.length ? (
            room.room_facilities.map((facility) => (
              <div key={facility.id}>☑ {facility.name}</div>
            ))
          ) : (
            <p>No facilities available</p>
          )}
        </div>

        <div className="room-price">
          <span>Starting From :</span>
          <strong>
            IDR {Number(room.price_per_night).toLocaleString()}/night
          </strong>
        </div>

        <button
          className="book-btn"
          onClick={() => navigate("/booking", { state: { roomId: room.id } })}
        >
          Book Now
        </button>
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
