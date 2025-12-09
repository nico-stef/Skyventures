const pool = require('../config/db');

// Get all trips for a user
const getUserTrips = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const [trips] = await pool.query(
      `SELECT t.*, 
        COALESCE((SELECT SUM(e.amount) FROM expenses e WHERE e.tripId = t.tripId), 0) as totalSpent,
        COALESCE((SELECT COUNT(*) FROM itinerary_items i WHERE i.tripId = t.tripId), 0) as itineraryCount
       FROM trips t
       WHERE t.userId = ?
       ORDER BY t.startDate ASC`,
      [userId]
    );

    res.status(200).json({ trips });
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

// Get single trip details
const getTripById = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const [trips] = await pool.query(
      `SELECT t.*, 
        COALESCE(SUM(e.amount), 0) as totalSpent
       FROM trips t
       LEFT JOIN expenses e ON t.tripId = e.tripId
       WHERE t.tripId = ? AND t.userId = ?
       GROUP BY t.tripId`,
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({ trip: trips[0] });
  } catch (err) {
    console.error("Error fetching trip:", err);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
};

// Create new trip
const createTrip = async (req, res) => {
  const { userId, destination, startDate, endDate, budget, description } = req.body;

  if (!userId || !destination || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO trips (userId, destination, startDate, endDate, budget, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, destination, startDate, endDate, budget || 0, description || '']
    );

    const [newTrip] = await pool.query(
      'SELECT * FROM trips WHERE tripId = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip[0]
    });
  } catch (err) {
    console.error("Error creating trip:", err);
    res.status(500).json({ error: "Failed to create trip" });
  }
};

// Update trip
const updateTrip = async (req, res) => {
  const { tripId } = req.params;
  const { userId, destination, startDate, endDate, budget, description } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE trips 
       SET destination = ?, startDate = ?, endDate = ?, budget = ?, description = ?
       WHERE tripId = ? AND userId = ?`,
      [destination, startDate, endDate, budget, description, tripId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const [updatedTrip] = await pool.query(
      'SELECT * FROM trips WHERE tripId = ?',
      [tripId]
    );

    res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip[0]
    });
  } catch (err) {
    console.error("Error updating trip:", err);
    res.status(500).json({ error: "Failed to update trip" });
  }
};

// Delete trip
const deleteTrip = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    res.status(500).json({ error: "Failed to delete trip" });
  }
};

// Get itinerary items for a trip
const getItineraryItems = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Verify trip belongs to user
    const [trips] = await pool.query(
      'SELECT tripId FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const [items] = await pool.query(
      `SELECT * FROM itinerary_items 
       WHERE tripId = ? 
       ORDER BY dayDate ASC, orderIndex ASC`,
      [tripId]
    );

    res.status(200).json({ items });
  } catch (err) {
    console.error("Error fetching itinerary items:", err);
    res.status(500).json({ error: "Failed to fetch itinerary items" });
  }
};

// Add itinerary item
const addItineraryItem = async (req, res) => {
  const { tripId } = req.params;
  const {
    userId,
    dayDate,
    startTime,
    placeName,
    placeId,
    placeAddress,
    placePhoto,
    placeRating,
    notes,
    orderIndex
  } = req.body;

  console.log('Received itinerary item data:');
  console.log('tripId:', tripId);
  console.log('userId:', userId);
  console.log('dayDate:', dayDate);
  console.log('startTime:', startTime);
  console.log('placeName:', placeName);
  console.log('Full body:', req.body);

  if (!userId || !dayDate || !placeName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify trip belongs to user
    const [trips] = await pool.query(
      'SELECT tripId FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    console.log('Inserting into database with startTime:', startTime);

    const [result] = await pool.query(
      `INSERT INTO itinerary_items 
       (tripId, dayDate, startTime, placeName, placeId, placeAddress, placePhoto, placeRating, notes, orderIndex) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tripId, dayDate, startTime, placeName, placeId, placeAddress, placePhoto, placeRating, notes, orderIndex || 0]
    );

    const [newItem] = await pool.query(
      'SELECT * FROM itinerary_items WHERE itemId = ?',
      [result.insertId]
    );

    console.log('Created item:', newItem[0]);

    res.status(201).json({
      message: "Itinerary item added successfully",
      item: newItem[0]
    });
  } catch (err) {
    console.error("Error adding itinerary item:", err);
    res.status(500).json({ error: "Failed to add itinerary item" });
  }
};

// Update itinerary item
const updateItineraryItem = async (req, res) => {
  const { tripId, itemId } = req.params;
  const { userId, dayDate, placeName, notes, orderIndex } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Verify trip belongs to user
    const [trips] = await pool.query(
      'SELECT tripId FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const [result] = await pool.query(
      `UPDATE itinerary_items 
       SET dayDate = ?, placeName = ?, notes = ?, orderIndex = ?
       WHERE itemId = ? AND tripId = ?`,
      [dayDate, placeName, notes, orderIndex, itemId, tripId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Itinerary item not found" });
    }

    const [updatedItem] = await pool.query(
      'SELECT * FROM itinerary_items WHERE itemId = ?',
      [itemId]
    );

    res.status(200).json({
      message: "Itinerary item updated successfully",
      item: updatedItem[0]
    });
  } catch (err) {
    console.error("Error updating itinerary item:", err);
    res.status(500).json({ error: "Failed to update itinerary item" });
  }
};

// Delete itinerary item
const deleteItineraryItem = async (req, res) => {
  const { tripId, itemId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Verify trip belongs to user
    const [trips] = await pool.query(
      'SELECT tripId FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const [result] = await pool.query(
      'DELETE FROM itinerary_items WHERE itemId = ? AND tripId = ?',
      [itemId, tripId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Itinerary item not found" });
    }

    res.status(200).json({ message: "Itinerary item deleted successfully" });
  } catch (err) {
    console.error("Error deleting itinerary item:", err);
    res.status(500).json({ error: "Failed to delete itinerary item" });
  }
};

// Get expenses for a trip
const getExpenses = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Verify trip belongs to user
    const [trips] = await pool.query(
      'SELECT tripId FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const [expenses] = await pool.query(
      `SELECT * FROM expenses 
       WHERE tripId = ? 
       ORDER BY expenseDate DESC`,
      [tripId]
    );

    // Get category totals
    const [categoryTotals] = await pool.query(
      `SELECT category, SUM(amount) as total 
       FROM expenses 
       WHERE tripId = ? 
       GROUP BY category`,
      [tripId]
    );

    res.status(200).json({ expenses, categoryTotals });
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Add expense
const addExpense = async (req, res) => {
  const { tripId } = req.params;
  const { userId, category, amount, description, expenseDate } = req.body;

  if (!userId || !category || !amount || !expenseDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Verify trip belongs to user
    const [trips] = await pool.query(
      'SELECT tripId FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const [result] = await pool.query(
      `INSERT INTO expenses (tripId, category, amount, description, expenseDate) 
       VALUES (?, ?, ?, ?, ?)`,
      [tripId, category, amount, description || '', expenseDate]
    );

    const [newExpense] = await pool.query(
      'SELECT * FROM expenses WHERE expenseId = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense[0]
    });
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).json({ error: "Failed to add expense" });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  const { tripId, expenseId } = req.params;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Verify trip belongs to user
    const [trips] = await pool.query(
      'SELECT tripId FROM trips WHERE tripId = ? AND userId = ?',
      [tripId, userId]
    );

    if (trips.length === 0) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const [result] = await pool.query(
      'DELETE FROM expenses WHERE expenseId = ? AND tripId = ?',
      [expenseId, tripId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};

module.exports = {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getItineraryItems,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  getExpenses,
  addExpense,
  deleteExpense
};
