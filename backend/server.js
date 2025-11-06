require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const { favoritesSchemaCheck } = require('./schemas/favoritesSchema');
const { userSchemaCheck } = require('./schemas/userSchema');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'secret-session',
  resave: false,
  saveUninitialized: false
}));

app.use("/", require("./routes/authRoutes"));
app.use("/favorites", require("./routes/favoritesRoutes"));

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
Promise.all([
  favoritesSchemaCheck(),
  userSchemaCheck()
])
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch(err => {
    console.error("Eroare la inițializarea schemelor bazei de date:", err);
    process.exit(1);
  });
