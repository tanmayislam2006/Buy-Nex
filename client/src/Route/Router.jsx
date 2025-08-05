import { createBrowserRouter } from "react-router";
import Home from "../Pages/public/Home";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import HelpSupport from "../Pages/public/HelpSupport";
import About from "../Pages/public/About";
import BecomeSeller from "../Pages/public/BecomeSeller";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import ProductTracking from "../Pages/dashboard/User/ProductTracking";
import OrderHistory from "../Pages/dashboard/User/OrderHistory";
import PaymentHistory from "../Pages/dashboard/User/PaymentHistory";
import SellerOverview from "../Pages/dashboard/Seller/SellerOverview";
import AddProduct from "../Pages/dashboard/Seller/AddProduct";
import ManageProducts from "../Pages/dashboard/Seller/ManageProducts";
import OrderedProducts from "../Pages/dashboard/Seller/OrderedProducts";
import PendingSellers from "../Pages/dashboard/Admin/PendingSellers";
import AllUser from "../Pages/dashboard/Admin/AllUser";
import AllSellers from "../Pages/dashboard/Admin/AllSellers";
import TotalOrders from "../Pages/dashboard/Admin/TotalOrders";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import Blogs from "../Pages/public/Blogs";
import Error404 from "../Pages/ErrorPage/Error404";
import ProductDetails from "../Pages/public/ProductDetails";
import Upcoming from "../Pages/public/Upcoming";
import Profile from "../Pages/dashboard/Profile/Profile";
import Overview from "../Pages/dashboard/Overview/Overview";
import BlogLayout from "../components/Blog/BlogLayout";
import BlogDetails from "../Pages/public/BlogDetails";
import AllProducts from "../Pages/public/AllProducts/AllProducts";
import CartItems from "../Pages/dashboard/User/CartItems";
import OrderPage from "../Pages/dashboard/User/Order/OrderPage";
import ProductStatus from "../Pages/dashboard/User/ProductStatus";
import PaymentSuccess from "../Pages/dashboard/User/Order/PaymentSuccess";
import PaymentFail from "../Pages/dashboard/User/Order/PaymentFail";
import CustomerChat from "../Pages/dashboard/Seller/CustomerChat";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    Component: MainLayout,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/all-products",
        Component: AllProducts,
      },
      {
        path: "/",
        Component: BlogLayout,
        children: [
          {
            path: "/blogs",
            Component: Blogs,
          },
          {
            path: "/blog/:id",
            Component: BlogDetails,
          },
        ],
      },
      {
        path: "/help-support",
        Component: HelpSupport,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/become-seller",
        Component: BecomeSeller,
      },
      {
        path: "/product-details/:id",
        Component: ProductDetails,
      },
      {
        path: "/upcoming",
        Component: Upcoming,
      },
      {
        path: "/cart",
        Component: CartItems,
      },
      {
        path: "/orderPage",
        Component: OrderPage,
      },
      {
        path: "/payment-success/:orderNumber",
        Component: PaymentSuccess,
      },
      {
        path: "/payment-fail/:orderNumber",
        Component: PaymentFail,
      },
    ],
  },
  // Authentication routes
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "auth/login",
        Component: Login,
      },
      {
        path: "auth/register",
        Component: Register,
      },
      {
        path: "auth/reset-password",
        Component: Register,
      },
    ],
  },
  //   Dashboard routes
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        Component: Overview,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "product-tracking",
        Component: ProductTracking,
      },
      {
        path: "Product-status/:id",
        Component: ProductStatus,
      },
      {
        path: "order-history",
        Component: OrderHistory,
      },
      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "dashboard/seller",
        Component: SellerOverview,
      },
      {
        path: "add-product",
        Component: AddProduct,
      },
      {
        path: "manage-products",
        Component: ManageProducts,
      },
      {
        path: "ordered-products",
        Component: OrderedProducts,
      },
      {
        path: "customer-chats",
        Component: CustomerChat,
      },
      {
        path: "dashboard/admin",
        Component: Home,
      },
      {
        path: "pending-sellers",
        Component: PendingSellers,
      },
      {
        path: "all-user",
        Component: AllUser,
      },
      {
        path: "all-seller",
        Component: AllSellers,
      },
      {
        path: "total-orders",
        Component: TotalOrders,
      },
    ],
  },
]);

export default router;
