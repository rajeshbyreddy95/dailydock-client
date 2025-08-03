import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Schedule = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState('today');
  const [loading, setLoading] = useState(false);
  const [updatingIndex, setUpdatingIndex] = useState(null);

  const getToday = () => new Date().toLocaleDateString('en-CA');

  const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('en-CA');
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warn("Please login to view your schedule.");
        navigate('/login');
        return;
      }

      let dateToSend = '';
      if (viewMode === 'specific') {
        if (!selectedDate || isNaN(Date.parse(selectedDate))) return;
        dateToSend = selectedDate;
      } else if (viewMode === 'today') {
        dateToSend = getToday();
      } else if (viewMode === 'previous') {
        dateToSend = getYesterday();
      }

      const response = await fetch('https://dailydoc-server.onrender.com/api/schedule/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, mode: 'specific', date: dateToSend })
      });

      const data = await response.json();
      if (response.ok) {
        setDisplayedTasks(data.tasks || []);
      } else {
        toast.error(data.message || "Failed to fetch schedule.");
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [viewMode, selectedDate]);

  const handleStatusChange = async (index) => {
    setUpdatingIndex(index);
    const updatedTasks = [...displayedTasks];
    updatedTasks[index].status =
      updatedTasks[index].status === 'completed' ? 'pending' : 'completed';
    setDisplayedTasks(updatedTasks);

    try {
      const token = localStorage.getItem("token");
      await fetch(`https://dailydoc-server.onrender.com/api/schedule/update-status/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ index, status: updatedTasks[index].status }),
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update task status.");
    } finally {
      setUpdatingIndex(null);
    }
  };

  const taskDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('https://dailydoc-server.onrender.com/api/taskdelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, taskId })
      });

      if (res.status === 200) {
        setDisplayedTasks(res.data.tasks);
        toast.success("Task deleted successfully.");
      } else {
        toast.error(res.data.message || "Failed to delete task.");
      }
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      toast.error("Something went wrong while deleting.");
    }
  };

  const getDuration = (start, end) => {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    const diff = endMinutes - startMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      <ToastContainer />
      <nav className="mb-6 text-sm">
        <ol className="list-reset flex">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-white/80">Make Tasks</li>
        </ol>
      </nav>

      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Hello, <a href="/profile" className='underline text-blue-300'>{username}</a>
        </h1>

        <p className="mb-6 text-sm md:text-base">
          Want to add a new task?{' '}
          <Link to="/make-my-schedule" className="underline hover:text-purple-300">
            Click here
          </Link>
        </p>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <button
            onClick={() => {
              const today = getToday();
              setSelectedDate(today);
              setViewMode('today');
            }}
            className={`px-4 py-2 rounded-lg text-sm ${viewMode === 'today' ? 'bg-white text-purple-700' : 'bg-white/30'}`}
          >
            Schedule for Today
          </button>
          <button
            onClick={() => {
              const yesterday = getYesterday();
              setSelectedDate(yesterday);
              setViewMode('previous');
            }}
            className={`px-4 py-2 rounded-lg text-sm ${viewMode === 'previous' ? 'bg-white text-purple-700' : 'bg-white/30'}`}
          >
            Schedule for Yesterday
          </button>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setViewMode('specific');
              }}
              className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm focus:outline-none"
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          Schedule for {selectedDate || getToday()}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
          </div>
        ) : displayedTasks.length === 0 ? (
          <p className="text-white/80">No tasks found.</p>
        ) : (
          <>
            <div className="w-full overflow-x-auto rounded-xl border border-white/20">
              <table className="w-full min-w-[600px] text-white text-xs md:text-sm text-left table-auto">
                <thead>
                  <tr className="bg-white/20">
                    <th className="py-3 px-2 md:px-4">Task</th>
                    <th className="py-3 px-2 md:px-4">Start</th>
                    <th className="py-3 px-2 md:px-4">End</th>
                    <th className="py-3 px-2 md:px-4">Duration</th>
                    <th className="py-3 px-2 md:px-4">Status</th>
                    <th className="py-3 px-2 md:px-4">Toggle</th>
                    <th className="py-3 px-2 md:px-4">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTasks.map((task, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-white/10 ${task.status === 'completed' ? 'bg-green-500/10' : ''}`}
                    >
                      <td className="py-3 px-2 md:px-4">{task.task}</td>
                      <td className="py-3 px-2 md:px-4">{task.startTime}</td>
                      <td className="py-3 px-2 md:px-4">{task.endTime}</td>
                      <td className="py-3 px-2 md:px-4">{getDuration(task.startTime, task.endTime)}</td>
                      <td className="py-3 px-2 md:px-4">
                        {task.status === 'completed' ? '✅ Completed' : '❌ Pending'}
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          disabled={updatingIndex === idx}
                          onChange={() => handleStatusChange(idx)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <button
                          className="text-xs md:text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600"
                          onClick={() => taskDelete(task._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-white/70 md:hidden italic text-center">
              ← Scroll to view more →
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
