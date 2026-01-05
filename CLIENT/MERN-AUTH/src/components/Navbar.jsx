import React from 'react'
import {assets} from '../mern-auth-assets/assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContent } from '../context/AppContent';
import { useContext ,useState} from 'react';
import axios from 'axios'


const Navbar = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('sign up')
  const {userData,backendUrl,setUserData,setIsLoggedin,} = useContext(AppContent);
  const logout = async()=>{
    try{
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      data.success && setIsLoggedin(false);
      data.success && setUserData(false) && setState('login');
      navigate('/')
    }catch(e){
      console.log(e.message);
    }
  }
  const verify = async()=>{
    try{
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/verify',{},{withCredentials: true});
      console.log(data);
      data.success &&  navigate('/verify-email');
    }catch(e){
      console.log(e.message)
    }
  }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32'/>
        {userData? <div className='w-8 h-8 flex justify-center items-center bg-indigo-900 rounded-full relative group text-amber-50'>
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm w-30'>
             {!userData.isVerified&&  <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'onClick={()=>verify()}>Verify-Email</li>}
              <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'onClick={()=>logout()}>Logout</li>
            </ul>
          </div>
        </div> : <button onClick={()=>{navigate('/login')}}
        className='flex items-center gap-2 border border-gray-800 rounded-4xl px-6 py-2 hover:bg-gray-100'>Login <img src={assets.arrow_icon} alt="" /> </button>
  }
    </div>
  )
}

export default Navbar