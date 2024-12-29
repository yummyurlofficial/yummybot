const fs = require("fs");
const { get } = require("http");

// Ensure database file exists
if (!fs.existsSync("database.json")) {
  fs.writeFileSync("database.json", JSON.stringify({}, null, 2));
}

// Helper: Read the database file
function getDatabaseData() {
  try {
    return JSON.parse(fs.readFileSync("database.json", "utf8"));
  } catch (error) {
    return {}; // Return an empty object if the file doesn't exist or is unreadable
  }
}

// Helper: Write to the database file
function writeDatabaseData(data) {
  fs.writeFileSync("database.json", JSON.stringify(data, null, 2));
}

// Function: Save or add data
function saveUserData(chatId, dataKey, dataValue) {
  const dbData = getDatabaseData();
  if (!dbData[chatId]) {
    dbData[chatId] = {}; // Initialize new object for chatId if it doesn't exist
  }
  dbData[chatId][dataKey] = dataValue; // Add or update the key-value pair
  writeDatabaseData(dbData);
}

// Function: Update existing data
function updateUserData(chatId, dataKey, newData) {
  const dbData = getDatabaseData();
  if (dbData[chatId] && dbData[chatId][dataKey] !== undefined) {
    dbData[chatId][dataKey] = newData; // Update the value of the specified key
    writeDatabaseData(dbData);
    return true; // Update was successful
  }
  return false; // Key or chatId doesn't exist
}

// Function: Remove a specific key
function removeUserData(chatId, dataKey) {
  const dbData = getDatabaseData();
  if (dbData[chatId] && dbData[chatId][dataKey] !== undefined) {
    delete dbData[chatId][dataKey]; // Remove the specific key
    if (Object.keys(dbData[chatId]).length === 0) {
      delete dbData[chatId]; // If no keys remain, delete the chatId entry
    }
    writeDatabaseData(dbData);
    return true; // Removal was successful
  }
  return false; // Key or chatId doesn't exist
}

// Function: Check if a key exists
function hasKey(chatId, dataKey) {
  const dbData = getDatabaseData();
  return dbData[chatId] && dbData[chatId][dataKey] !== undefined;
}

// Additional: Get specific data for a user
function getUserData(chatId, dataKey) {
  const dbData = getDatabaseData();
  return dbData[chatId] ? dbData[chatId][dataKey] : undefined;
}

// Additional: Remove entire user data
function removeChatId(chatId) {
  const dbData = getDatabaseData();
  if (dbData[chatId]) {
    delete dbData[chatId];
    writeDatabaseData(dbData);
    return true; // Successfully removed
  }
  return false; // ChatId doesn't exist
}

// Additional: Get all data for a specific chatId
function getAllUserData(chatId) {
  const dbData = getDatabaseData();
  return dbData[chatId] || {}; // Return data for the chatId or an empty object
}

// Additional: Check if chatId exists
function hasChatId(chatId) {
  const dbData = getDatabaseData();
  return !!dbData[chatId];
}


// Export all functions
module.exports = {
  saveUserData,
  updateUserData,
  removeUserData,
  hasKey,
  getUserData,
  removeChatId,
  getAllUserData,
  hasChatId,
  getDatabaseData,
};

