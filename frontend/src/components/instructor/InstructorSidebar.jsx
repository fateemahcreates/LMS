import "../../styles/InstructorSidebar.css";

import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTimes,
  FaChartPie,
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  FaBullhorn,
  FaChartLine,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";


import logo from "../../assets/GMT Software logo.jpeg";



function InstructorSidebar({
  sidebarOpen,
  setSidebarOpen
}) {


  const navigate = useNavigate();



  const user =
    JSON.parse(localStorage.getItem("user")) || {};




  const handleLogout = () => {


    localStorage.removeItem("token");

    localStorage.removeItem("user");


    navigate("/login");


  };




  const menuItems = [


    {
      name:"Dashboard",
      path:"/instructor",
      icon:<FaChartPie />
    },


    {
      name:"My Courses",
      path:"/instructor/courses",
      icon:<FaBookOpen />
    },


    {
      name:"Students",
      path:"/instructor/students",
      icon:<FaUsers />
    },


    {
      name:"Assignments",
      path:"/instructor/assignments",
      icon:<FaClipboardList />
    },


    {
      name:"Announcements",
      path:"/instructor/announcements",
      icon:<FaBullhorn />
    },


   


  ];






  return (


    <aside

className={`instructor-sidebar ${
  sidebarOpen
    ? "instructor-sidebar-open"
    : "instructor-sidebar-closed"
}`}

>





      {/* ==========================
          HEADER
      ========================== */}


      <div className="instructor-sidebar-header">


        <div className="instructor-sidebar-brand">


          <img

            src={logo}

            alt="GMT Software Academy"

            className="instructor-sidebar-logo"

          />



          <div>


            <h3>
              GMT Software
            </h3>


            <span>
              Instructor Portal
            </span>


          </div>



        </div>



<button

className="instructor-sidebar-close"

onClick={() => setSidebarOpen(false)}

>
          <FaTimes />

        </button>



      </div>







      {/* ==========================
          PROFILE CARD
      ========================== */}



      <div className="instructor-sidebar-profile">


        <FaUserCircle />



        <div>


          <h4>
            {user.name || "Instructor"}
          </h4>



          <span>
            Instructor
          </span>



        </div>


      </div>









      {/* ==========================
          MENU
      ========================== */}



      <nav className="instructor-sidebar-menu">



        {
          menuItems.map((item)=>(


            <NavLink

              key={item.name}

              to={item.path}

              end={
                item.path === "/instructor"
              }

              className={({isActive})=>

                isActive

                ? "instructor-sidebar-link active"

                : "instructor-sidebar-link"

              }


              onClick={() =>
                window.innerWidth <= 768 &&
                setSidebarOpen(false)
              }

            >


              <span className="instructor-sidebar-icon">

                {item.icon}

              </span>


              <span>

                {item.name}

              </span>



            </NavLink>



          ))
        }





      </nav>







      {/* ==========================
          BOTTOM MENU
      ========================== */}



      <div className="instructor-sidebar-bottom">









        <NavLink

          to="/instructor/settings"

          className="instructor-sidebar-link"

        >

          <FaCog />

          Settings

        </NavLink>





        <button

          className="instructor-sidebar-logout"

          onClick={handleLogout}

        >

          <FaSignOutAlt />

          Logout


        </button>




      </div>





    </aside>


  );

}



export default InstructorSidebar;