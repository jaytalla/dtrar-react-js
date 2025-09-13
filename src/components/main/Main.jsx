import React, { useEffect, useState } from "react";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import Dashboard from "../dashboard/Dashboard";

const db = getFirestore();

function Main() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    task: "",
    isOT: false,
    timeIn: "",
    timeOut: "",
    otTask: "",
  });
  const [editingTask, setEditingTask] = useState(null); // for modal
  const [showModal, setShowModal] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch tasks for the logged-in user
  const fetchTasks = async () => {
    if (!user) return; // Ensure user is logged in

    // Create a query to filter by userId
    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));

    const querySnapshot = await getDocs(q);
    const tasksData = [];
    querySnapshot.forEach((doc) => {
      tasksData.push({ id: doc.id, ...doc.data() });
    });
    setTasks(tasksData);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) fetchTasks();
    });
    return () => unsubscribe();
  }, []);

  // Create or Update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not logged in!");

    const taskData = {
      ...newTask,
      date: new Date().toISOString().split("T")[0],
      userId: user.uid,
      userEmail: user.email,
    };

    if (editingTask) {
      if (!window.confirm("Are you sure you want to update this task?")) return;
      const taskRef = doc(db, "tasks", editingTask.id);
      await updateDoc(taskRef, taskData);
      setEditingTask(null);
    } else {
      if (!window.confirm("Are you sure you want to add this task?")) return;
      await addDoc(collection(db, "tasks"), taskData);
    }

    setNewTask({ task: "", isOT: false, timeIn: "", timeOut: "", otTask: "" });
    setShowModal(false);
    fetchTasks();
  };

  // Open modal for editing
  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      task: task.task,
      isOT: task.isOT,
      timeIn: task.timeIn,
      timeOut: task.timeOut,
      otTask: task.otTask,
    });
    setShowModal(true);
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

   
  return (
    <div className="flex flex-col w-full h-full bg-gray-100 p-4">
      {/* Dashboard Header */}
      <Dashboard tasks={tasks} />

      {/* Toolbar */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <button
          className="bg-indigo-600 text-white p-2 rounded-md"
          onClick={() => {
            setEditingTask(null);
            setNewTask({ task: "", isOT: false, timeIn: "", timeOut: "", otTask: "" });
            setShowModal(true);
          }}
        >
          Add Task
        </button>
        <input
          type="text"
          placeholder="Search task..."
          className="p-2 border rounded-md"
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            setTasks((prev) =>
              prev.filter((task) => task.task.toLowerCase().includes(query))
            );
          }}
        />
      </div>

      {/* Task Table */}
      <div className="w-full bg-white rounded-md p-4 overflow-auto shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Task</th>
              <th className="p-2 border">OT</th>
              <th className="p-2 border">Time In</th>
              <th className="p-2 border">Time Out</th>
              <th className="p-2 border">OT Task</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-100">
                <td className="p-2 border">{task.date}</td>
                <td className="p-2 border">{task.userEmail}</td>
                <td className="p-2 border">{task.task}</td>
                <td className="p-2 border">{task.isOT ? "Yes" : "No"}</td>
                <td className="p-2 border">{task.timeIn}</td>
                <td className="p-2 border">{task.timeOut}</td>
                <td className="p-2 border">{task.otTask}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-yellow-400 text-white p-1 rounded-md"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded-md"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/25">
                <div className="bg-white rounded-md p-6 w-[50%] h-fit overflow-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {editingTask ? "Edit Task" : "Add Task"}
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Task Description */}
                    <textarea
                        placeholder="Task"
                        rows={5}
                        value={newTask.task}
                        onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                        className="p-2 border rounded-md resize-none"
                        required
                        />

                        {/* Generate Description Button */}
                        <button
                        type="button"
                        className="bg-green-500 text-white p-2 rounded-md mt-2"
                        onClick={async () => {
                            if (!newTask.task) return alert("Please enter a task first!");
                            try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ task: newTask.task }),
                            });

                            if (!res.ok) throw new Error("Server error");

                            const data = await res.json();
                            if (data.description) {
                                setNewTask({ ...newTask, task: data.description });
                            } else {
                                alert("Failed to generate description");
                            }
                            } catch (err) {
                            console.error(err);
                            alert("Failed to generate description.");
                            }
                        }}
                        >
                        Generate Description
                        </button>

                    {/* OT Switch */}
                    <div className="flex items-center gap-2">
                    <span className="font-medium">Is OT?</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                        type="checkbox"
                        checked={newTask.isOT}
                        onChange={(e) => setNewTask({ ...newTask, isOT: e.target.checked })}
                        className="sr-only"
                        />
                        <div
                        className={`w-11 h-6 rounded-full transition-colors ${
                            newTask.isOT ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                        ></div>
                        <div
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                            newTask.isOT ? "translate-x-5" : "translate-x-0"
                        }`}
                        ></div>
                    </label>
                    </div>

                    {/* Conditionally show OT fields */}
                    {newTask.isOT && (
                    <div className="flex flex-col gap-2">
                        <input
                        type="time"
                        placeholder="Time In"
                        value={newTask.timeIn}
                        onChange={(e) => setNewTask({ ...newTask, timeIn: e.target.value })}
                        className="p-2 border rounded-md"
                        />
                        <input
                        type="time"
                        placeholder="Time Out"
                        value={newTask.timeOut}
                        onChange={(e) => setNewTask({ ...newTask, timeOut: e.target.value })}
                        className="p-2 border rounded-md"
                        />
                        <input
                        type="text"
                        placeholder="OT Task"
                        value={newTask.otTask}
                        onChange={(e) => setNewTask({ ...newTask, otTask: e.target.value })}
                        className="p-2 border rounded-md"
                        />
                    </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        className="bg-gray-400 text-white p-2 rounded-md"
                        onClick={() => setShowModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white p-2 rounded-md"
                    >
                        {editingTask ? "Update Task" : "Add Task"}
                    </button>
                    </div>
                </form>
                </div>
            </div>
            )}


    </div>
  );
}

export default Main;
