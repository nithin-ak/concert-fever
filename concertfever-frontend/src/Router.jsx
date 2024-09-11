import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/HeaderFooter/Navbar";
import Footer from "./components/HeaderFooter/Footer";
import Signin from "./components/Authentication/Signin";
import Signup from "./components/Authentication/Signup";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import MyProfile from "./components/Authentication/MyProfile";
import Hero from "./components/HomePage/Hero";
import ExploreByCategories from "./components/HomePage/ExploreByCategories";
import MoreEvents from "./components/HomePage/MoreEvents";
import Cart from "./components/Purchase/Cart";
import Events from "./pages/Events";
import EventDetails from "./components/EventsCards/EventFullDetails";
import AddToCart from "./components/Purchase/AddToCart";
import MyTickets from "./pages/MyTickets";
import PageNotFound from "./components/Util/PageNotFound";
import Checkout from "./components/Purchase/Checkout";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="content">{children}</div>
      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Hero /><ExploreByCategories /><MoreEvents /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/eventdetails/:eventId" element={<Layout><EventDetails /><AddToCart /></Layout>} />
        <Route path="/signin" element={<Layout><Signin /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/forgotpassword" element={<Layout><ForgotPassword /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/mytickets" element={<Layout><MyTickets /></Layout>} />
        <Route path="/myprofile" element={<Layout><MyProfile /></Layout>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}
