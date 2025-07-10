import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });

  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const filters = ['All', 'Pending', 'Active', 'Completed'];

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const fetchTasks = async (filter) => {
    if (!token) return;
    let url = 'http://localhost:5000/api/tasks/get';
    if (filter === 'Active') url = 'http://localhost:5000/api/tasks/active';
    if (filter === 'Pending') url = 'http://localhost:5000/api/tasks/pending';
    if (filter === 'Completed') url = 'http://localhost:5000/api/tasks/completed';

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
      else setTasks([]);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTasks(activeFilter);
  }, [activeFilter]);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/tasks/update/${editTaskId}`
      : 'http://localhost:5000/api/tasks/create';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', status: 'pending' });
        setIsEditing(false);
        setEditTaskId(null);
        fetchTasks(activeFilter);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) fetchTasks(activeFilter);
    } catch (err) {
      console.error(err.message);
    }
  };

  const openEditModal = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setEditTaskId(task._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          filters={filters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{activeFilter} Tasks</h1>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false);
                setFormData({ title: '', description: '', status: 'pending' });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow"
            >
              + Add Task
            </button>
          </div>

          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition"
                >
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  <span
                    className={`inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full ${
                      task.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10 text-lg">No tasks found.</p>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{isEditing ? 'Edit Task' : 'Add Task'}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
              >
                {isEditing ? 'Update Task' : 'Add Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}