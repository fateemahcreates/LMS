import { useEffect, useState } from "react";

import {
  getPublishedCourses,
} from "../../services/courseService";

import {
  enrollCourse,
} from "../../services/enrollmentService";

import "../../styles/BrowseCourses.css";
import { notify } from "../../utils/notify";

import {
  FaBookOpen,
  FaClock,
  FaUserTie,
  FaSearch,
} from "react-icons/fa";


function BrowseCourses() {


  // ==========================================
  // STATES
  // ==========================================

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [enrollingId, setEnrollingId] = useState(null);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");



  // ==========================================
  // COURSE CATEGORIES
  // ==========================================

  const categories = [

    "All",
    "Frontend",
    "Backend",
    "Full Stack",
    "Mobile",
    "UI/UX",
    "Data Science",
    "AI",
    "DevOps",
    "Cybersecurity",
    "Cloud",

  ];



  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {

    try {

      const res = await getPublishedCourses();

      setCourses(res.data);


    } catch(error){

      console.error(
        "Unable to fetch courses",
        error
      );


    } finally {

      setLoading(false);

    }

  };



  useEffect(()=>{

    fetchCourses();

  },[]);





  // ==========================================
  // ENROLL COURSE
  // ==========================================

  const handleEnroll = async(courseId)=>{


    try{


      setEnrollingId(courseId);


      const res = await enrollCourse(courseId);


      notify.success(
  res.data.message
);



    }catch(error){


      notify.error(
  error.response?.data?.message ||
  "Unable to enroll in this course."
);

    }finally{


      setEnrollingId(null);


    }


  };





  // ==========================================
  // FILTER COURSES
  // ==========================================


  const filteredCourses = courses.filter(
    (course)=>{


      const matchesSearch =

      course.title
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )

      ||

      course.description
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      );




      const matchesCategory =

      category === "All"

      ||

      course.category === category;



      return (
        matchesSearch &&
        matchesCategory
      );


    }

  );





  return (

    <main className="gmt-browse-courses">



      {/* =====================================
          HEADER
      ====================================== */}


      <div className="gmt-browse-header">


        <span className="page-tag">

          GMT ACADEMY

        </span>



        <h1>

          Browse Courses

        </h1>



        <p>

          Discover professional GMT Software
          Academy training programs and build
          industry-ready skills.

        </p>


      </div>





      {/* =====================================
          SEARCH
      ====================================== */}


      <div className="gmt-browse-toolbar">


        <div className="gmt-course-search">


          <FaSearch
            className="gmt-search-icon"
          />



          <input

            type="text"

            placeholder="Search courses..."

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

          />


        </div>


      </div>





      {/* =====================================
          CATEGORY FILTER
      ====================================== */}


      <div className="gmt-category-filter">


        {
          categories.map((item)=>(


            <button

              key={item}


              className={

                category === item

                ?

                "gmt-category-btn gmt-category-active"

                :

                "gmt-category-btn"

              }


              onClick={()=>
                setCategory(item)
              }


            >

              {item}


            </button>


          ))
        }


      </div>







      {/* =====================================
          LOADING
      ====================================== */}



      {
        loading ?


        (

          <div className="gmt-loading">

            <h3>
              Loading Courses...
            </h3>


          </div>


        )


        :



        filteredCourses.length === 0 ?


        (

          <div className="gmt-empty-state">


            <FaBookOpen
              className="gmt-empty-icon"
            />



            <h3>

              No Courses Found

            </h3>



            <p>

              No published courses match
              your search.

            </p>


          </div>


        )



        :



        (



        <div className="gmt-course-grid">



        {
          filteredCourses.map((course)=>(


            <div

              className="gmt-course-card"

              key={course._id}

            >




              <img

                className="gmt-course-image"


                src={

                  course.thumbnail ||

                  "https://placehold.co/600x350?text=GMT+Academy"

                }


                alt={course.title}


              />





              <div className="gmt-course-content">





                <span className="gmt-course-category">


                  {course.category}


                </span>





                <h2>

                  {course.title}

                </h2>





                <p>

                  {course.description}

                </p>






                {
                  course.level &&

                  (

                  <span

                    className={
                      `gmt-level-badge ${
                        course.level.toLowerCase()
                      }`
                    }

                  >

                    {course.level}


                  </span>

                  )

                }








                <div className="gmt-course-meta">



                  <span>

                    <FaUserTie />

                    {course.instructor}


                  </span>





                  <span>

                    <FaClock />

                    {course.duration}


                  </span>




                </div>







                <div className="gmt-course-footer">





                  <span className="gmt-course-price">


                    {
                      course.price === 0

                      ?

                      "FREE"

                      :

                      `$${course.price}`

                    }


                  </span>







                  <button

                    className="gmt-enroll-btn"



                    disabled={
                      enrollingId === course._id
                    }



                    onClick={()=>
                      handleEnroll(course._id)
                    }



                  >



                    {
                      enrollingId === course._id

                      ?

                      "Enrolling..."

                      :

                      "Enroll Now"

                    }



                  </button>





                </div>





              </div>





            </div>


          ))
        }





        </div>


        )

      }



    </main>


  );

}



export default BrowseCourses;