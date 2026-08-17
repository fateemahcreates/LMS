import "../styles/StudentSidebar.css";

import { notify } from "../utils/notify";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import logo from "../assets/GMT Software logo.jpeg";


import {
  FaBookOpen,
  FaClipboardList,
  FaChartLine,
  FaBullhorn,
  FaUser,
  FaCog,
  FaTimes,
  FaSignOutAlt,
  FaAward,
  FaCompass,
  FaCalendarCheck,
} from "react-icons/fa";



function StudentSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {


  const navigate = useNavigate();



  const handleLogout = () => {


    notify.confirmLogout(() => {


      localStorage.removeItem("token");

      localStorage.removeItem("user");


      notify.info(
        "You have been logged out."
      );


      setTimeout(() => {

        navigate("/login");

      },800);



    });


  };




  const closeSidebar = () => {

    setSidebarOpen(false);

  };






  return (

    <>



      {
        sidebarOpen && (

          <div

            className="student-sidebar-overlay"

            onClick={closeSidebar}

          />

        )
      }






      <aside

className={`student-sidebar ${
  sidebarOpen
    ? "student-sidebar-open"
    : "student-sidebar-closed"
}`}

>




        {/* ==========================
            HEADER
        ========================== */}



        <div className="student-sidebar-header">



          <div className="student-sidebar-brand">



            <img

              src={logo}

              alt="GMT Software Academy"

              className="student-sidebar-logo"

            />



            <div>


              <h3>
                GMT Software
              </h3>


              <span>
                Student Portal
              </span>


            </div>



          </div>





         <button

 className="student-sidebar-close"

 onClick={() => setSidebarOpen(false)}

>

 <FaTimes />

</button>


        </div>







        {/* ==========================
            PROFILE
        ========================== */}



        <div className="student-sidebar-profile">


          <FaUser />



          <div>


            <h4>

              {
                JSON.parse(
                  localStorage.getItem("user")
                )?.name || "Student"
              }

            </h4>


            <span>
              Student
            </span>


          </div>



        </div>







        {/* ==========================
            NAVIGATION
        ========================== */}



        <nav className="student-sidebar-nav">





          <NavLink

            to="/student"

            end

            onClick={closeSidebar}

            className={({isActive}) =>

              isActive

              ?

              "student-sidebar-link active"

              :

              "student-sidebar-link"

            }

          >

            <FaChartLine />

            Dashboard


          </NavLink>








          <NavLink

            to="/browse-courses"

            onClick={closeSidebar}

            className="student-sidebar-link"

          >

            <FaCompass />

            Browse Courses


          </NavLink>








          <NavLink

            to="/my-courses"

            onClick={closeSidebar}

            className="student-sidebar-link"

          >

            <FaBookOpen />

            My Courses


          </NavLink>

          <NavLink
  to="/student/attendance"
  onClick={closeSidebar}
  className={({ isActive }) =>
    isActive
      ? "student-sidebar-link active"
      : "student-sidebar-link"
  }
>
  <FaCalendarCheck />

  Attendance
</NavLink>







          <NavLink

            to="/student/assignments"

            onClick={closeSidebar}

            className="student-sidebar-link"

          >

            <FaClipboardList />

            Assignments


          </NavLink>







          <NavLink

            to="/announcements"

            onClick={closeSidebar}

            className="student-sidebar-link"

          >

            <FaBullhorn />

            Announcements


          </NavLink>








          <NavLink

            to="/certification"

            onClick={closeSidebar}

            className="student-sidebar-link"

          >

            <FaAward />

            Certificates


          </NavLink>







          <NavLink

            to="/student-settings"

            onClick={closeSidebar}

            className="student-sidebar-link"

          >

            <FaCog />

            Settings


          </NavLink>





        </nav>








        {/* ==========================
            FOOTER
        ========================== */}



        <div className="student-sidebar-footer">



          <button

            className="student-sidebar-logout"

            onClick={handleLogout}

          >

            <FaSignOutAlt />

            Logout


          </button>





          <p>
            GMT Software Academy
          </p>


          <small>
            Student Portal v1.0
          </small>




        </div>






      </aside>




    </>

  );

}



export default StudentSidebar;