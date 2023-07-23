import MainScreen from "./Components/Sections/MainScreen/MainScreen";
import "./App.css";
import NavBar from "./Components/Navbar/Navbar";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ProductScreen from "./Components/Sections/ProductScreen/ProductScreen";
import { Footer } from "./Components/Footer/Footer";
import { CartScreen } from "./Components/Sections/CartScreen/CartScreen";
import Signin from "./Components/Sections/Signin/Signin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingScreen from "./Components/Sections/ShippingScreen/ShippingScreen";
import Signup from "./Components/Sections/Signup/Signup";
import { PaymentMethodScreen } from "./Components/Sections/PaymentMethodScreen/PaymentMethodScreen";
import { PlaceOrderScreen } from "./Components/Sections/PlaceOrderScreen.js/PlaceOrderScreen";
import { OrderScreen } from "./Components/Sections/OrderScreen/OrderScreen";
import { OrderHistory } from "./Components/Sections/OrderHistory/OrderHistory";
import UserProfile from "./Components/Sections/UserProfile/UserProfile";
import { useEffect, useState } from "react";
import { Button, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import ErrorCatch from "./ErrorCatch";
import axios from "axios";
import SearchScreen from "./Components/Sections/SearchScreen/SearchScreen";
import ProtectedRoute from "./Components/Sections/ProtectedRoute/ProtectedRoute";
import DashboardScreen from "./Components/Sections/DashboardScreen/DashboardScreen";
import AdminRoute from "./Components/Sections/AdminRoute/AdminRoute";
import { UserListScreen } from "./Components/Sections/UserListScreen/UserListScreen";
import EditUserScreen from "./Components/Sections/EditUserScreen/EditUserScreen";
import { OrderListScreen } from "./Components/Sections/OrderListScreen/OrderListScreen";
import { ProductListScreen } from "./Components/Sections/ProductListScreen/ProductListScreen";
import CreateProduct from "./Components/Sections/CreateProduct/CreateProduct";
import NoPage from "./Components/Sections/NoPage/NoPage";
import ScrollToTopButton from "./Components/ScrollToTopButton/ScrollToTopButton";
function App() {
  const [sideBar, setSideBar] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(ErrorCatch(error));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sideBar
            ? "App d-flex flex-column active-cont"
            : "App d-flex flex-column"
        }>
        <ToastContainer position="bottom-center" limit={1} />
        <NavBar sideBar={sideBar} setSideBar={setSideBar} />

        <div className="full-height">
          <Routes>
            <Route path="*" element={<NoPage />} />
            <Route path="/" element={<MainScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/userlist"
              element={
                <AdminRoute>
                  {" "}
                  <UserListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  {" "}
                  <EditUserScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orderlist"
              element={
                <AdminRoute>
                  {" "}
                  <OrderListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/productlist"
              element={
                <AdminRoute>
                  {" "}
                  <ProductListScreen />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/createproduct"
              element={
                <AdminRoute>
                  {" "}
                  <CreateProduct />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
        <div
          className={
            sideBar
              ? "active-nav  bg-dark side-navbar d-flex justify-content-between flex-wrap flex-column "
              : " bg-dark side-navbar d-flex justify-content-between flex-wrap flex-column "
          }>
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories?.map((category) => (
              <Nav.Item key={category}>
                <Link
                  className="nav-link side-search"
                  to={{
                    pathname: "/search",
                    search: `?category=${category}`,
                  }}
                  onClick={() => setSideBar(false)}>
                  {category}
                </Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
      </div>
      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;
