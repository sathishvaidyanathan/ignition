// ideas.js
const express = require("express");
const router = express.Router();
const ideaController = require("./ideaController");

// Route to insert an idea
router.post("http://localhost:8081/ideas", (req, res) => {
  const { category, description, userLogin, hashtags } = req.body;
  ideaController.insertIdea(
    category,
    description,
    userLogin,
    hashtags,
    (err, ideaId) => {
      if (err) {
        res.status(500).send("Error inserting idea");
      } else {
        res.status(201).send({ id: ideaId });
      }
    }
  );
});

// Route to update an idea
router.put("http://localhost:8081/ideas:id", (req, res) => {
  const id = req.params.id;
  const { category, description, hashtags } = req.body;
  ideaController.updateIdea(
    id,
    category,
    description,
    hashtags,
    (err, affectedRows) => {
      if (err) {
        res.status(500).send("Error updating idea");
      } else {
        res.status(200).send({ updated: affectedRows });
      }
    }
  );
});

// Route to delete an idea
router.delete("http://localhost:8081/ideas:id", (req, res) => {
  const id = req.params.id;
  ideaController.deleteIdea(id, (err, affectedRows) => {
    if (err) {
      res.status(500).send("Error deleting idea");
    } else {
      res.status(200).send({ deleted: affectedRows });
    }
  });
});

// Route to get all ideas
router.get("http://localhost:8081/ideas", (req, res) => {

  ideaController.getAllIdeas((err, ideas) => {
    if (err) {
      res.status(500).send("Error fetching ideas");
    } else {
      res.status(200).json(ideas);
    }
  });
});


// Add or update reaction for an idea
router.post("http://localhost:8081/ideas/:id/reactions", (req, res) => {
  const { id } = req.params; // idea_id
  const { user_id, reaction_type } = req.body;

  const sql = `
      INSERT INTO reactions (idea_id, userlogin, reaction_type)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE reaction_type = VALUES(reaction_type), timestamp = CURRENT_TIMESTAMP;
    `;

  db.query(sql, [id, userlogin, reaction_type], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "Reaction saved successfully." });
  });
});

// Get reaction counts for each idea
router.get("http://localhost:8081/ideas/:id/reactions", (req, res) => {
  const { id } = req.params;
  console.log("select reaction count");
  const sql = `
      SELECT reaction_type, COUNT(*) AS count
      FROM reactions
      WHERE idea_id = ?
      GROUP BY reaction_type;
    `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

module.exports = router;
