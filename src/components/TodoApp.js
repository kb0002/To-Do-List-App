import React, { useState, useEffect } from "react";

// API URL
const API_URL = "https://dummyjson.com/todos";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");

  // Hardcode userId for this example
  const userId = 1;

  // Load tasks from the API when the app starts
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched tasks:", data.todos); // Debug: log fetched tasks
        setTodos(data.todos);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task using the API (with userId)
  const addTodo = () => {
    if (newTodo.trim() === "") return;
    const newTask = {
      todo: newTodo,
      completed: false,
      userId: userId, // Add userId to the new task
    };

    fetch(API_URL + "/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Added task:", data); // Debug: log added task
        setTodos([...todos, data]); // Ensure the correct data is added to the state
      })
      .catch((error) => console.error("Error adding task:", error));

    setNewTodo(""); // Clear input
  };

  // Toggle task completion using the API
  const toggleComplete = (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Delete a task using the API
  const deleteTodo = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // Filter tasks based on status (all, completed, pending)
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true; // 'all' case
  });

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>

      {/* Add Todo */}
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add Task</button>
      </div>

      {/* Filter */}
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span
              onClick={() => toggleComplete(todo.id)}
              style={{ textDecoration: todo.completed ? "line-through" : "" }}
            >
              {todo.todo}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
