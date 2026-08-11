import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "../styles/AppLayout.css";

function AdminLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 992
  );

  useEffect(() => {

    const handleResize = () => {

      if (window.innerWidth <= 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }

    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 992) {
      setSidebarOpen(false);
    }
  };

  return (

    <div className="gmt-admin-layout">

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={closeSidebar}
      />

      {sidebarOpen && (
        <div
          className="gmt-admin-overlay"
          onClick={closeSidebar}
        />
      )}

      <div className="gmt-admin-main">

        <AdminNavbar
          toggleSidebar={toggleSidebar}
        />

        <main className="gmt-admin-content">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

export default AdminLayout;