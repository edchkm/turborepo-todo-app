// server.js
// This is the main entry point for our Express application.

const express = require("express");
const path = require("path");
const { initializeDatabase } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function main() {
  const db = await initializeDatabase();

  app.get("/api/todos", async (req, res) => {
    try {
      const todos = await db.all("SELECT * FROM todos ORDER BY id DESC");

      res.json(
        todos.map((todo) => ({
          ...todo,
          completed: !!todo.completed,
        }))
      );
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve todos." });
    }
  });

  app.post("/api/todos", async (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    try {
      const result = await db.run(
        "INSERT INTO todos (title, completed) VALUES (?, ?)",
        [title, 0]
      );
      const newTodo = await db.get(
        "SELECT * FROM todos WHERE id = ?",
        result.lastID
      );
      res.status(201).json({
        ...newTodo,
        completed: !!newTodo.completed,
        createdAt: newTodo.createdAt,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create todo." });
    }
  });

  app.put("/api/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ error: "Completed status must be a boolean." });
    }

    try {
      const completedInt = completed ? 1 : 0;
      await db.run("UPDATE todos SET completed = ? WHERE id = ?", [
        completedInt,
        id,
      ]);
      const updatedTodo = await db.get("SELECT * FROM todos WHERE id = ?", id);
      if (!updatedTodo) {
        return res.status(404).json({ error: "Todo not found." });
      }
      res.json({ ...updatedTodo, completed: !!updatedTodo.completed });
    } catch (error) {
      res.status(500).json({ error: "Failed to update todo." });
    }
  });

  app.delete("/api/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.run("DELETE FROM todos WHERE id = ?", id);
      if (result.changes === 0) {
        return res.status(404).json({ error: "Todo not found." });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete todo." });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();
