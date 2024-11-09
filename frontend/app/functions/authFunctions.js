const API_URL = "http://192.168.0.100:3000";

export const login = async (email, password) => {
  try {
    const body = { email, password };
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json(); //returns an object or an error if parsing fails
    if (response.ok) {
      //returns true if status code 200-299, successful request
      return data; //parsed data from json to object, returned from response
    } else {
      return { error: data.message || "error" };
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const body = { username, email, password };

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json(); //returns an object or an error if parsing fails
    if (response.ok) {
      //returns true if status code 200-299, successful request
      return result;
    } else {
      return { error: result.message || "error" };
    }
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};
