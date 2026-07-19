import { useState } from "react";
import { Outlet } from "react-router-dom";

import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import "..//styles/StudentLayout.css";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
  
      <div
        className={`main-wrapper ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >
       <StudentNavbar
  setSidebarOpen={setSidebarOpen}
/>

        <Outlet />
      </div>
    </div>
  );
}

export default StudentLayout;