import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../Hooks/useAuth";
import { Link, useParams } from "react-router";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Loading";
import { AiFillLike } from "react-icons/ai";

  // Helper to show "x time ago"
  const getTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now - commentDate;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec} seconds ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hours ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay} days ago`;
    const diffMon = Math.floor(diffDay / 30);
    if (diffMon < 12) return `${diffMon} months ago`;
    const diffYr = Math.floor(diffMon / 12);
    return `${diffYr} years ago`;
  };


const BlogDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch blog post
  const {
    data: blogPost,
    isLoading,
  } = useQuery({
    queryKey: ["blogs-details", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/blog/${id}`);
      return res.data;
    },
  });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["blog-comments", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/blog/${id}/comments`);
      return res.data;
    },
  });

  // Add comment mutation
  const [form, setForm] = useState({ text: "" });
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      if (!form.text || form.text.trim() === "") {
        throw new Error("Message is required");
      }
      await axios.post(`http://localhost:5000/blog/${id}/comments`, newComment);
    },
    onSuccess: () => {
      toast.success("Comment Submitted Successfully");
      setForm({ author: "", email: "", text: "" });
      queryClient.invalidateQueries(["blog-comments", id]);
    },
    onError: (error) => {
      toast.error(error.message || "Message is required");
    },
  });

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      await axios.delete(
        `http://localhost:5000/blog/${id}/comments/${commentId}`
      );
    },
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries(["blog-comments", id]);
    },
  });

  // Edit comment mutation
  const editMutation = useMutation({
    mutationFn: async ({ commentId, text }) => {
      await axios.put(
        `http://localhost:5000/blog/${id}/comments/${commentId}`,
        { text }
      );
    },
    onSuccess: () => {
      toast.success("Comment updated");
      setEditId(null);
      setEditText("");
      queryClient.invalidateQueries(["blog-comments", id]);
    },
  });

  // Like/unlike comment mutation
  const likeMutation = useMutation({
    mutationFn: async (commentId) => {
      await axios.post(
        `http://localhost:5000/blog/${id}/comments/${commentId}/like`,
        { userId: user?.uid || user?.email }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blog-comments", id]);
    },
  });

  // Reply comment mutation
  const replyMutation = useMutation({
    mutationFn: async ({ commentId, reply }) => {
      if (!reply || reply.trim() === "") {
        throw new Error("Message is required");
      }
      await axios.post(
        `http://localhost:5000/blog/${id}/comments/${commentId}/reply`,
        {
          author: user?.displayName || user?.name || "Anonymous",
          email: user?.email,
          text: reply,
        }
      );
    },
    onSuccess: () => {
      toast.success("Reply added");
      setReplyId(null);
      setReplyText("");
      queryClient.invalidateQueries(["blog-comments", id]);
    },
    onError: (error) => {
      toast.error(error.message || "Message is required");
    },
  });

  const handleComment = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth/login");
      return;
    }
    if (!form.text) {
      toast.error("Message is required");
      return;
    }
    mutation.mutate({
      author: user.displayName || user.name || "Anonymous",
      email: user.email,
      text: form.text,
    });
  };

  if (isLoading) return <Loading />;
  // Helper to generate a deterministic color hex based on author name
  const avatarColor = (name) => {
    const colors = [
      "1abc9c", "2ecc71", "3498db", "9b59b6", "e67e22", "e74c3c", "34495e", "f39c12", "16a085", "27ae60", "2980b9", "8e44ad", "d35400", "c0392b", "7f8c8d"
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  };

  return (
    <div className="font-sans antialiased min-h-screen">
      <Link
        to="/blogs"
        className="text-primary font-medium text-lg flex items-center gap-2 mb-4 w-fit"
      >
        <IoMdArrowRoundBack />
        Back to Blogs
      </Link>
      {/* Hero Image Section */}
      <div className="w-full h-96">
        {/* Fallback for image loading errors */}
        <img
          src={blogPost.image}
          alt="Blog Hero"
          className="w-full object-cover rounded-lg h-full"
        />
      </div>

      {/* Blog Content Section */}
      <section className="py-12 lg:py-16">
        <div className="">
          {/* Date and Category */}
          <p className="text-sm text-gray-500 font-medium mb-2">
            {new Date(blogPost.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
            - {blogPost.category}
          </p>
          {/* Blog Title */}
          <h1 className="text-3xl lg:text-3xl font-semibold text-gray-900 mb-6 leading-tight">
            {blogPost.title}
          </h1>

          {/* Article Paragraphs */}
          {blogPost.desc.map((content, idx) => (
            <p key={idx} className="text-gray-700 leading-relaxed mb-6">
              {content}
            </p>
          ))}
        </div>
      </section>

      {/* Comments Section */}
      <section className="bg-white py-12 lg:py-16">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 w-full bg-gray-100 rounded-lg px-4 py-3">
            Comments :
            {comments.length < 10 ? `0${comments.length}` : comments.length}
          </h2>
          <div className="space-y-8 mb-12">
            {commentsLoading ? (
              <Loading />
            ) : comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${
                      comment?.author || "Buy Nex"
                    }&background=${avatarColor(comment?.author || "Buy Nex")}&color=fff&bold=true`}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        {comment.author}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {getTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    {editId === comment._id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          editMutation.mutate({
                            commentId: comment._id,
                            text: editText,
                          });
                        }}
                        className="mt-2"
                      >
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-gray-700 mt-1">{comment.text}</p>
                    )}
                    {/* Actions: Edit, Delete, Reply */}
                    <div className="flex gap-4 mt-2">
                      <button
                        className={`text-sm font-medium flex items-center gap-1 ${comment.likes?.includes(user?.uid || user?.email) ? 'text-primary' : 'text-gray-500'}  cursor-pointer`}
                        onClick={() => {
                          if (!user) {
                            navigate("/auth/login");
                            return;
                          }
                          likeMutation.mutate(comment._id);
                        }}
                        title={!user ? "Login required" : "Like"}
                      >
                        < AiFillLike /> {comment.likes?.length || 0}
                      </button>
                      <button
                        className="text-blue-600 text-sm font-medium cursor-pointer"
                        onClick={() => {
                          if (!user) {
                            navigate("/auth/login");
                            return;
                          }
                          setEditId(comment._id);
                          setEditText(comment.text);
                        }}
                        title={!user ? "Login required" : "Edit"}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 text-sm font-medium cursor-pointer"
                        onClick={() => {
                          if (!user) {
                            navigate("/auth/login");
                            return;
                          }
                          deleteMutation.mutate(comment._id);
                        }}
                        title={!user ? "Login required" : "Delete"}
                      >
                        Delete
                      </button>
                      <button
                        className="text-green-600 text-sm font-medium cursor-pointer"
                        onClick={() => {
                          if (!user) {
                            navigate("/auth/login");
                            return;
                          }
                          setReplyId(comment._id);
                        }}
                        title={!user ? "Login required" : "Reply"}
                      >
                        Reply
                      </button>
                    </div>
                    {/* Reply Form */}
                    {replyId === comment._id && (
                      user ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            replyMutation.mutate({
                              commentId: comment._id,
                              reply: replyText,
                            });
                          }}
                          className="mt-2"
                        >
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            placeholder="Write your reply..."
                            required
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="submit"
                              className="btn btn-primary btn-sm text-white"
                            >
                              Send
                            </button>
                            <button
                              type="button"
                              className="btn bg-red-400 text-white btn-sm"
                              onClick={() => setReplyId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        (() => { navigate("/auth/login"); return null; })()
                      )
                    )}
                    {/* Show replies if any */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {comment.replies.map((reply, ridx) => (
                          <div
                            key={reply._id || ridx}
                            className="bg-gray-100 p-2 rounded flex items-start justify-between"
                          >
                            <div className="flex items-start gap-2">
                              <img
                                className="w-10 h-10 rounded-full object-cover"
                                src={`https://ui-avatars.com/api/?name=${
                                  reply?.author || "Buy Nex"
                                }&background=${avatarColor(reply?.author || "Buy Nex")}&color=fff&bold=true`}
                                alt=""
                              />
                              <div>
                                <p className="text-base font-medium text-gray-800">
                                  {reply.author}
                                </p>
                                <p className="text-sm text-gray-700">
                                  {reply.text}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {getTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Leave a Reply Form */}
          <div className="bg-gray-50 p-8 rounded-xl ">
            <h2 className="text-xl font-semibold text-gray-600 mb-6">
              Leave A Reply
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!user) {
                  navigate("/auth/login");
                  return;
                }
                handleComment(e);
              }}
              className="space-y-6"
            >
              <textarea
                placeholder="Message"
                required
                rows="3"
                value={form.text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, text: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
              ></textarea>
              <button
                type="submit"
                className="btn btn-primary text-white flex items-center justify-center gap-2"
                disabled={mutation.isLoading}
              >
                <IoIosSend /> {mutation.isLoading ? "Submitting..." : "Comment"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};


export default BlogDetails;
