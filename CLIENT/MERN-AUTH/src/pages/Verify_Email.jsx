import React, { useContext } from 'react'
import { assets } from '../mern-auth-assets/assets/assets'
import {useNavigate}  from 'react-router-dom'
import axios from 'axios';
import { AppContent } from '../context/AppContent';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Verify_Email = () => {

  axios.defaults.withCredentials = true;
  const {backendUrl,isLoggedin,userData,getUserData} = useContext(AppContent)
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const handleInput = (e,index)=>{
    if(e.target.value.length > 0 && index<inputRefs.current.length -1){
      inputRefs.current[index+1].focus();
    }
  }

  const handleKeyDown = (e,index)=>{
    if(e.key==='Backspace'&& e.target.value===''&& index>0){
      inputRefs.current[index-1].focus();
    }
  }

  const handlePaste = (e)=>{
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  const otp = inputRefs.current.map(input => input.value).join('');

  if (otp.length !== 6) {
    return toast.error("Please enter the 6-digit OTP");
  }

  try {
    const { data } = await axios.post(
      `${backendUrl}/api/auth/verify-account`,
      { otp }
    );
    console.log(data);
    if (data.success) {
      toast.success(data.message);
      console.log(data)
      getUserData();
      navigate('/');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

useEffect(()=>{
  isLoggedin && userData && userData.isVerified && navigate('/')
},[isLoggedin,userData])

  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-pink-200 to-blue-400'>
      <img
              onClick={() => navigate('/')}
              src={assets.logo}
              alt=""
              className="absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer"
      />
      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 lext-sm text-amber-50'onSubmit={onSubmitHandler}>
        <h1 className='text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to the email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index)=>(
              <input type="text" maxLength='1' key={index} required
              className='w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-xl'
              ref={e=>inputRefs.current[index]=e}
              onInput = {(e)=> handleInput(e,index)}
              onKeyDown={(e)=>handleKeyDown(e,index)}
              />
            ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white cursor-pointer'>Verify Otp</button>
      </form>
    </div>
  )
}

export default Verify_Email