const db = require("./db");

module.exports = {
  Query: {
    tasks: async () => {
      const tasks = await db("tasks");
      return tasks;
    },
  },

  Mutation: {
    createTask: async (_, { title }) => {
      const [id] = await db("tasks").insert({ title, completed: false });
      const task = await db("tasks").where("id", id).first();
      return task;
    },

    toggleTask: async (_, { id }) => {
      const task = await db("tasks").where("id", id).first();
      await db("tasks").where("id", id).update({ completed: !task.completed });
      const updatedTask = await db("tasks").where("id", id).first();
      return updatedTask;
    },
  },
};
