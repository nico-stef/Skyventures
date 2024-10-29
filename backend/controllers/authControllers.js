const { v4: uuid } = require("uuid"); //import v4 method and rename to uuid
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require('../config/db')
const {userSchema} = require('../schemas/userSchema');
require("dotenv").config(); 
const saltRounds = 10;

function generateAccessToken(idUser, email) {
    const payload = {
      idUser,
      email
    };
    
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1d' };
  
    return jwt.sign(payload, secret, options);
}

const register = async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        res.status(400).json({ error: "Fields cannot be empty!" });
        return;
    }

    await pool.execute(userSchema);

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

            // Hashing successful, 'hash' contains the hashed password
            const user = {
                userId: uuid(),
                email,
                username,
                password: hashedPassword,
            };

            pool.query(
                "INSERT INTO users (userId, email, username, password) VALUES (?, ?, ?, ?)",
                [user.userId, user.email, user.username,  user.password]
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
            [email] // Parameter for the email
        );

        let userFound = null;

        // Check if user exists
        if (rows.length > 0) {
            userFound = rows[0]; // return the first matching user object
        }

        if (userFound) { //if user exists

            const validate = await bcrypt.compare(req.body.password, userFound.password);

            if (validate) {
                res.status(200).json({
                    iduser: userFound.userId,
                    email: userFound.email,
                    access_token: generateAccessToken(userFound.userId, userFound.email),
                })
            }
            else{
                res.status(401).json({ message: "Incorrect password!"});
            }
        }
        else{
            res.status(404).json({ message: "User doesn't exist" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login
};