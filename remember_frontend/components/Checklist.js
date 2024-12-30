import React from "react";

const Checklist = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div>
      <h2>Checklist Completion</h2>
      <progress value={completedTasks} max={totalTasks} />
      <span>{completionPercentage}%</span>
    </div>
  );
};

export default Checklist;
