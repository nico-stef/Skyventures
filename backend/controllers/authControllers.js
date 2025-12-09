const { v4: uuid } = require("uuid"); //import v4 method and rename to uuid
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require('../config/db')
require("dotenv").config();
const saltRounds = 10;

const register = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        res.status(400).json({ error: "Fields cannot be empty!" });
        return;
    }

    //check if user with the same email or username already exists
    let [result] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (result.length > 0) {
        if (result[0].email === email)
            res.status(500).json({ message: "There is already a user created with this email" });
        return;
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        bcrypt.hash(password, salt, (err, hashedPassword) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            const user = {
                userId: uuid(),
                email,
                username,
                password: hashedPassword,
            };

            pool.query(
                "INSERT INTO users (userId, email, username, password) VALUES (?, ?, ?, ?)",
                [user.userId, user.email, user.username, user.password]
            )
                .then(() => {
                    res.status(201).json({ message: "User created successfully!" });
                })
                .catch((error) => {
                    res.status(500).json({ error: error.message });
                });

        });
    });

};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email or Password fields cannot be empty!" });
        return;
    }

    try {
        const [rows] = await pool.query( //rows = array of objects
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        let userFound = null;

        // Check if user exists
        if (rows.length > 0) {
            userFound = rows[0]; // return the first matching user object
        }

        if (userFound) { //if user exists
            const validate = await bcrypt.compare(req.body.password, userFound.password);

            if (validate) {
                // Generate JWT token
                const token = jwt.sign(
                    {
                        userId: userFound.userId,
                        email: userFound.email,
                        username: userFound.username
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' } // Token expires in 7 days
                );

                res.status(200).json({
                    token: token,
                    message: "Login successful"
                });
            }
            else {
                res.status(401).json({ message: "Incorrect password!" });//returns an object with property message
            }
        }
        else {
            res.status(404).json({ message: "User doesn't exist" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const logout = async (req, res) => {
    try {
        // With JWT, logout is handled client-side by removing the token
        // Server doesn't need to do anything
        return res.status(200).json({ message: "Logout successful. Please remove token from client." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login,
    logout
};