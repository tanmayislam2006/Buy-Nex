import React from "react";
import { Outlet } from "react-router";
import Loading from "../Loading";
import useBlogs from "../../Hooks/useBlogs";
import BlogAside from "./BlogAside";

const BlogLayout = () => {
  const { articalLoading } = useBlogs();

  if (articalLoading) return <Loading />;
  return (
    <div className="font-sans antialiased min-h-screen px-4 lg:px-0">
      <section className="container mx-auto py-16 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 ">
            <Outlet />
          </div>
          {/* Right Sidebar */}
          <BlogAside />
        </div>
      </section>
    </div>
  );
};

export default BlogLayout;
