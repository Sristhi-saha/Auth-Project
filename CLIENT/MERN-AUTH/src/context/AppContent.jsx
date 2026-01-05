import { createContext, useState } from "react"
import { toast } from 'react-toastify'
import axios from 'axios'
import { useEffect } from "react";

export const AppContent = createContext();


export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(backendUrl);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);


  const getAuthStatus = async()=>{
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.get(backendUrl+'/api/auth/is-authenticated');
      if(data.success){
        console.log(data);
        setIsLoggedin(true);
        getUserData()
      }
    }catch(e){
      toast.error(e.message);
    }
  }

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true
      });
      console.log(data);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(()=>{
    getAuthStatus();
  },[])

  const value = {
    backendUrl,
    isLoggedin, setIsLoggedin,
    userData, setUserData,
    getUserData
  }

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  )
}