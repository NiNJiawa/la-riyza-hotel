import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Booking from "./pages/Booking";
import ContactUs from "./pages/ContactUs";
import AdminRooms from "./admin/Rooms";
import AdminBookings from "./admin/Bookings";
import AdminPayments from "./admin/Payments";
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import Login from "./auth/login";
import PaymentUpload from "./pages/Payments";

function App() {
  return (
    <Routes>
      {/* 👤 USER ROUTES with Navbar + Footer */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/roomdetails/:id" element={<RoomDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/payment" element={<PaymentUpload />} />
      </Route>

      {/* 🔒 LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* 🛠️ ADMIN ROUTES (no navbar/footer) */}
      <Route
        path="/admin-rooms"
        element={
          <AdminLayout>
            <AdminRooms />
          </AdminLayout>
        }
      />
      <Route
        path="/admin-bookings"
        element={
          <AdminLayout>
            <AdminBookings />
          </AdminLayout>
        }
      />
      <Route
        path="/admin-payments"
        element={
          <AdminLayout>
            <AdminPayments />
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;
