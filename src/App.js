// App.js
import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : {
          todo: [
            {
              taskId: 1,
              taskName: "1",
              projectName: "Project ABC",
              description: "Task is the unit",
            },
            {
              taskId: 2,
              taskName: "2",
              projectName: "Project XYZ",
              description: "Task is the unit",
            },
            {
              taskId: 3,
              taskName: "3",
              projectName: "Project DEF",
              description: "Task is the unit",
            },
          ],
          inProgress: [],
          review: [],
          done: [],
        };
  });

  const [newTask, setNewTask] = useState("");
  const [taskId, setTaskId] = useState(() => {
    const savedTaskId = localStorage.getItem("taskId");
    return savedTaskId ? parseInt(savedTaskId, 10) : 4;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("taskId", taskId);
  }, [taskId]);

  const moveTask = (taskIndex, source, destination) => {
    const taskToMove = tasks[source][taskIndex];
    setTasks((prevTasks) => ({
      ...prevTasks,
      [source]: prevTasks[source].filter((_, index) => index !== taskIndex),
      [destination]: [...prevTasks[destination], taskToMove],
    }));
  };

  const addNewTask = () => {
    if (newTask.trim() !== "") {
      const updatedTask = {
        taskId: taskId,
        taskName: newTask,
        projectName: "New Project",
        description: "Task is the unit",
      };
      setTasks((prevTasks) => ({
        ...prevTasks,
        todo: [...prevTasks.todo, updatedTask],
      }));
      setNewTask("");
      setTaskId(taskId + 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addNewTask();
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e, targetColumn) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumn = tasks.todo.find(
      (task) => task.taskId.toString() === taskId
    )
      ? "todo"
      : tasks.inProgress.find((task) => task.taskId.toString() === taskId)
      ? "inProgress"
      : tasks.review.find((task) => task.taskId.toString() === taskId)
      ? "review"
      : "done";

    if (sourceColumn !== targetColumn) {
      moveTask(
        tasks[sourceColumn].findIndex(
          (task) => task.taskId.toString() === taskId
        ),
        sourceColumn,
        targetColumn
      );
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="App">
      <h1>Task Board</h1>
      <div className="board">
        <div
          className="column todo"
          onDrop={(e) => handleDrop(e, "todo")}
          onDragOver={allowDrop}
        >
          <h2>To Do</h2>
          <div className="cards">
            {tasks.todo.map((task, index) => (
              <div
                className="card todo-card"
                key={task.taskId}
                draggable
                onDragStart={(e) => handleDragStart(e, task.taskId)}
                onClick={() => moveTask(index, "todo", "inProgress")}
              >
                <p>Task: {task.taskName}</p>
                <p>Project: {task.projectName}</p>
                <p>Description: {task.description}</p>
              </div>
            ))}
            <div className="add-card">
              <input
                type="text"
                placeholder="Add new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={addNewTask}>Add</button>
            </div>
          </div>
        </div>
        <div
          className="column in-progress"
          onDrop={(e) => handleDrop(e, "inProgress")}
          onDragOver={allowDrop}
        >
          <h2>In Progress</h2>
          <div className="cards">
            {tasks.inProgress.map((task, index) => (
              <div
                className="card inProgress-card"
                key={task.taskId}
                draggable
                onDragStart={(e) => handleDragStart(e, task.taskId)}
                onClick={() => moveTask(index, "inProgress", "review")}
              >
                <p>Task: {task.taskName}</p>
                <p>Project: {task.projectName}</p>
                <p>Description: {task.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="column review"
          onDrop={(e) => handleDrop(e, "review")}
          onDragOver={allowDrop}
        >
          <h2>Review</h2>
          <div className="cards">
            {tasks.review.map((task, index) => (
              <div
                className="card review-card"
                key={task.taskId}
                draggable
                onDragStart={(e) => handleDragStart(e, task.taskId)}
                onClick={() => moveTask(index, "review", "done")}
              >
                <p>Task: {task.taskName}</p>
                <p>Project: {task.projectName}</p>
                <p>Description: {task.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="column done"
          onDrop={(e) => handleDrop(e, "done")}
          onDragOver={allowDrop}
        >
          <h2>Done</h2>
          <div className="cards">
            {tasks.done.map((task, index) => (
              <div
                className="card done-card"
                key={task.taskId}
                draggable
                onDragStart={(e) => handleDragStart(e, task.taskId)}
                onClick={() => console.log("Click on Done")}
              >
                <p>Task: {task.taskName}</p>
                <p>Project: {task.projectName}</p>
                <p>Description: {task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
