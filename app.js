const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
app.use(express.json());
let db = null;

const dbPath = path.join(__dirname, "todoApplication.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error : ${e.message}`);
  }
};

initializeDbAndServer();

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasPriorityAndStatusProperty = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasCategoryAndPriorityProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

const hasCategoryAndStatusProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

app.get("/todos/", async (request, response) => {
  const { search_q = "", status, priority, category, duedate } = request.query;
  let data = null;
  let getTodosQuery = "";

  switch (true) {
    case hasStatusProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo LIKE '${search_q}'
        AND status = '${status}';
        `;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo LIKE '${search_q}'
        AND priority = '${priority}';`;
      break;
    case hasCategoryProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo LIKE '${search_q}'
        AND category = '${category}';`;
      break;
    case hasPriorityAndStatusProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo LIKE '${search_q}'
        AND status = '${status}'
        AND priority = '${priority}';`;
      break;
    case hasCategoryAndPriorityProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo LIKE '${search_q}'
        AND category = '${category}'
        AND priority = '${priority}';`;
      break;
    case hasCategoryAndStatusProperty(request.query):
      getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo LIKE '${search_q}'
        AND category = '${category}'
        AND status = '${status}';`;
      break;
    default:
      getTodosQuery = `
        SELECT *
        FROM todo
        WHERE todo LIKE '${search_q}';`;
      break;
  }
  data = await db.all(getTodosQuery);
  response.send(data);
});

module.exports = app;
