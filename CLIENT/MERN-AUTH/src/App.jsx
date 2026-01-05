import { useState } from 'react'
import './App.css'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Reset_password from './pages/Reset_password'
import Verify_Email from './pages/Verify_Email'
import { ToastContainer, toast } from 'react-toastify';


function App() {

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/reset-password" element={<Reset_password/>}/>
        <Route path="/verify-email" element={<Verify_Email/>}/>
      </Routes>
    </>
  )
}

export default App
