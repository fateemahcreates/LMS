import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getStudentProfile
} from "../services/studentServices";


const StudentContext = createContext();


export function StudentProvider({children}){

  const [student,setStudent] = useState(null);

  const [loading,setLoading] = useState(true);


  const fetchStudent = async()=>{

    try{

      const res = await getStudentProfile();

      setStudent(res.data);


    }catch(error){

      console.error(error);

    }
    finally{

      setLoading(false);

    }

  };


  useEffect(()=>{

    fetchStudent();

  },[]);



  return (

    <StudentContext.Provider
      value={{
        student,
        loading,
        fetchStudent
      }}
    >

      {children}

    </StudentContext.Provider>

  );

}


export function useStudent(){

  return useContext(StudentContext);

}