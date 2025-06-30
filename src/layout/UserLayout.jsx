import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
