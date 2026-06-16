import { useEffect, useState } from "react";
import { getMe } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/task.service";

function Dashboard() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe(token);
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTasks = async () => {
      try {
        const data = await getTasks(token);
        setTasks(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreateTask = async () => {
    try {
      await createTask(token, {
        title,
      });
      const updatedTasks = await getTasks(token);
      setTasks(updatedTasks.data);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(token, taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updated = await updateTask(token, task.id, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updated.data : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateTask(token, editingId, {
        title: editTitle,
      });

      setTasks(
        tasks.map((task) => (task.id === editingId ? updated.data : task)),
      );

      setEditingId(null);
      setEditTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </>
      )}
      <button onClick={handleLogout}>Logout</button>

      <h2>My Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <button onClick={handleSaveEdit}>Save</button>
              </>
            ) : (
              <>
                {task.title}

                <button onClick={() => handleEditClick(task)}>Edit</button>
              </>
            )}

            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleCreateTask}>Add Task</button>
    </div>
  );
}

export default Dashboard;
