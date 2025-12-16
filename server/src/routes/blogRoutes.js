const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

router.get("/blogs", blogController.getBlogs);
router.get("/blog/:id", blogController.getBlogById);
router.post("/blogs", blogController.addBlog);
router.get("/articles-category", blogController.getRecentArticlesAndCategories);

// Comments
router.get("/blog/:id/comments", blogController.getComments);
router.post("/blog/:id/comments", blogController.addComment);
router.delete("/blog/:id/comments/:commentId", blogController.deleteComment);
router.put("/blog/:id/comments/:commentId", blogController.updateComment);
router.post("/blog/:id/comments/:commentId/reply", blogController.replyToComment);
router.post("/blog/:id/comments/:commentId/replies/:replyId/reply", blogController.replyToReply);
router.post("/blog/:id/comments/:commentId/like", blogController.likeComment);
router.post("/blog/:id/comments/:commentId/replies/:replyId/like", blogController.likeReply);
router.put("/blog/:id/comments/:commentId/replies/:replyId", blogController.updateReply);
router.delete("/blog/:id/comments/:commentId/replies/:replyId", blogController.deleteReply);

module.exports = router;
