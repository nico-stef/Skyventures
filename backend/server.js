require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret-session',
    resave: false,
    saveUninitialized: false
}));

app.use("/", require("./routes/authRoutes"));

// Global Error Handler Middleware function
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong", //It sends a JSON response with the error message and status code.
  });
});

// Listen on pc port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
