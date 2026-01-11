const knex = require("knex");
const config = require("./knexfile");

const db = knex(config.development);

db.on("query-error", (error, obj) => {
  console.error("Database query error:", error);
  console.error("Query:", obj.sql);
});

db.client.pool.on("createSuccess", () => {
  console.log("Database connection created");
});

db.client.pool.on("createFail", (err) => {
  console.error("Failed to create database connection:", err);
});

db.client.pool.on("destroySuccess", () => {
  console.log("Database connection destroyed");
});

process.on("SIGINT", async () => {
  console.log("Closing database connection pool...");
  await db.destroy();
  process.exit(0);
});

module.exports = db;
