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
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
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
        description,
      });
      const updatedTasks = await getTasks(token);
      setTasks(updatedTasks.data);
      setTitle("");
      setDescription("");
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
    setEditDescription(task.description || "");
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await updateTask(token, editingId, {
        title: editTitle,
        description: editDescription,
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

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const getInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard">
      {/* Top Navigation */}
      <nav className="topnav">
        <div className="topnav__brand">
          <div className="topnav__logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <span className="topnav__title">TaskFlow</span>
        </div>

        <div className="topnav__right">
          {user && (
            <div className="topnav__user">
              <div className="topnav__avatar">{getInitials(user.email)}</div>
              <div className="topnav__user-info">
                <span className="topnav__user-email">{user.email}</span>
                <span className="topnav__user-role">ID: {user.id}</span>
              </div>
            </div>
          )}
          <button className="btn--logout" onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard__main">
        {/* Greeting */}
        <div className="dashboard__header">
          <h1 className="dashboard__greeting">
            {user ? `Hello, ${user.email.split("@")[0]}` : "Dashboard"}
          </h1>
          <p className="dashboard__summary">
            You have {pendingCount} pending {pendingCount === 1 ? "task" : "tasks"} today
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card__value">{tasks.length}</div>
            <div className="stat-card__label">Total Tasks</div>
          </div>
          <div className="stat-card stat-card--accent">
            <div className="stat-card__value">{completedCount}</div>
            <div className="stat-card__label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{pendingCount}</div>
            <div className="stat-card__label">Pending</div>
          </div>
        </div>

        {/* Create Task */}
        <div className="create-task">
          <h2 className="create-task__title">New Task</h2>
          <div className="create-task__fields">
            <input
              className="create-task__input"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="create-task__textarea"
              placeholder="Add a description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="create-task__actions">
              <button className="btn btn--primary btn--sm" onClick={handleCreateTask}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="task-section">
          <div className="task-section__header">
            <h2 className="task-section__title">My Tasks</h2>
            <span className="task-section__count">{tasks.length} {tasks.length === 1 ? "item" : "items"}</span>
          </div>

          {tasks.length === 0 ? (
            <div className="task-list--empty">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <p>No tasks yet. Create one above to get started!</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? "task-item--completed" : ""} ${editingId === task.id ? "task-item--editing" : ""}`}
                >
                  <label className="task-item__checkbox">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task)}
                    />
                    <span className="task-item__checkbox-visual">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  </label>

                  {editingId === task.id ? (
                    <div className="task-edit">
                      <input
                        className="task-edit__input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        className="task-edit__textarea"
                        placeholder="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <div className="task-edit__actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                        <button className="btn btn--primary btn--sm" onClick={handleSaveEdit}>
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="task-item__content">
                        <div className="task-item__title">{task.title}</div>
                        {task.description && (
                          <div className="task-item__description">{task.description}</div>
                        )}
                      </div>

                      <div className="task-item__actions">
                        <button
                          className="btn btn--icon"
                          onClick={() => handleEditClick(task)}
                          title="Edit task"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="btn btn--danger"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete task"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
