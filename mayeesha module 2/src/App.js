import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isChecklist, setIsChecklist] = useState(false);
  const [timerMode, setTimerMode] = useState("Pomodoro"); // Pomodoro or Regular
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default Pomodoro time
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Task Management
  const handleAddTask = () => {
    if (!taskName) return;
    setTasks([
      ...tasks,
      { name: taskName, completed: false, importance: "Normal" },
    ]);
    setTaskName("");
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleImportanceChange = (index, importance) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].importance = importance;
    setTasks(updatedTasks);
  };

  // Timer Logic
  useEffect(() => {
    let timer = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleTimerReset = () => {
    setTimeLeft(timerMode === "Pomodoro" ? 25 * 60 : 15 * 60); // Default times
    setIsTimerRunning(false);
  };

  const switchTimerMode = () => {
    setTimerMode(timerMode === "Pomodoro" ? "Regular" : "Pomodoro");
    setTimeLeft(timerMode === "Pomodoro" ? 15 * 60 : 25 * 60); // Switch times
    setIsTimerRunning(false);
  };

  return (
    <div className="App">
      <h1>Task Manager with Timer</h1>

      {/* Task Input */}
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter a task..."
      />
      <button onClick={handleAddTask}>Add Task</button>

      {/* Toggle Checklist/To-Do List */}
      <button
        onClick={() => setIsChecklist(!isChecklist)}
        className={isChecklist ? "active" : ""}
      >
        {isChecklist ? "Switch to To-Do List" : "Switch to Checklist"}
      </button>

      {/* Task List */}
      <ul>
        {tasks.map((task, index) => (
          <li
            key={index}
            className={`TaskItem ${task.importance
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {isChecklist && (
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(index)}
              />
            )}
            <span>{task.name}</span>
            <select
              value={task.importance}
              onChange={(e) => handleImportanceChange(index, e.target.value)}
            >
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Highly Important">Highly Important</option>
            </select>
            <button onClick={() => handleDeleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Completion Progress */}
      {isChecklist && (
        <div className="Progress">
          <progress
            value={tasks.filter((task) => task.completed).length}
            max={tasks.length}
          />
          <p>
            {tasks.filter((task) => task.completed).length} / {tasks.length}{" "}
            tasks completed
          </p>
        </div>
      )}

      {/* Timer Section */}
      <div className="Timer">
        <h2>{timerMode} Timer</h2>
        <p>{formatTime(timeLeft)}</p>
        <button onClick={handleTimerToggle}>
          {isTimerRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleTimerReset}>Reset</button>
        <button onClick={switchTimerMode}>
          Switch to {timerMode === "Pomodoro" ? "Regular" : "Pomodoro"}
        </button>
      </div>
    </div>
  );
}

export default App;
