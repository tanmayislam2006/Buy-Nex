const express = require("express");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      // Add your production frontend URL here when deployed
      // "https://your-production-frontend.com",
    ],
    credentials: true, // If you're sending cookies/headers from frontend
  })
);
app.use(express.json());

const uri = process.env.DB_URI; // Make sure DB_URI is correctly set in your .env file
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
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
    const productsCollection = BuyNexDB.collection("products");
    const blogsCollection = BuyNexDB.collection("blogs");
    const commentsCollection = BuyNexDB.collection("comments");
    const cartCollection = BuyNexDB.collection("cart");

    // -------------------------- user api is here-----------------------
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.post("/register", async (req, res) => {
      const email = req.body.email;
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: email });
      if (existingUser) {
        return res.status(200).send({ message: "User already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // ---------------------------- user api is here-----------------------

    // -------------------------- PRODUCT API WITH SINGLE ENDPOINT -----------------------

    // Endpoint for all products data (including filters, counts, pagination)
    app.get("/all-product-data", async (req, res) => {
      const {
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        page,
        limit,
      } = req.query;

      let matchQuery = {}; // This will be the $match stage for all facets

      if (category) matchQuery.category = category;
      if (brand) matchQuery.brand = brand;
      if (minRating) matchQuery.rating = { $gte: parseFloat(minRating) };
      if (minPrice || maxPrice) {
        matchQuery.price = {};
        if (minPrice) matchQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) matchQuery.price.$lte = parseFloat(maxPrice);
      }

      let sortOptions = {};
      // Default sort by _id descending (newest) if no sortBy specified
      if (sortBy === "Newest") {
        sortOptions._id = -1;
      } else if (sortBy === "Price: Low to High") {
        sortOptions.price = 1;
      } else if (sortBy === "Price: High to Low") {
        sortOptions.price = -1;
      } else {
        sortOptions._id = -1; // Fallback default
      }

      const pageNumber = parseInt(page) || 1;
      const productsPerPage = parseInt(limit) || 8;
      const skip = (pageNumber - 1) * productsPerPage;

      try {
        const result = await productsCollection
          .aggregate([
            // Initial match stage to filter products before any other operations
            // This ensures that category/brand counts reflect the currently filtered set
            { $match: matchQuery },
            {
              $facet: {
                // Pipeline 1: Get paginated, sorted products
                products: [
                  { $sort: sortOptions },
                  { $skip: skip },
                  { $limit: productsPerPage },
                ],
                // Pipeline 2: Get total count of filtered products
                totalCount: [{ $count: "count" }],
                // Pipeline 3: Get category counts based on the filtered products
                categoryCounts: [
                  { $group: { _id: "$category", count: { $sum: 1 } } },
                  { $project: { name: "$_id", count: 1, _id: 0 } },
                  { $sort: { name: 1 } },
                ],
                // Pipeline 4: Get brand counts based on the filtered products
                brandCounts: [
                  { $group: { _id: "$brand", count: { $sum: 1 } } },
                  { $project: { name: "$_id", count: 1, _id: 0 } },
                  { $sort: { name: 1 } },
                ],
              },
            },
          ])
          .toArray();

        // The result of $facet is an array containing a single document
        const aggregatedData = result[0];

        // Extract data, handling cases where counts might be empty if no products match
        const products = aggregatedData.products || [];
        const totalProducts =
          aggregatedData.totalCount.length > 0
            ? aggregatedData.totalCount[0].count
            : 0;
        const categoryCounts = aggregatedData.categoryCounts || [];
        const brandCounts = aggregatedData.brandCounts || [];

        res.send({
          products,
          totalProducts,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalProducts / productsPerPage),
          categoryCounts,
          brandCounts,
        });
      } catch (error) {
        console.error("Error fetching all product data:", error);
        res.status(500).send({ message: "Failed to fetch product data" });
      }
    });

    // Endpoint for single product details (remains separate and uses _id)
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const product = await productsCollection.findOne(query);
        if (!product) {
          return res.status(404).send({ message: "Product not found" });
        }
        res.send(product);
      } catch (error) {
        console.error("Error fetching single product:", error);
        res.status(500).send({ message: "Failed to fetch product" });
      }
    });

    // Endpoint to add a new product (remains as is)
    app.post("/products", async (req, res) => {
      const product = req.body;
      try {
        const result = await productsCollection.insertOne(product);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send({ message: "Failed to add product" });
      }
    });
    //  ------cart API START -----------------------
    // Get cart items for a user
    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email;
      try {
        const cartItems = await cartCollection
          .find({ userEmail: email })
          .toArray();
        res.send(cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).send({ message: "Failed to fetch cart items" });
      }
    });

    // added item in cart collection
    app.post("/cart", async (req, res) => {
      const cartItem = req.body;
      const existingItem = await cartCollection.findOne({
        userEmail: cartItem.userEmail,
        productId: cartItem.productId,
      });
      try {
        if (existingItem) {
          // If the item already exists, update the quantity
          const result = await cartCollection.updateOne(
            { _id: existingItem._id },
            { $inc: { quantity: cartItem.quantity } }
          );
          return res.send(result);
        }
        const result = await cartCollection.insertOne(cartItem);
        res.send(result);
      } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).send({ message: "Failed to add item to cart" });
      }
    });
    // -------------------------- PRODUCT API END -----------------------

    // -------------------------- BLOGS API START -----------------------

    app.get("/blogs", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const category = req.query.category || "";

        // Build filter object
        let filter = {};
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
          ];
        }
        if (category) {
          filter.category = category;
        }

        const total = await blogsCollection.countDocuments(filter);
        const blogs = await blogsCollection
          .find(filter)
          .skip(skip)
          .limit(limit)
          .toArray();

        res.json({
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          blogs,
        });
      } catch (err) {
        console.error("Error fetching paginated blogs:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/blog/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const query = { _id: new ObjectId(id) };
        const blog = await blogsCollection.findOne(query);
        if (!blog) {
          return res.status(404).send({ message: "Product not found" });
        }
        res.send(blog);
      } catch (error) {
        console.error("Error fetching single product:", error);
        res.status(500).send({ message: "Failed to fetch product" });
      }
    });

    app.post("/blogs", async (req, res) => {
      const blogs = req.body;
      blogs.createdAt = new Date().toISOString();
      try {
        const result = await blogsCollection.insertOne(blogs);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add blog" });
      }
    });

    // Recent articles and category
    app.get("/articles-category", async (req, res) => {
      try {
        const recentArticles = await blogsCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(3)
          .toArray();

        const categories = await blogsCollection.distinct("category");

        res.send({ recentArticles, categories });
      } catch (error) {
        console.error("🔥 Error fetching data:", error.message);
        res
          .status(500)
          .send({ message: "Failed to fetch recent articles or categories" });
      }
    });

    // Get comments for a blog
    app.get("/blog/:id/comments", async (req, res) => {
      const blogId = req.params.id;
      try {
        const comments = await commentsCollection
          .find({ blogId })
          .sort({ createdAt: -1 })
          .toArray();
        res.json(comments);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments" });
      }
    });

    // Add a comment to a blog
    app.post("/blog/:id/comments", async (req, res) => {
      const blogId = req.params.id;
      const { author, email, text } = req.body;
      const comment = {
        blogId,
        author,
        email,
        text,
        createdAt: new Date().toISOString(),
        likes: [],
        replies: [],
      };
      try {
        const result = await commentsCollection.insertOne(comment);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to add comment" });
      }
    });

    // Delete a comment
    app.delete("/blog/:id/comments/:commentId", async (req, res) => {
      const { commentId } = req.params;
      try {
        await commentsCollection.deleteOne({
          _id: new ObjectId(commentId),
        });
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete comment" });
      }
    });

    // Edit a comment
    app.put("/blog/:id/comments/:commentId", async (req, res) => {
      const { commentId } = req.params;
      const { text } = req.body;
      try {
        await commentsCollection.updateOne(
          { _id: new ObjectId(commentId) },
          { $set: { text } }
        );
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to update comment" });
      }
    });

    // Reply to a comment
    app.post("/blog/:id/comments/:commentId/reply", async (req, res) => {
      const { commentId } = req.params;
      const { author, email, text } = req.body;
      const replyObj = {
        _id: new ObjectId(),
        author,
        email,
        text,
        createdAt: new Date().toISOString(),
        likes: [],
        replies: [],
      };
      try {
        await commentsCollection.updateOne(
          { _id: new ObjectId(commentId) },
          { $push: { replies: replyObj } }
        );
        res.json({ success: true, reply: replyObj });
      } catch (error) {
        res.status(500).json({ error: "Failed to add reply" });
      }
    });

    // Nested reply to a reply (threaded)
    app.post(
      "/blog/:id/comments/:commentId/replies/:replyId/reply",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        const { author, email, text } = req.body;
        const nestedReply = {
          _id: new ObjectId(),
          author,
          email,
          text,
          createdAt: new Date().toISOString(),
          likes: [],
          replies: [],
        };
        try {
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            { $push: { "replies.$[reply].replies": nestedReply } },
            { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
          );
          res.json({ success: true, reply: nestedReply });
        } catch (error) {
          res.status(500).json({ error: "Failed to add nested reply" });
        }
      }
    );

    // Like/unlike a comment
    app.post("/blog/:id/comments/:commentId/like", async (req, res) => {
      const { commentId } = req.params;
      const { userId } = req.body;
      try {
        const comment = await commentsCollection.findOne({
          _id: new ObjectId(commentId),
        });
        let update;
        if (comment.likes && comment.likes.includes(userId)) {
          update = { $pull: { likes: userId } };
        } else {
          update = { $addToSet: { likes: userId } };
        }
        await commentsCollection.updateOne(
          { _id: new ObjectId(commentId) },
          update
        );
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to like/unlike comment" });
      }
    });

    // Like/unlike a reply
    app.post(
      "/blog/:id/comments/:commentId/replies/:replyId/like",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        const { userId } = req.body;
        try {
          const comment = await commentsCollection.findOne({
            _id: new ObjectId(commentId),
          });
          const reply = comment.replies.find(
            (r) => r._id.toString() === replyId
          );
          let update;
          if (reply.likes && reply.likes.includes(userId)) {
            update = { $pull: { "replies.$[reply].likes": userId } };
          } else {
            update = { $addToSet: { "replies.$[reply].likes": userId } };
          }
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            update,
            { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
          );
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: "Failed to like/unlike reply" });
        }
      }
    );

    // Edit a reply
    app.put(
      "/blog/:id/comments/:commentId/replies/:replyId",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        const { text } = req.body;
        try {
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            { $set: { "replies.$[reply].text": text } },
            { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
          );
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: "Failed to update reply" });
        }
      }
    );

    // Delete a reply
    app.delete(
      "/blog/:id/comments/:commentId/replies/:replyId",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        try {
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            { $pull: { replies: { _id: new ObjectId(replyId) } } }
          );
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: "Failed to delete reply" });
        }
      }
    );

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
