import React, { useState } from "react";
import { BlogContext } from "../BlogContext/BlogContext.jsx";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const BlogProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const itemsPerPage = 4;

  const {
    data: blogsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs", currentPage, search, category],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/blogs`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: search,
          category: category,
        },
      });
      return res.data;
    },
  });
  const { blogs, total } = blogsData || {};

  const { data, isLoading: articalLoading } = useQuery({
    queryKey: ["blogs-details"],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/articles-category`);
      return res.data;
    },
  });

  const { recentArticles, categories } = data || {};

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const blogData = {
    blogs,
    total,
    currentPage,
    itemsPerPage,
    isLoading,
    isError,
    articalLoading,
    recentArticles,
    categories,
    setCurrentPage,
    search,
    setSearch,
    category,
    setCategory,
    handleInputChange,
    handleCategoryChange,
  };

  return <BlogContext.Provider value={blogData}>{children}</BlogContext.Provider>;
};

export default BlogProvider;
