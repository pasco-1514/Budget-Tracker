import React, { useState } from 'react'
import AuthLayout from '../../components/Layouts/AuthLayout'
import Input from '../../components/Inputs/Input'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

 const handleLogin = async (e) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    setError('Please enter a valid email address');
    return;
  }

  if (!password) {
    setError('Please enter your password');
    return;
  }

  setError('');

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Login failed');
      return;
    }

  
    localStorage.setItem('token', data.token);
    navigate('/dashboard'); 
  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong. Please try again.');
  }
};


  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your credentials to log in.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            type="email"
            placeholder="student@example.com"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type="password"
            placeholder="Min 8 Characters"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-primary underline' to="/signup">
              SignUp
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default Login