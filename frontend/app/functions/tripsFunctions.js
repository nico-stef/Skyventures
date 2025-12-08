import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

// Trip CRUD operations
export const getUserTrips = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/trips?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to fetch trips" };
    }
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

export const getTripById = async (tripId, userId) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to fetch trip" };
    }
  } catch (error) {
    console.error("Error fetching trip:", error);
    throw error;
  }
};

export const createTrip = async (userId, destination, startDate, endDate, budget, description) => {
  try {
    const body = { 
      userId, 
      destination, 
      startDate, 
      endDate, 
      budget: budget || 0, 
      description: description || '' 
    };

    const response = await fetch(`${API_URL}/trips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to create trip" };
    }
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

export const updateTrip = async (tripId, userId, destination, startDate, endDate, budget, description) => {
  try {
    const body = { 
      userId, 
      destination, 
      startDate, 
      endDate, 
      budget, 
      description 
    };

    const response = await fetch(`${API_URL}/trips/${tripId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to update trip" };
    }
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

export const deleteTrip = async (tripId, userId) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to delete trip" };
    }
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};

// Itinerary operations
export const getItineraryItems = async (tripId, userId) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/itinerary?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to fetch itinerary items" };
    }
  } catch (error) {
    console.error("Error fetching itinerary items:", error);
    throw error;
  }
};

export const addItineraryItem = async (tripId, userId, itemData) => {
  try {
    const body = { 
      userId,
      dayDate: itemData.dayDate,
      placeName: itemData.placeName,
      placeId: itemData.placeId || null,
      placeAddress: itemData.placeAddress || null,
      placePhoto: itemData.placePhoto || null,
      placeRating: itemData.placeRating || null,
      notes: itemData.notes || '',
      orderIndex: itemData.orderIndex || 0
    };

    const response = await fetch(`${API_URL}/trips/${tripId}/itinerary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to add itinerary item" };
    }
  } catch (error) {
    console.error("Error adding itinerary item:", error);
    throw error;
  }
};

export const updateItineraryItem = async (tripId, itemId, userId, itemData) => {
  try {
    const body = { 
      userId,
      dayDate: itemData.dayDate,
      placeName: itemData.placeName,
      notes: itemData.notes,
      orderIndex: itemData.orderIndex
    };

    const response = await fetch(`${API_URL}/trips/${tripId}/itinerary/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to update itinerary item" };
    }
  } catch (error) {
    console.error("Error updating itinerary item:", error);
    throw error;
  }
};

export const deleteItineraryItem = async (tripId, itemId, userId) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/itinerary/${itemId}?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to delete itinerary item" };
    }
  } catch (error) {
    console.error("Error deleting itinerary item:", error);
    throw error;
  }
};

// Expense operations
export const getExpenses = async (tripId, userId) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/expenses?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to fetch expenses" };
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const addExpense = async (tripId, userId, expenseData) => {
  try {
    const body = { 
      userId,
      category: expenseData.category,
      amount: expenseData.amount,
      description: expenseData.description || '',
      expenseDate: expenseData.expenseDate
    };

    const response = await fetch(`${API_URL}/trips/${tripId}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to add expense" };
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const deleteExpense = async (tripId, expenseId, userId) => {
  try {
    const response = await fetch(`${API_URL}/trips/${tripId}/expenses/${expenseId}?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.error || "Failed to delete expense" };
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};
