import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import GameCard from './components/GameCard'
import Navbar from './components/Navbar'
import UnderNavbar from './components/UnderNavbar'
import AdminPanel from './pages/AdminPanel'
import DashboardBuyer from './pages/DashboardBuyer'
import DashboardPublisher from './pages/DashboardPublisher'
import HomePage from './pages/HomePages/HomePages'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/Register/Register'
import GameDetailPage from './pages/GameDetailPage/GameDetailPage'
import CartPage from './pages/CartPage/CartPage'
import WrapppedCheckoutPage from './pages/CheckoutPage/CheckoutPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import CategoriesPage from './pages/CategoriesPage/CategoriesPage'
import WishListPage from './pages/WishListPage/WishListPage';

// Component wrapper để kiểm tra đường dẫn hiện tại
function LayoutWrapper({ children }) {
  const location = useLocation();
  const showUnderNavbar = !['/login', '/register', '/checkout', '/profile', '/dashboard/buyer', '/dashboard/publisher', '/dashaboard/admin'].includes(location.pathname);

  return (
    <>
      <Navbar />
      {showUnderNavbar && <UnderNavbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/buyer" element={<DashboardBuyer />} />
          <Route path="/dashboard/publisher" element={<DashboardPublisher />} />
          <Route path="/dashaboard/admin" element={<AdminPanel />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<WrapppedCheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/category/:categoryName" element={<CategoriesPage />} />
          <Route path="/wishlist" element={<WishListPage />} />

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
