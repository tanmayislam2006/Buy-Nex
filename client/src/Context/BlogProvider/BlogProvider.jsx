import React, { useEffect, useState } from "react";
import { BlogContext } from "../BlogContext/BlogContext.jsx";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios.jsx";
import useAuth from "../../Hooks/useAuth.jsx";

const BlogProvider = ({ children }) => {
  const axiosInstance = useAxios()
  const {firebaseUser} = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); 
  const [category, setCategory] = useState("");
  const itemsPerPage = 4;
  const [cartItem, setCartItem] = useState([]);
  const [refreshCart, setRefreshCart] = useState(false);


  const {
    data: blogsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs", currentPage, search, category],
    queryFn: async () => {
      const res = await axiosInstance.get(`/blogs`, {
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
      const res = await axiosInstance.get(`/articles-category`);
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

  
  useEffect(() => {
    if (firebaseUser?.email) {
      axiosInstance
        .get(`/cart/${firebaseUser.email}`)
        .then((response) => {
          setCartItem(response.data);
        })
        .catch((error) => {
          console.error("Error loading cart items:", error);
        });
    }
  }, [firebaseUser, axiosInstance, refreshCart]);

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
    cartItem,
    setRefreshCart,
  };

  return <BlogContext.Provider value={blogData}>{children}</BlogContext.Provider>;
};

export default BlogProvider;
