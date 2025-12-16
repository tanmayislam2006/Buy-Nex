const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getBlogs = async (req, res) => {
  try {
    const db = getDB();
    const blogsCollection = db.collection("blogs");

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
};

const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDB();
    const blogsCollection = db.collection("blogs");

    const query = { _id: new ObjectId(id) };
    const blog = await blogsCollection.findOne(query);
    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }
    res.send(blog);
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res.status(500).send({ message: "Failed to fetch blog" });
  }
};

const addBlog = async (req, res) => {
  const blogs = req.body;
  blogs.createdAt = new Date().toISOString();
  try {
    const db = getDB();
    const blogsCollection = db.collection("blogs");
    const result = await blogsCollection.insertOne(blogs);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to add blog" });
  }
};

const getRecentArticlesAndCategories = async (req, res) => {
  try {
    const db = getDB();
    const blogsCollection = db.collection("blogs");

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
};

const getComments = async (req, res) => {
  const blogId = req.params.id;
  try {
    const db = getDB();
    const commentsCollection = db.collection("comments");
    const comments = await commentsCollection
      .find({ blogId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

const addComment = async (req, res) => {
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
    const db = getDB();
    const commentsCollection = db.collection("comments");
    const result = await commentsCollection.insertOne(comment);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const db = getDB();
    const commentsCollection = db.collection("comments");
    await commentsCollection.deleteOne({
      _id: new ObjectId(commentId),
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  try {
    const db = getDB();
    const commentsCollection = db.collection("comments");
    await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { text } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

const replyToComment = async (req, res) => {
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
    const db = getDB();
    const commentsCollection = db.collection("comments");
    await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $push: { replies: replyObj } }
    );
    res.json({ success: true, reply: replyObj });
  } catch (error) {
    res.status(500).json({ error: "Failed to add reply" });
  }
};

const replyToReply = async (req, res) => {
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
    const db = getDB();
    const commentsCollection = db.collection("comments");
    await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $push: { "replies.$[reply].replies": nestedReply } },
      { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
    );
    res.json({ success: true, reply: nestedReply });
  } catch (error) {
    res.status(500).json({ error: "Failed to add nested reply" });
  }
};

const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  try {
    const db = getDB();
    const commentsCollection = db.collection("comments");
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
};

const likeReply = async (req, res) => {
  const { commentId, replyId } = req.params;
  const { userId } = req.body;
  try {
    const db = getDB();
    const commentsCollection = db.collection("comments");
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
};

const updateReply = async (req, res) => {
  const { commentId, replyId } = req.params;
  const { text } = req.body;
  try {
    const db = getDB();
    const commentsCollection = db.collection("comments");
    await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { "replies.$[reply].text": text } },
      { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update reply" });
  }
};

const deleteReply = async (req, res) => {
  const { commentId, replyId } = req.params;
  try {
    const db = getDB();
    const commentsCollection = db.collection("comments");
    await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $pull: { replies: { _id: new ObjectId(replyId) } } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reply" });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  addBlog,
  getRecentArticlesAndCategories,
  getComments,
  addComment,
  deleteComment,
  updateComment,
  replyToComment,
  replyToReply,
  likeComment,
  likeReply,
  updateReply,
  deleteReply,
};
