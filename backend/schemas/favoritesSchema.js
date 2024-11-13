const pool = require('../config/db');
const favoritesSchemaCheck = async () => { 
    const query = `CREATE TABLE IF NOT EXISTS favorites (
      itemId INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      placeId VARCHAR(255) NOT NULL
)`;

    try{
        await pool.execute(query);
        console.log("Favorites schema checked");
    }catch(err){
        console.error("Favorites table creation error", err);
    }

}

module.exports = {
    favoritesSchemaCheck
};