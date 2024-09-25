// ideaController.js
const connection = require("./db");

// Insert an idea
const insertIdea = (category, description, userLogin, hashtags, callback) => {
  const query = `INSERT INTO ideas (category, description, userlogin, hashtags, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
  connection.query(
    query,
    [category, description, userLogin, hashtags],
    (err, result) => {
      if (err) {
        console.error("Error inserting idea:", err);
        callback(err);
      } else {
        console.log("Idea inserted successfully:", result.insertId);
        callback(null, result.insertId);
      }
    }
  );
};

/*
// Update an idea
const updateIdea = (id, category, description, hashtags, callback) => {
  const query = `UPDATE ideas SET category = ?, description = ?, hashtags = ? WHERE id = ?`;
  connection.query(
    query,
    [category, description, hashtags, id],
    (err, result) => {
      if (err) {
        console.error("Error updating idea:", err);
        callback(err);
      } else {
        console.log("Idea updated successfully:", result.affectedRows);
        callback(null, result.affectedRows);
      }
    }
  );
};


// Delete an idea
const deleteIdea = (id, callback) => {
  const query = `DELETE FROM ideas WHERE id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting idea:", err);
      callback(err);
    } else {
      console.log("Idea deleted successfully:", result.affectedRows);
      callback(null, result.affectedRows);
    }
  });
};
*/

// Get all ideas
const getAllIdeas = (callback) => {
    //const query = `SELECT * FROM ideas ORDER BY created_at DESC`;
const query = `select ideas.id id, ideas.category category, ideas.description description, ideas.created_at created_at, ideas.hashtags hashtag, count(reactions.idea_id) reactioncount from ideas, reactions where ideas.id=reactions.idea_id group by reactions.idea_id order by
reactioncount desc`;

console.log("Query for idea inside getAllIdeas");

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching ideas:', err);
            callback(err);
        } else {
            callback(null, results);
        }
    });
};

// module.exports = { insertIdea, updateIdea, deleteIdea, getAllIdeas };
module.exports = { insertIdea, getAllIdeas };