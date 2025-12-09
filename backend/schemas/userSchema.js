const pool = require('../config/db')

const userSchemaCheck = async () => {
  const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
      userId VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
  );
  `;

  try {
    await pool.execute(userSchema);
    console.log("Users schema checked");
  } catch (err) {
    console.error("Users table creation error", err);
  }
}

module.exports = {
  userSchemaCheck
};