import React, { useEffect, useState } from 'react';

const features = [
  {
    title: '📅 Daily Planner',
    desc: 'Create time-based tasks for each day with a clean and simple interface.',
    details:
      'Easily schedule your daily tasks with time slots. Simple interface for adding, editing, and managing tasks day by day.',
  },
  {
    title: '📧 Smart Email Alerts',
    desc: 'Receive timely email reminders 5 minutes before your task starts — stay sharp and never miss a beat!',
    details:
      'Our email engine sends you personalized task reminders just before they start. Never be caught off guard again, even on your busiest days.',
  },
  {
    title: '📊 Task History',
    desc: 'Review your past schedules to track consistency and focus.',
    details:
      'Check past tasks, see what you accomplished, and monitor trends to improve productivity over time. All securely stored and accessible anytime.',
  },
  {
    title: '🔐 Secure Login',
    desc: 'Fast and private sign-up & login using modern auth protocols.',
    details:
      'Your data is encrypted and authenticated using JWT. Sign in securely with confidence and access your schedule from any device.',
  },
];

function Home() {
  const [token, setToken] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    const tok = localStorage.getItem('token');
    setToken(tok);
  }, []);

  return (
    <div className="App-header p-10 min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
        Daily Task Scheduler
      </h1>
      <p className="text-lg text-center max-w-xl mb-8 opacity-90">
        Plan your day. Stay on track. Get email notifications right when it's time for your next task. Boost your productivity with ease.
      </p>
      <div className="flex gap-4">
        <button
          className="bg-white text-indigo-600 px-6 py-2 rounded-2xl font-semibold shadow-md hover:bg-gray-100 transition"
        >
          <a href={token ? `/my-schedule` : `login`}>Try It</a>
        </button>
        <button className="border border-white px-6 py-2 rounded-2xl font-semibold hover:bg-white hover:text-indigo-600 transition">
          GitHub Repo
        </button>
      </div>

      {/* Feature Cards */}
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedFeature(f)}
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-sm opacity-90">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFeature && (
        <div className="p-3 fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 p-6 rounded-xl max-w-lg w-full shadow-lg relative">
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-lg"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedFeature.title}</h2>
            <p className="text-sm text-gray-700 mb-4">{selectedFeature.desc}</p>
            <p className="text-base text-gray-800">{selectedFeature.details}</p>
          </div>
        </div>
      )}

      <footer className="mt-20 text-sm text-white/70">
        © 2025 TaskPulse | Built with ❤️ by Rajesh and Yamuna
      </footer>
    </div>
  );
}

export default Home;
