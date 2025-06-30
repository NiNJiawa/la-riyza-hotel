import { useEffect, useState } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import "./rooms.css";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/rooms")
      .then((res) => {
        const allRooms = res.data.data;

        // Urutkan: available dulu, lalu unavailable
        const sortedRooms = [...allRooms].sort((a, b) => {
          if (
            a.availability === "available" &&
            b.availability === "unavailable"
          )
            return -1;
          if (
            a.availability === "unavailable" &&
            b.availability === "available"
          )
            return 1;
          return 0;
        });

        setRooms(sortedRooms);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch room data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>ROOMS</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
              Aperiam quibusdam sapiente reiciendis explicabo <br />
              provident deleniti quis tempora numquam
            </p>
          </div>
        </div>
      </section>

      {/* ROOMS LIST */}
      <div className="rooms-section">
        <div className="rooms-container">
          {rooms.map((room) => (
            <div
              className={`room-card ${
                room.availability === "unavailable" ? "unavailable" : ""
              }`}
              key={room.id}
            >
              <img
                src={`http://localhost:8000/storage/${room.image}`}
                alt={room.name}
                className="room-image"
              />
              <div className="room-info">
                {room.availability === "unavailable" && (
                  <span className="unavailable-label">Unavailable</span>
                )}
                <h3>{room.name}</h3>
                <ul>
                  <li>🛏 {room.bed_type}</li>
                  <li>👤 Up to {room.max_guest} Guest</li>
                  <li>📐 30 m²</li>
                  <li>📶 Wifi</li>
                </ul>
                <div className="room-buttons">
                  {room.availability === "available" && (
                    <>
                      <Link to={`/roomdetails/${room.id}`}>
                        <button className="btn-details">See Details</button>
                      </Link>
                      <button
                        className="btn-book"
                        onClick={() =>
                          navigate("/booking", { state: { roomId: room.id } })
                        }
                      >
                        Book Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
