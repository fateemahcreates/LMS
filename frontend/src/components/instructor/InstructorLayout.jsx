import { useState } from "react";
import { Outlet } from "react-router-dom";

import InstructorSidebar from "./InstructorSidebar";
import InstructorNavbar from "./InstructorNavbar";

import "../../styles/InstructorLayout.css";

function InstructorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="instructor-app">
      {/* Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="instructor-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <InstructorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`instructor-main ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >
        <InstructorNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="instructor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default InstructorLayout;