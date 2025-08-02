import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Schedule = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState('today');
  const [loading, setLoading] = useState(false); // Loading state

  const today = new Date().toISOString().split("T")[0];

  const fetchTasks = async (mode, date = '') => {
    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view your schedule.");
        navigate('/login');
        return;
      }

      const response = await fetch('https://dailydoc-server.onrender.com/schedule/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, mode, date })
      });

      const data = await response.json();

      if (response.ok) {
        setDisplayedTasks(data.tasks || []);
      } else {
        alert(data.message || "Failed to fetch schedule.");
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (viewMode === 'specific' && !selectedDate) return;
    fetchTasks(viewMode, selectedDate);
  }, [viewMode, selectedDate]);

  const handleStatusChange = async (index) => {
    const updatedTasks = [...displayedTasks];
    updatedTasks[index].status = updatedTasks[index].status === 'completed' ? 'pending' : 'completed';
    setDisplayedTasks(updatedTasks);

    try {
      const token = localStorage.getItem("token");
      await fetch(`https://dailydoc-server.onrender.com/schedule/update-status/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ index, status: updatedTasks[index].status }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  function getDuration(start, end) {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  let startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;

  // If end time is less than start time, assume it's on the next day
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  const diff = endMinutes - startMinutes;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
}


  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      <nav className="mb-6 text-sm">
        <ol className="list-reset flex">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-white/80">Make Tasks</li>
        </ol>
      </nav>

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4">
          Hello, <a href="/profile" className='underline text-blue-300'>{username}</a>
        </h1>

        <p className="mb-6">
          Want to add a new task?{' '}
          <Link to="/make-my-schedule" className="underline hover:text-purple-300">
            Click here
          </Link>
        </p>

        {/* Control Panel */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('today')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'today' ? 'bg-white text-purple-700' : 'bg-white/30'}`}
          >
            Today's Schedule
          </button>
          <button
            onClick={() => setViewMode('previous')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'previous' ? 'bg-white text-purple-700' : 'bg-white/30'}`}
          >
            View Previous Schedule
          </button>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setViewMode('specific');
              }}
              className="px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Table or Loader */}
        <h2 className="text-xl font-semibold mb-4">
          {viewMode === 'today' && `Today's Schedule `}
          {viewMode === 'previous' && 'Previous Schedules'}
          {viewMode === 'specific' && `Schedule for ${selectedDate}`}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
          </div>
        ) : displayedTasks.length === 0 ? (
          <p className="text-white/80">No tasks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white text-left">
              <thead>
                <tr className="bg-white/20">
                  <th className="py-2 px-4">Task</th>
                  <th className="py-2 px-4">Start Time</th>
                  <th className="py-2 px-4">End Time</th>
                  <th className="py-2 px-4">Duration</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Toggle</th>
                </tr>
              </thead>
              <tbody>
                {displayedTasks.map((task, idx) => (
                  <tr key={idx} className="border-b border-white/10">
                    <td className="py-2 px-4">{task.task}</td>
                    <td className="py-2 px-4">{task.startTime}</td>
                    <td className="py-2 px-4">{task.endTime}</td>
                    <td className="py-2 px-4">{getDuration(task.startTime, task.endTime)}</td>
                    <td className="py-2 px-4">
                      {task.status === 'completed' ? '✅ Completed' : '❌ Pending'}
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => handleStatusChange(idx)}
                        className="w-5 h-5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
