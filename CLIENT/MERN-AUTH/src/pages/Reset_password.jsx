import React, { useState, useRef } from 'react'
import { assets } from '../mern-auth-assets/assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContent } from '../context/AppContent'
import { toast } from 'react-toastify';
import axios from 'axios'

const Reset_password = () => {

  const {backendUrl} = useContext(AppContent);
  axios.defaults.withCredentials = true;


  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [newpassword,setPassword] = useState('');
  const [isEmailSent,setIsEmailSent] = useState('');
  const [otp,setOtp] = useState(0);
  const [isOtpSubmited,setIsOtpSubmited] = useState(false);

  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6)
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitEmail = async(e)=>{
    e.preventDefault();
    try{
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{email})
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true)
    }catch(e){
      toast.error(e.message);
    }
  }

  const onSumbitOtp = async (e) =>{
    try{
      e.preventDefault();
      const otpArray = inputRefs.current.map(e=>e.value);
      setOtp(otpArray.join(' '));
      setIsOtpSubmited(true);
    }catch(e){
      toast.error(e.message);
    }
  }

  const resetPassword = async(e)=>{
    try{
      e.preventDefault();
      const {data} = await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword:newpassword});
      console.log(data);
      if(data.success){
        toast.success(data.message);
        navigate('/login');
      }else{
        toast.error(data.message);
      }
    }catch(e){
      toast.error(e.message)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-pink-200 to-blue-400'>
      
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer"
      />

      {/* Email Form */}
      {!isEmailSent &&  <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-amber-50'>
        <h1 className='text-xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#33345c]'>
          <img src={assets.mail_icon} alt="" className='w-3 h-3' />
          <input
            type="email"
            placeholder='Email id'
            className='bg-transparent outline-none w-full'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900'>
          Submit
        </button>
      </form>
      }
     

      {/* OTP Form */}
      {isEmailSent && !isOtpSubmited &&  <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-amber-50 ml-6'onSubmit={onSumbitOtp}>
        <h1 className='text-xl font-semibold text-center mb-4'>Reset Password OTP</h1>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className='w-12 h-12 bg-[#333a5c] text-white text-center text-xl rounded-xl'
              ref={el => inputRefs.current[index] = el}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              required
            />
          ))}
        </div>
        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900'>
          Submit
        </button>
      </form>
      }
     

      {/* Enter new Password */}
      {isOtpSubmited && isEmailSent &&  <form onSubmit={resetPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-amber-50'>
        <h1 className='text-xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#33345c]'>
          <img src={assets.lock_icon} alt="" className='w-3 h-3' />
          <input
            type="password"
            placeholder='password'
            className='bg-transparent outline-none w-full'
            value={newpassword}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900'>
          Submit
        </button>
      </form>   }
       


    </div>
  )
}

export default Reset_password
