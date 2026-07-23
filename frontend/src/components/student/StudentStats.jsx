import {useEffect,useState} from "react";

import {
FaBookOpen,
FaClipboardList,
FaChartLine,
FaAward,
} from "react-icons/fa";

import {
getStudentStats
} from "../../services/studentServices";


import "../../styles/StudentStats.css";


function StudentStats(){


const [stats,setStats]=useState(null);


useEffect(() => {
  const fetchStats = async () => {
    try {
      console.log("Fetching student stats...");

      const res = await getStudentStats();

      console.log("API Response:", res.data);

      setStats(res.data);
    } catch (error) {
      console.error("Stats Error:", error);
    }
  };

  fetchStats();
}, []);
useEffect(()=>{


const fetchStats=async()=>{

try{

const res =
await getStudentStats();

setStats(res.data);


}catch(error){

console.error(error);

}

};


fetchStats();


},[]);



if(!stats){

return <p>Loading stats...</p>;

}



const cards = [

  {
    title: "My Courses",
    value: stats.enrolledCourses,
    icon: <FaBookOpen />,
    color: "blue",
  },

  {
    title: "Pending Assignments",
    value: stats.pendingAssignments,
    icon: <FaClipboardList />,
    color: "orange",
  },

  {
    title: "Performance",
    value: stats.performance,
    icon: <FaChartLine />,
    color: "green",
  },

  {
    title: "Certificates",
    value: stats.certificates,
    icon: <FaAward />,
    color: "purple",
  },

];



return (

<section className="student-stats">

{
cards.map((stat,index)=>(

<div
className={`student-stat-card ${stat.color}`}
key={index}
>


<div className="stat-icon">
{stat.icon}
</div>


<div className="stat-content">

<h2>
{stat.value}
</h2>


<p>
{stat.title}
</p>


</div>


</div>

))

}


</section>

);

}


export default StudentStats;