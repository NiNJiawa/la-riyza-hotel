import { useEffect, useState } from "react";
import axios from "../axios";
import Sidebar from "../layout/Sidebar";
import "./adminrooms.css";

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

  const inp = { padding: "8px", width: "100%", marginBottom: "10px" };
  const checkLabel = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    margin: "4px 0",
  };
  const facGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "6px",
  };

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
        fd.append(key, newRoom[key]);
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
    <div className="page">
      <Sidebar />
      <main className="main">
        <h1>🛏 Room Management</h1>

        {/* Form Tambah Room */}
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            name="name"
            value={newRoom.name}
            onChange={handleInput}
            placeholder="Room Name"
            required
          />
          <input
            name="price_per_night"
            type="number"
            value={newRoom.price_per_night}
            onChange={handleInput}
            placeholder="Price / Night"
            required
          />
          <input
            name="max_guest"
            type="number"
            value={newRoom.max_guest}
            onChange={handleInput}
            placeholder="Max Guest"
            required
          />
          <input
            name="bed_type"
            value={newRoom.bed_type}
            onChange={handleInput}
            placeholder="Bed Type"
          />
          <input
            name="room_size"
            value={newRoom.room_size}
            onChange={handleInput}
            placeholder="Room Size"
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleInput}
          />
          <textarea
            name="description"
            value={newRoom.description}
            onChange={handleInput}
            placeholder="Description"
            rows="3"
            required
            className="full-width"
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="wifi"
              checked={newRoom.wifi}
              onChange={handleInput}
            />{" "}
            Wifi Available
          </label>
          <div className="full-width">
            <label>
              <strong>Facilities:</strong>
            </label>
            <div className="facilities-grid">
              {facilities.map((f) => (
                <label key={f.id} className="checkbox-label">
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
          <button type="submit" className="btn-primary">
            ➕ Add Room
          </button>
        </form>

        {/* Room List */}
        <div className="room-grid">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`card ${
                room.availability !== "available" ? "unavailable" : ""
              }`}
            >
              <header className="card-header">
                <h3>{room.name}</h3>
                <span className={`badge ${room.availability}`}>
                  {room.availability}
                </span>
              </header>
              <p className="card-desc">{room.description}</p>
              <ul className="card-info">
                <li>💰 Rp {parseInt(room.price_per_night).toLocaleString()}</li>
                <li>👥 {room.max_guest} guest</li>
                <li>🛏 {room.bed_type || "-"}</li>
                <li>📏 {room.room_size || "-"} m²</li>
                <li>📶 Wifi: {room.wifi ? "Yes" : "No"}</li>
              </ul>
              {room.room_facilities?.length > 0 && (
                <ul className="facility-list">
                  {room.room_facilities.map((f) => (
                    <li key={f.id}>🏷 {f.name}</li>
                  ))}
                </ul>
              )}
              {room.image && (
                <img
                  src={`http://localhost:8000/storage/${room.image}`}
                  alt=""
                  className="room-img"
                />
              )}
              <div className="btn-group">
                <button
                  onClick={() => toggleAvailability(room.id, room.availability)}
                  className="btn-sm warning"
                >
                  {room.availability === "available"
                    ? "Set Unavailable"
                    : "Set Available"}
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="btn-sm danger"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingRoom(room)}
                  className="btn-sm primary"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Edit */}
        {editingRoom && (
          <div className="modal-backdrop">
            <form onSubmit={handleUpdateRoom} className="modal-form form-grid">
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
              />
              <input
                name="max_guest"
                type="number"
                value={editingRoom.max_guest}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, max_guest: e.target.value })
                }
                required
              />
              <input
                name="bed_type"
                value={editingRoom.bed_type || ""}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, bed_type: e.target.value })
                }
              />
              <input
                name="room_size"
                value={editingRoom.room_size || ""}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, room_size: e.target.value })
                }
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
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={editingRoom.wifi}
                  onChange={(e) =>
                    setEditingRoom({ ...editingRoom, wifi: e.target.checked })
                  }
                />
                Wifi Available
              </label>

              <div className="full-width">
                <label>
                  <strong>Facilities:</strong>
                </label>
                <div className="facilities-grid">
                  {facilities.map((f) => (
                    <label key={f.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={
                          Array.isArray(editingRoom.room_facilities)
                            ? editingRoom.room_facilities.some(
                                (x) => x.id === f.id
                              )
                            : false
                        }
                        onChange={(e) => {
                          const id = f.id;
                          const currentFacilities = Array.isArray(
                            editingRoom.room_facilities
                          )
                            ? [...editingRoom.room_facilities]
                            : [];

                          const updated = e.target.checked
                            ? [...currentFacilities, f]
                            : currentFacilities.filter((x) => x.id !== id);

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

              <div className="modal-actions">
                <button type="button" onClick={() => setEditingRoom(null)}>
                  Cancel
                </button>
                <button type="submit">Update</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
