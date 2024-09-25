const express = require ('express');
const bodyParser = require("body-parser");
const routes = require("./api/ideas");
const app = express();

// Middleware
app.use(bodyParser.json());  // To parse JSON requests

// Use the routes from routes.js
app.use('./api', routes);

const mysql = require ('mysql');
const cors = require ('cors');
const port = 8081;

const db = mysql.createConnection({
  host: "localhost",
  user: "ignite",
  password: "password",
  database: "testingdb",
});

app.use(cors())

app.get('/', (re,res) => {

    return res.json ("Printing hello from backend side");
});


app.listen(port, () => {

    console.log ("hello I'm the App listening on port 8081");
})


// Route to get ideas with filtering and sorting
app.get("/ideas", (req, res) => {

  const searchTerm = req.query.search || ""; // Get search term from query params
  const sortBy = req.query.sortBy || "none"; // Default to 'none' if no sortBy parameter is provided
  let query = "SELECT * FROM ideas WHERE description LIKE ? OR category LIKE ? OR hashtags LIKE ?"; // Base query with search

  // Search term to use in SQL query (wildcards added for LIKE)
  const searchValue = `%${searchTerm}%`;
  // Sorting logic
  if (sortBy === "created_at") {
    query += " ORDER BY created_at DESC";
  } else if (sortBy === "category") {
    query += " ORDER BY category ASC";
  } else if (sortBy === "reactions") {
    query = `select ideas.id id, ideas.category category, ideas.description description, ideas.created_at created_at, ideas.hashtags hashtag, count(reactions.idea_id) reactioncount from ideas, reactions where ideas.id=reactions.idea_id group by reactions.idea_id order by
reactioncount desc`;
  } else {
    // Default sort: by created_at, descending
    query += " ORDER BY created_at DESC";
  }

  // Run the query with search values
  db.query(query, [searchValue, searchValue, searchValue], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(data);
  });
});


//////

// Get reaction counts for each idea
app.get("/ideas/:id/reactions", (req, res) => {
  const { id } = req.params;
  console.log("reached server.js -- select reaction count");
  const sql = `
      SELECT reaction_type, COUNT(*) AS count
      FROM reactions
      WHERE idea_id = ?
      GROUP BY reaction_type;
    `;
console.log(sql + "==>>" + id);
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});


// Add or update reaction for an idea
app.post("/ideas/:id/reactions", (req, res) => {
  const { id } = req.params; // idea_id
  const { userlogin, reaction } = req.body;

    console.log("Route hit:", req.params.id, req.body);

  const sql = `
      INSERT INTO reactions (idea_id, userlogin, reaction_type)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE reaction_type = VALUES(reaction_type), timestamp = CURRENT_TIMESTAMP;
    `;

    console.log (sql);

  db.query(sql, [id, userlogin, reaction], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "Reaction saved successfully." });
  });
});

/////


app.post('/ideas', (req, res) => {
    const { category, description, userlogin, hashtags } = req.body;
    db.query(
      "INSERT INTO ideas (category, description, userlogin, hashtags) VALUES (?, ?, ?, ?)",
      [category, description, "sathishv", hashtags],
      (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId });
      }
    );
});