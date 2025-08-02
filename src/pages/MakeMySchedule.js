import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MakeMySchedule = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInputs, setTaskInputs] = useState([
    { task: '', startTime: '', endTime: '', date: '' }
  ]);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleInputChange = (index, field, value) => {
    const newInputs = [...taskInputs];
    newInputs[index][field] = value;
    setTaskInputs(newInputs);
  };

  const handleAddTask = async () => {
    if (!token || !username) {
      alert("Please login before adding a task.");
      navigate('/login');
      return;
    }

    const validTasks = taskInputs.filter(
      (t) => t.task && t.startTime && t.endTime && t.date
    );

    if (validTasks.length === 0) {
      alert("Please fill in all fields before saving.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8070/save-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          tasks: validTasks,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks([...tasks, ...validTasks]);
        setTaskInputs([{ task: '', startTime: '', endTime: '', date: '' }]);
        alert("Tasks saved successfully!");
      } else {
        alert(data.message || "Failed to save tasks.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    }
  };

  const addNewInputBox = () => {
    const last = taskInputs[taskInputs.length - 1];
    if (last.task && last.startTime && last.endTime && last.date) {
      setTaskInputs([...taskInputs, { task: '', startTime: '', endTime: '', date: '' }]);
    } else {
      alert('Please fill in the current task before adding a new one.');
    }
  };

  const removeInputBox = (index) => {
    const newInputs = taskInputs.filter((_, i) => i !== index);
    setTaskInputs(newInputs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="list-reset flex">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-white/80">Make My Schedule</li>
        </ol>
      </nav>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Create Your Schedule</h2>
        <a href="/my-schedule"><h1 className='text-2xl underline text-blue-300'>Click Here To View Your Tasks</h1></a>
        {taskInputs.map((input, index) => (
          <div key={index} className="mb-4 border border-white/20 p-4 rounded-lg relative">
            {taskInputs.length > 1 && (
              <button
                onClick={() => removeInputBox(index)}
                className="absolute top-2 right-2 text-red-300 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            )}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Task"
                value={input.task}
                onChange={(e) => handleInputChange(index, 'task', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="date"
                value={input.date}
                onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="time"
                value={input.startTime}
                onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="time"
                value={input.endTime}
                onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        ))}

        <div className="flex gap-4 mb-4">
          <button
            onClick={addNewInputBox}
            className="flex items-center gap-2 bg-white/90 text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-white"
          >
            <Plus size={18} /> Add Another Task Input
          </button>

          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Save Tasks
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default MakeMySchedule;
