const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Set up multer for profile picture storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/"); // Directory for storing profile pictures
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Get user profile
router.get("/profile/:id", (req, res) => {
  const userId = req.params.id;
  const sql =
    "SELECT full_name, about_me, profile_picture FROM users WHERE id = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results[0]);
  });
});

// Update user profile
router.put("/profile/:id", upload.single("profile_picture"), (req, res) => {
  const userId = req.params.id;
  const { full_name, about_me } = req.body;
  const profilePicture = req.file ? req.file.path : null; // Check if a new profile picture is uploaded

  const sql = `
    UPDATE users 
    SET full_name = ?, about_me = ?, profile_picture = ?
    WHERE id = ?
  `;

  db.query(sql, [full_name, about_me, profilePicture, userId], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "Profile updated successfully!" });
  });
});

module.exports = router;
