import React, { useState } from "react";
import TaskItem from "./TaskItem";
import Checklist from "./Checklist";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        name: newTask,
        completed: false,
        priority: "low",
        startTime: null,
        deadline: null,
      },
    ]);
    setNewTask("");
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  return (
    <div>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>

      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          onToggle={() => toggleTaskCompletion(index)}
        />
      ))}

      <Checklist tasks={tasks} />
    </div>
  );
};

export default TaskList;
