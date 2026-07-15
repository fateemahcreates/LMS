import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSideBar from "./AdminSideBar";
import Navbar from "./AdminNavbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app">
      <AdminSideBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`main-wrapper ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Navbar setSidebarOpen={setSidebarOpen} />

        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;