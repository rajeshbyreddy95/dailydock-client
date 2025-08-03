import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const username = localStorage.getItem("username");
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://dailydoc-server.onrender.com/profile?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStats({ total: data.total, completed: data.completed });
        } else {
          alert(data.message || "Failed to load profile.");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login"); // or navigate('/') depending on your app structure
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;

  const progress =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center px-4 py-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-3xl shadow-lg border border-white/10 text-white">

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">👋 Welcome Back,</h2>
            <p className="text-lg text-purple-300">{username}</p>
          </div>
          <img
            src="https://avatars.githubusercontent.com/u/9919?s=280&v=4"
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 my-8">
          <div className="bg-purple-600/20 p-6 border border-red-400 shadow-lg rounded-xl text-center">
            <h3 className="text-sm uppercase tracking-widest text-purple-300">Total Tasks</h3>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-600/20 p-6 border border-red-400 shadow-lg rounded-xl text-center">
            <h3 className="text-sm uppercase tracking-widest text-green-300">Completed</h3>
            <p className="text-3xl font-bold">{stats.completed}</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 text-center">
          <h4 className="text-sm mb-2 text-gray-300">Task Completion Progress</h4>
          <div className="w-full bg-white/20 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-400' : 'bg-purple-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-400">
            {stats.total > 0 ? `${progress}% Completed` : "No tasks yet"}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/my-schedule"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition duration-200"
          >
            📋 View Your Tasks
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition duration-200"
          >
            🔓 Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
