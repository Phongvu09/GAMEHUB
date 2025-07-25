import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import UnderNavbar from './components/UnderNavbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePages/HomePages';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/Register/Register';
import GameDetailPage from './pages/GameDetailPage/GameDetailPage';
import CartPage from './pages/CartPage/CartPage';
import WrapppedCheckoutPage from './pages/CheckoutPage/CheckoutPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
import WishListPage from './pages/WishListPage/WishListPage';
import AboutPage from './pages/AboutPage/AboutPage';
import SupportPage from './pages/SupportPage/SupportPage';

import AdminApp from './ADMIN/AdminApp';

function LayoutWrapper() {
  const location = useLocation();
  const hideUnderNavbarRoutes = [
    '/login',
    '/register',
    '/checkout',
    '/profile',
    '/dashboard/buyer',
  ];

  const showUnderNavbar = !hideUnderNavbarRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      {showUnderNavbar && <UnderNavbar />}
      <Outlet /> { }
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />

        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<WrapppedCheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/category/:categoryName" element={<CategoriesPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
