const pool = require('../config/db')

const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
      userId VARCHAR(36) UNIQUE NOT NULL,
      email VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
  )
`;

module.exports = {
    userSchema
};