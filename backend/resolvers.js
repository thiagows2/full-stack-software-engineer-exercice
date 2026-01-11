const db = require("./db");

const MAX_TITLE_LENGTH = 255;

module.exports = {
  Query: {
    tasks: async () => {
      try {
        const tasks = await db("tasks")
          .orderBy("completed", "asc")
          .orderBy("created_at", "desc");
        return tasks;
      } catch (error) {
        throw new Error(`Failed to fetch tasks: ${error.message}`);
      }
    },
  },

  Mutation: {
    createTask: async (_, { title }) => {
      if (!title || title.trim() === "") {
        throw new Error("Title cannot be empty");
      }

      if (title.length > MAX_TITLE_LENGTH) {
        throw new Error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`);
      }

      try {
        const [task] = await db("tasks")
          .insert({ title: title.trim(), completed: false })
          .returning("*");
        return task;
      } catch (error) {
        throw new Error(`Failed to create task: ${error.message}`);
      }
    },

    toggleTask: async (_, { id }) => {
      const task = await db("tasks").where("id", id).first();

      if (!task) {
        throw new Error(`Task with id ${id} not found`);
      }

      try {
        const [updatedTask] = await db("tasks")
          .where("id", id)
          .update({ completed: !task.completed })
          .returning("*");
        return updatedTask;
      } catch (error) {
        throw new Error(`Failed to toggle task: ${error.message}`);
      }
    },
  },
};
