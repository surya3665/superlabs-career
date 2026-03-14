import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useEffect } from "react";

const authHomeUrl = import.meta.env.VITE_AUTH_HOME_URL

function Home() {
  const navigate = useNavigate()
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
    const response = await axios.get(authHomeUrl, {
      headers: {
        "Authorization" : `Bearer ${token}`
      }
    })
    if(response.status !== 200) {
      navigate('/login')
    }
    } catch (error) {
      navigate('/login')
      console.log(error)
    }
  }
  useEffect(()=>{
    
    fetchUser()
  },[])
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 ml-72"> {/* Adjusted ml-72 to match sidebar width */}
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
