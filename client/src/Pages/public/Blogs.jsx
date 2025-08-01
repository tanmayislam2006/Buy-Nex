import React from "react";
import BlogCard from "../../components/Blog/BlogCard";
import Loading from "../../components/Loading";
import Pagination from "../../shared/Pagination";
import useBlogs from "../../Hooks/useBlogs";

const Blogs = () => {
  const {
    isLoading,
    itemsPerPage,
    isError,
    currentPage,
    setCurrentPage,
    total,
    blogs,
  } = useBlogs();

  if (isLoading) return <Loading />;

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
      {blogs.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-xl md:text-2xl text-gray-600">No blogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
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
