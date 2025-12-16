const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const trackVisit = async (req, res) => {
  try {
    const db = getDB();
    const visitorsCollection = db.collection("visitors");
    const { sellerEmail, productId, userEmail } = req.body;

    if (!sellerEmail || !productId || !userEmail) {
      return res.status(400).json({
        error: "Seller email, productId, and userEmail are required",
      });
    }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Check if this user already visited this product for this seller
    const existingVisit = await visitorsCollection.findOne({
      sellerEmail,
      productId,
      userEmail,
    });

    if (existingVisit) {
      // Update visit count
      await visitorsCollection.updateOne(
        { _id: existingVisit._id },
        {
          $set: { visitedAt: new Date(), ip, userAgent },
          $inc: { visitCount: 1 },
        }
      );
    } else {
      // Create new visit record
      await visitorsCollection.insertOne({
        sellerEmail,
        productId,
        userEmail,
        ip,
        userAgent,
        visitedAt: new Date(),
        visitCount: 1,
      });
    }

    res.json({ message: "Visit tracked successfully" });
  } catch (error) {
    console.error("Error tracking visit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getVisitors = async (req, res) => {
  try {
    const db = getDB();
    const visitorsCollection = db.collection("visitors");
    const result = await visitorsCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).send({ message: "Failed to fetch visitors" });
  }
};

const getMessages = async (req, res) => {
  const { sellerEmail, customerEmail } = req.params;
  try {
    const db = getDB();
    const messagesCollection = db.collection("messages");
    const messages = await messagesCollection
      .find({
        $or: [
          { sellerEmail, customerEmail },
          { sellerEmail: customerEmail, customerEmail: sellerEmail },
        ],
      })
      .sort({ timestamp: 1 })
      .toArray();
    res.send(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send({ message: "Failed to fetch messages" });
  }
};

const aiChat = async (req, res) => {
  const { message, image } = req.body;

  // Check if a message or an image was provided
  if (!message && !image) {
    return res.status(400).send({ error: "No message or image provided." });
  }

  // Construct the payload to send to n8n
  const n8nPayload = {
    ...(message && { message: message }),
    ...(image && { image: image }),
  };

  try {
    const n8nResponse = await fetch(
      "https://1201-498.n8n1.deltadns.xyz/webhook/buy-nex-req",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
      }
    );

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(
        `n8n webhook responded with status ${n8nResponse.status}: ${errorText}`
      );
      return res
        .status(n8nResponse.status)
        .send({ error: "Error from AI service", details: errorText });
    }

    const contentType = n8nResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const rawText = await n8nResponse.text();
      console.error(
        "n8n webhook did not respond with JSON. Raw response:",
        rawText
      );
      return res.status(500).send({
        error: "AI service did not return a valid JSON response.",
      });
    }

    const data = await n8nResponse.json();
    // Ensure 'output' property exists in the response from n8n
    if (data && data.output) {
      res.send({ reply: data.output });
    } else {
      console.error("n8n response did not contain an 'output' property:", data);
      res.status(500).send({
        error: "AI service response malformed or missing 'output'.",
      });
    }
  } catch (error) {
    console.error("Error communicating with n8n webhook:", error);
    res.status(500).send({
      error: "Failed to connect to AI service or parse its response.",
    });
  }
};

module.exports = {
  trackVisit,
  getVisitors,
  getMessages,
  aiChat,
};
