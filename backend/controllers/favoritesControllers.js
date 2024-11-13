const pool = require('../config/db');
const {favoritesSchema} = require('../schemas/favoritesSchema');
require("dotenv").config();

const addToFavorites = async (req, res) => {
    const {userId, placeId} = req.body;

    try {
        const [rows] = await pool.query( //rows = array of objects
            "SELECT * FROM favorites WHERE placeId = ? AND userId = ?",
            [placeId, userId]
        );

        //check if place is in database already
        if(rows.length > 0){
            res.status(500).json({ message: "The place is already added to favorites" });
        }

        await pool.query(
            'INSERT INTO favorites (userId, placeId) VALUES (?, ?)',
            [userId, placeId]
        );

        res.status(200).json({ message: 'Place added to favorites successfully.' });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

const getFavorites = async (req, res) => {
    const userId = req.params.userId;

    try{
        const [favorites] = await pool.query( //rows = array of objects
            "SELECT * FROM favorites WHERE userId = ?",
            [userId]
        );

        res.status(200).json(favorites);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addToFavorites,
    getFavorites
}