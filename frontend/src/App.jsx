// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/Dashboard"; // Placeholder for your dashboard component
import RetailerNavbar from "./components/Navbar/RetailerNavbar";
import DistributorsNavbar from "./components/Navbar/DistributorsNavbar";
import RetailersList from "./components/List/RetailersList";
import AddProduct from "./components/List/AddProduct";
import ProductList from "./components/List/ProductList";
import DistributorsList from "./components/List/DistributorsList";
import ProductListAll from "./components/List/ProductListAll";
import LatestProduct from "./components/List/LatestProduct";
import Requests from "./components/Message/Requests";
import MyNetwork from "./components/Message/MyNetwork";
import RetailerNetwork from "./components/Message/RetailerNetwork";
import GetStartedPage from "./pages/GetStartedPage";
import OrderInfo from "./order/OrderInfo";
import Pending from "./Dist_Order/Pending";
import Rejected from "./Dist_Order/Rejected";
import Accepted from "./Dist_Order/Accepted";
import Completed from "./Dist_Order/Completed";
import About from "./pages/About";
import HomePageNew from "./pages/HomePageNew";
import HomePage from "./pages/HomePage";
import HomePageRetailer from "./pages/HomePageRetailer";
import LandingPage from "./pages/LandingPage";
import PendingRetail from "./Retail_Orders/PendingRetail";
import AcceptedRetail from "./Retail_Orders/AcceptedRetail";
import RejectedRetail from "./Retail_Orders/RejectedRetail";
import CompletedRetail from "./Retail_Orders/CompletedRetail";
import AdminHome from "./components/Admin/AdminHome";
import AdminNav from "./components/Navbar/AdminNav";
import AdminRetailerList from "./components/Admin_List/AdminRetailerList";
import AdminProductList from "./components/Admin_List/AdminProductList";
import AdminDistributorsList from "./components/Admin_List/AdminDistributorsList";
import AdminComplaints from "./components/Admin_List/AdminComplaints";
import ComplaintAndReviewPage from "./pages/ComplaintAndreview";
import NewsFeed from "./pages/Newsfeed";
import InvoicePage from "./pages/InvoicePage";
import DistributorProducts from "./components/List/DistributorProducts";
import Chat from "./chat/Chat"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redirect to signup page by default */}
        {/* <Route path="/" element={<Navigate to="/auth/signup" replace />} /> */}
        <Route path="/retailer" element={<RetailerNavbar />} />
        <Route path="/distributors" element={<DistributorsNavbar />} />
        <Route path="/retailerslist" element={<RetailersList />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/distributorslist" element={<DistributorsList />} />
        <Route path="/productlistall" element={<ProductListAll />} />
        <Route path="/latestproduct" element={<LatestProduct />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/mynetwork" element={<MyNetwork />} />
        <Route path="/retailerNetwork" element={<RetailerNetwork />} />
        <Route path="/getstartedpage" element={<GetStartedPage />} />
        <Route path="/orderinfo/:productId" element={<OrderInfo />} />
        <Route path="/pendingorders_dist" element={<Pending />} />
        <Route path="/rejected_dist" element={<Rejected />} />
        <Route path="/accepted_dist" element={<Accepted />} />
        <Route path="/completed_dist" element={<Completed />} />
        <Route path="/about" element={<About />} />
        <Route path="/homepagenew" element={<HomePageNew />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/homepageretailer" element={<HomePageRetailer />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/pendingretail" element={<PendingRetail />} />
        <Route path="/acceptedretail" element={<AcceptedRetail />} />
        <Route path="/rejectedretail" element={<RejectedRetail />} />
        <Route path="/completedretail" element={<CompletedRetail />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminnav" element={<AdminNav />} />
        <Route path="/adminretailerlist" element={<AdminRetailerList />} />
        <Route path="/adminproductlist" element={<AdminProductList />} />
        <Route path="/admindistributorslist" element={<AdminDistributorsList />} />
        <Route path="/admincomplaints" element={<AdminComplaints />} />
        <Route path="/complaintandreview" element={<ComplaintAndReviewPage />} />
        <Route path="/newsfeed" element={<NewsFeed/>} />
        <Route path="/invoicepage" element={<InvoicePage/>} />
        <Route path="/distributor-products/:distributorEmail" element={<DistributorProducts />} />
        <Route path="/chat" element={<Chat/>} />

        
      </Routes>
    </Router>
  );
};

export default App;
