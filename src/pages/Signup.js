import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // assuming you use react-router

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const { fullName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    try {
      await axios.post('https://dailydoc-server.onrender.com/auth/signup', {
        fullName,
        email,
        password
      });

      setSuccess('Signup successful!');
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 flex flex-col items-center justify-center px-4">
      
      {/* Breadcrumb */}
      <nav className="w-full max-w-md mb-4 text-white text-sm self-start">
        <Link to="/" className="hover:underline text-white/80">Home</Link> <span className="mx-1">/</span> <span>Signup</span>
      </nav>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-start">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-start">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
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
          <div>
            <label className="block mb-1 font-semibold text-start">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {error && <div className="text-red-200 text-sm">{error}</div>}
          {success && <div className="text-green-200 text-sm">{success}</div>}

          <div className="text-sm text-right">
            <Link to="/login" className="hover:underline text-white/80">
              Already have an account? Login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 font-semibold py-2 rounded-lg transition ${
              loading
                ? 'bg-white/40 text-white cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
