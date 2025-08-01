import React, { useContext } from "react";
import { BlogContext } from "../Context/BlogContext/BlogContext";

const useBlogs = () => {
  const blogsData = useContext(BlogContext);
  return blogsData;
};

export default useBlogs;
