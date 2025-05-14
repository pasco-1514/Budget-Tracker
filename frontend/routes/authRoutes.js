const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login"); // Render login page
});

router.get("/signup", (req, res) => {
  res.render("signup"); // Render signup page
});

module.exports = router;