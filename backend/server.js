require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { favoritesSchemaCheck } = require('./schemas/favoritesSchema');
const { userSchemaCheck } = require('./schemas/userSchema');
const { tripsSchemaCheck } = require('./schemas/tripsSchema');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes/authRoutes"));
app.use("/favorites", require("./routes/favoritesRoutes"));
app.use("/trips", require("./routes/tripsRoutes"));
app.use("/weather", require("./routes/weatherRoutes"));
app.use("/google-places", require("./routes/googlePlacesRoutes"));

// Global Error Handler Middleware function
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went really wrong",
  });
});

// Listen on pc port
const PORT = process.env.PORT || 3000;

async function initSchemas() {
  try {
    await userSchemaCheck();
    await tripsSchemaCheck();
    await favoritesSchemaCheck();

    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Eroare la inițializarea schemelor bazei de date:", err);
    process.exit(1);
  }
}

initSchemas();