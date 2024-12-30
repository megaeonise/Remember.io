import React from "react";

const TaskItem = ({ task, onToggle }) => {
  const importanceStyle =
    task.priority === "high" ? { fontWeight: "bold", color: "red" } : {};

  return (
    <div style={importanceStyle}>
      <input type="checkbox" checked={task.completed} onChange={onToggle} />
      <span>{task.name}</span>
    </div>
  );
};

export default TaskItem;
