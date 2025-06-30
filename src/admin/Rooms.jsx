import { useEffect, useState } from "react";
import axios from "../axios";
import Sidebar from "../layout/Sidebar";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    price_per_night: "",
    max_guest: 1,
    wifi: false,
    image: null,
    bed_type: "",
    room_size: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchFacilities();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/rooms");
      setRooms(res.data.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const fetchFacilities = async () => {
    try {
      const res = await axios.get("/room-facilities", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      setFacilities(res.data.data);
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  const handleInput = (e) => {
    const { name, value, type, checked, files } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      for (const key in newRoom) {
        if (key === "image" && newRoom[key]) {
          fd.append(key, newRoom[key]);
        } else {
          fd.append(key, newRoom[key]);
        }
      }
      fd.append("availability", "available");
      fd.set("wifi", newRoom.wifi ? "1" : "0");

      selectedFacilities.forEach((id) => fd.append("facilities[]", id));

      await axios.post("/rooms", fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setNewRoom({
        name: "",
        description: "",
        price_per_night: "",
        max_guest: 1,
        wifi: false,
        image: null,
        bed_type: "",
        room_size: "",
      });
      setSelectedFacilities([]);
      fetchRooms();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Gagal menambah room. Cek console.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus room ini?")) return;
    try {
      await axios.delete(`/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      fetchRooms();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleAvailability = async (id, status) => {
    const next = status === "available" ? "unavailable" : "available";
    try {
      await axios.put(
        `/rooms/${id}`,
        { availability: next },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      fetchRooms();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      const fields = [
        "name",
        "description",
        "price_per_night",
        "max_guest",
        "wifi",
        "availability",
        "bed_type",
        "room_size",
      ];
      fields.forEach((key) => form.append(key, editingRoom[key]));
      form.set("wifi", editingRoom.wifi ? "1" : "0");

      const facilityIds = editingRoom.room_facilities?.map((f) => f.id) || [];
      facilityIds.forEach((id) => form.append("facilities[]", id));

      if (editingRoom.new_image) {
        form.append("image", editingRoom.new_image);
      }

      await axios.post(`/rooms/${editingRoom.id}?_method=PUT`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingRoom(null);
      fetchRooms();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Update gagal.");
    }
  };

  return (
    <div style={page}>
      <Sidebar />
      <main style={main}>
        <h1>🛏️ Room Management</h1>

        {/* Tambah Room */}
        <form onSubmit={handleSubmit} style={formGrid}>
          <input
            name="name"
            value={newRoom.name}
            onChange={handleInput}
            placeholder="Room Name"
            required
            style={inp}
          />
          <input
            name="price_per_night"
            type="number"
            value={newRoom.price_per_night}
            onChange={handleInput}
            placeholder="Price / Night"
            required
            style={inp}
          />
          <input
            name="max_guest"
            type="number"
            value={newRoom.max_guest}
            onChange={handleInput}
            placeholder="Max Guest"
            required
            style={inp}
          />
          <input
            name="bed_type"
            value={newRoom.bed_type}
            onChange={handleInput}
            placeholder="Bed Type"
            style={inp}
          />
          <input
            name="room_size"
            value={newRoom.room_size}
            onChange={handleInput}
            placeholder="Room Size"
            style={inp}
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleInput}
            style={inp}
          />
          <textarea
            name="description"
            value={newRoom.description}
            onChange={handleInput}
            placeholder="Description"
            rows="3"
            required
            style={{ ...inp, gridColumn: "1 / span 2", resize: "vertical" }}
          />
          <label style={checkLabel}>
            <input
              type="checkbox"
              name="wifi"
              checked={newRoom.wifi}
              onChange={handleInput}
            />
            Wifi Available
          </label>
          <div style={{ gridColumn: "1 / span 2" }}>
            <label>
              <strong>Facilities:</strong>
            </label>
            <div style={facGrid}>
              {facilities.map((f) => (
                <label key={f.id} style={checkLabel}>
                  <input
                    type="checkbox"
                    value={f.id}
                    checked={selectedFacilities.includes(f.id)}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      setSelectedFacilities((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((x) => x !== id)
                      );
                    }}
                  />
                  {f.name}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" style={btnPrimary}>
            ➕ Add Room
          </button>
        </form>

        {/* Tampilkan semua rooms */}
        <div style={roomGrid}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                ...card,
                background:
                  room.availability === "available" ? "#fff" : "#f1f5f9",
                opacity: room.availability === "available" ? 1 : 0.7,
              }}
            >
              <header style={cardHeader}>
                <h3>{room.name}</h3>
                <span
                  style={{
                    ...badge,
                    background:
                      room.availability === "available" ? "#22c55e" : "#ef4444",
                  }}
                >
                  {room.availability}
                </span>
              </header>
              <p style={cardDesc}>{room.description}</p>
              <ul style={cardInfo}>
                <li>💰 Rp {parseInt(room.price_per_night).toLocaleString()}</li>
                <li>👥 {room.max_guest} guest</li>
                <li>🛏️ {room.bed_type || "-"}</li>
                <li>📏 {room.room_size || "-"} m²</li>
                <li>📶 Wifi: {room.wifi ? "Yes" : "No"}</li>
              </ul>
              {Array.isArray(room.room_facilities) &&
                room.room_facilities.length > 0 && (
                  <ul style={factList}>
                    {room.room_facilities.map((f) => (
                      <li key={f.id}>🏷️ {f.name}</li>
                    ))}
                  </ul>
                )}
              {room.image && (
                <img
                  src={`http://localhost:8000/storage/${room.image}`}
                  alt=""
                  style={imgStyle}
                />
              )}
              <div style={btnGroup}>
                <button
                  onClick={() => toggleAvailability(room.id, room.availability)}
                  style={{ ...btnSm, background: "#fbbf24" }}
                >
                  {room.availability === "available"
                    ? "Set Unavailable"
                    : "Set Available"}
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  style={{ ...btnSm, background: "#ef4444", color: "#fff" }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingRoom(room)}
                  style={{ ...btnSm, background: "#3b82f6", color: "#fff" }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Edit */}
        {editingRoom && (
          <div
            style={{
              background: "#0009",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <form
              onSubmit={handleUpdateRoom}
              style={{ ...formGrid, maxWidth: 600, background: "#fff" }}
            >
              <h3 style={{ gridColumn: "1 / -1" }}>
                Edit Room: {editingRoom.name}
              </h3>
              <input
                name="name"
                value={editingRoom.name}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, name: e.target.value })
                }
                required
                style={inp}
              />
              <input
                name="price_per_night"
                type="number"
                value={editingRoom.price_per_night}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    price_per_night: e.target.value,
                  })
                }
                required
                style={inp}
              />
              <input
                name="max_guest"
                type="number"
                value={editingRoom.max_guest}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, max_guest: e.target.value })
                }
                required
                style={inp}
              />
              <input
                name="bed_type"
                value={editingRoom.bed_type || ""}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, bed_type: e.target.value })
                }
                style={inp}
              />
              <input
                name="room_size"
                value={editingRoom.room_size || ""}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, room_size: e.target.value })
                }
                style={inp}
              />
              <textarea
                name="description"
                value={editingRoom.description}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    description: e.target.value,
                  })
                }
                style={{ ...inp, gridColumn: "1 / span 2", resize: "vertical" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    new_image: e.target.files[0],
                  })
                }
              />
              <label style={checkLabel}>
                <input
                  type="checkbox"
                  checked={editingRoom.wifi}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, wifi: e.target.checked })
                  }
                />{" "}
                Wifi Available
              </label>
              <div style={{ gridColumn: "1 / span 2" }}>
                <label>
                  <strong>Facilities:</strong>
                </label>
                <div style={facGrid}>
                  {facilities.map((f) => (
                    <label key={f.id} style={checkLabel}>
                      <input
                        type="checkbox"
                        checked={editingRoom.room_facilities?.some(
                          (x) => x.id === f.id
                        )}
                        onChange={(e) => {
                          const id = f.id;
                          const updated = e.target.checked
                            ? [...(editingRoom.room_facilities || []), f]
                            : editingRoom.room_facilities.filter(
                                (x) => x.id !== id
                              );
                          setEditingRoom({
                            ...editingRoom,
                            room_facilities: updated,
                          });
                        }}
                      />
                      {f.name}
                    </label>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gridColumn: "1 / span 2",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  style={{ ...btnSm, background: "#e2e8f0" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...btnSm, background: "#1e3a8a", color: "#fff" }}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// Styles
const page = {
  display: "flex",
  background: "#f8fafc",
  minHeight: "100vh",
  fontFamily: "Inter,sans-serif",
};
const main = { flex: 1, padding: "2.5rem" };
const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
  background: "#fff",
  padding: "1.5rem",
  borderRadius: 12,
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  marginBottom: "2rem",
};
const inp = {
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: 14,
};
const btnPrimary = {
  gridColumn: "1 / span 2",
  padding: "10px",
  border: "none",
  borderRadius: 8,
  fontSize: 15,
  color: "#fff",
  background: "#1e3a8a",
  cursor: "pointer",
};
const facGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  marginTop: 4,
};
const checkLabel = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: 14,
  color: "#334155",
};
const roomGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
  gap: "2rem",
};
const card = {
  background: "#fff",
  borderRadius: 12,
  padding: "1.5rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  overflow: "hidden",
};
const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const badge = {
  color: "#fff",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  textTransform: "capitalize",
};
const cardDesc = { color: "#64748b", marginTop: "0.5rem" };
const cardInfo = {
  listStyle: "none",
  padding: 0,
  marginTop: 8,
  fontSize: 14,
  color: "#334155",
};
const factList = {
  listStyle: "none",
  padding: 0,
  marginTop: 8,
  fontSize: 13,
  color: "#475569",
};
const imgStyle = {
  marginTop: "1rem",
  borderRadius: 12,
  width: "100%",
  objectFit: "cover",
  maxHeight: 180,
};
const btnGroup = { display: "flex", gap: "0.5rem", marginTop: "1rem" };
const btnSm = {
  padding: "8px 12px",
  fontSize: 13,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 500,
};
