import { createContext,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const [isLoggedin,setIsLoggedin] = useState(false);
  const [userData, setuserData] = useState(false);

  const getUserData = async () => { 
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setuserData(data.userData) :toast.error(data.message);
    } catch (error) {
      toast.error(data.message);
      
    }
  }
  
  const value = {
    backendUrl,
    isLoggedin, setIsLoggedin,
    userData, setuserData,
    getUserData
  }
  return(
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  )
 }