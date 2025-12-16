
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB_URI;
let db;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    // Connect the client to the server
    // await client.connect(); // In v4.7+ optional but good practice to be explicit if needed, but often not strictly required before accessing db() if using modern drivers. However, standard pattern:
    await client.connect();
    db = client.db("BuyNex");
    console.log("🛢️  Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

function getClient() {
    return client;
}

module.exports = { connectDB, getDB, getClient };
