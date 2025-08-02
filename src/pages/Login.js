import React, { useState } from 'react';
import axios from '../service/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/login', formData);
      setSuccess('Login successful!');
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.email)
      navigate('/profile')

      // optionally store token: localStorage.setItem('token', res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-start">Username or Email</label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter your username or email"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-start">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {error && <div className="text-red-200 text-sm">{error}</div>}
          {success && <div className="text-green-200 text-sm">{success}</div>}

          <div className="flex justify-between text-sm">
            <a href="#" className="hover:underline text-white/80">
              Forgot Password?
            </a>
            <a href="/signup" className="hover:underline text-white/80">
              Don’t have an account? Sign up
            </a>
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-white text-purple-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
