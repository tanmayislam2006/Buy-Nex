const express = require("express");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", ""],
  })
);
app.use(express.json());
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.get("/", (req, res) => {
  res.send("Hello server");
});
async function run() {
  try {
    const BuyNexDB = client.db("BuyNex");
    const usersCollection = BuyNexDB.collection("users");
    //  create a connection to the MongoDB cluster
    // -------------------------- user api is here-----------------------
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });
    app.post("/register", async (req, res) => {
      // make a vaildation that same email does not exist
      const email = req.body.email;
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: email });
      if (existingUser) {
        return res.status(400).send({ message: "User already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // ---------------------------- user api is here-----------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  const time = new Date().toLocaleTimeString();
  console.log(`Server is running on ${time} port http://localhost:${port}`);
});
