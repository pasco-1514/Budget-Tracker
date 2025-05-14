const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expenseRoutes = require("./routes/expenses");

// Initialize express app
const app = express();

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method")); // To support PUT and DELETE in forms

// Routes
app.use("/", expenseRoutes);
app.use("/", require("./routes/authRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { error: err });
});

// Start server
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// End
