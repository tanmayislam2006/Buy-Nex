import React, { useState } from "react";
import BlogCard from "../../components/Blog/BlogCard";
import Loading from "../../components/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Pagination from "../../shared/Pagination";

const Blogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  setTimeout(() => {
    setLoading(false);
  }, 200);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/blogs`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return res.data;
    },
  });

  if (isLoading || loading) return <Loading />;

  const { blogs, total } = data || {};
  const totalPages = Math.ceil(total / itemsPerPage);

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-red-600">
          Something Went Wrong: {isError.message}
        </p>
        <p className="text-lg text-red-600">Please try again letter.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Blogs;
