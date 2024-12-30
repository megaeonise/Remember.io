import React, { useState, useEffect } from "react";

const Timer = () => {
  const [isPomodoro, setIsPomodoro] = useState(true); // Pomodoro or regular timer
  const [timeLeft, setTimeLeft] = useState(isPomodoro ? 25 * 60 : 30 * 60); // Default to Pomodoro (25 mins)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      alert("Time's up!");
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(isPomodoro ? 25 * 60 : 30 * 60);
    setIsRunning(false);
  };

  const switchTimerMode = () => {
    setIsPomodoro(!isPomodoro);
    setTimeLeft(isPomodoro ? 30 * 60 : 25 * 60);
    setIsRunning(false);
  };

  return (
    <div>
      <h2>{isPomodoro ? "Pomodoro Timer" : "Regular Timer"}</h2>
      <p>{`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${
        timeLeft % 60
      }`}</p>
      <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={resetTimer}>Reset</button>
      <button onClick={switchTimerMode}>
        {isPomodoro ? "Switch to Regular" : "Switch to Pomodoro"}
      </button>
    </div>
  );
};

export default Timer;
