import React, { useContext, useState } from 'react'
import { assets } from '../mern-auth-assets/assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContent'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  console.log(import.meta.env.VITE_BACKEND_URL)

  const navigate = useNavigate()
  const { backendUrl, setIsLoggedin ,getUserData } = useContext(AppContent)

  const [state, setState] = useState('log in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    axios.defaults.withCredentials = true

    try {
      if (state === 'sign up') {
        const { data } = await axios.post(
          backendUrl + '/api/auth/register',
          { name, email, password }
        )

        console.log(data);

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(
          backendUrl + '/api/auth/login',
          { email, password }
        )

        if (data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message )
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-pink-200 to-blue-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === 'sign up' ? 'Create Account' : 'Login Account'}
        </h2>

        <form onSubmit={onSubmitHandler}>
          {state === 'sign up' && (
            <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#7b75752b]">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent outline-none"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#7b75752b]">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#7b75752b]">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent outline-none"
            />
          </div>

          <p
            className="pl-2 mb-4 cursor-pointer"
            onClick={() => navigate('/reset-password')}
          >
            Forgot Password?
          </p>

          <button className="rounded-full w-full py-2.5 bg-gradient-to-br from-indigo-500 to-indigo-900">
            {state}
          </button>
        </form>

        {state === 'sign up' ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{' '}
            <span
              onClick={() => setState('login')}
              className="text-blue-400 cursor-pointer underline"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don’t have an account?{' '}
            <span
              onClick={() => setState('sign up')}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login
