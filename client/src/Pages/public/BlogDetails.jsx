import React from "react";
import { Link, useParams } from "react-router";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Loading";

const BlogDetails = () => {
  const { id } = useParams();
  const {
    data: blogPost,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs-details", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/blog/${id}`);
      return res.data;
    },
  });

  const handleComment = (e) => {
    e.preventDefault();
    toast.success("Comment Submited Successfully");
  };

  if (isLoading) return <Loading />;

  const comments = [
    {
      id: 1,
      author: "John Deo",
      date: "October 14, 2025",
      avatar: "https://placehold.co/40x40/FFD700/FFFFFF?text=JD",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolor magna aliqua. Ut enim ad minim veniam.",
    },
    {
      id: 2,
      author: "Jenifer lowes",
      date: "October 14, 2025",
      avatar: "https://placehold.co/40x40/87CEEB/FFFFFF?text=JL",
      text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolor magna aliqua.",
    },
  ];

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
            Comments :{" "}
            {comments.length < 10 ? `0${comments.length}` : comments.length}
          </h2>

          {/* List of Comments */}
          <div className="space-y-8 mb-12">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-4">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/40x40/CCCCCC/666666?text=User";
                  }}
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {comment.author}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.text}</p>
                  <a
                    href="#"
                    className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block"
                  >
                    Reply
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Leave a Reply Form */}
          <div className="bg-gray-50 p-8 rounded-xl ">
            <h2 className="text-xl font-semibold text-gray-600 mb-6">
              Leave A Reply
            </h2>
            <form onSubmit={handleComment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                />
              </div>
              <textarea
                placeholder="Message"
                rows="3"
                resize="none"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
              ></textarea>
              <button
                type="submit"
                className="btn btn-primary text-white flex items-center justify-center gap-2"
              >
                <IoIosSend /> Comment
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
