// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import GameCard from './components/GameCard';
// import Navbar from './components/Navbar';
// import UnderNavbar from './components/UnderNavbar';
// import HomePage from './pages/HomePages/HomePages';
// import LoginPage from './pages/LoginPage/LoginPage';
// import RegisterPage from './pages/Register/Register';
// import GameDetailPage from './pages/GameDetailPage/GameDetailPage';
// import CartPage from './pages/CartPage/CartPage';
// import WrapppedCheckoutPage from './pages/CheckoutPage/CheckoutPage';
// import ProfilePage from './pages/ProfilePage/ProfilePage';
// import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
// import WishListPage from './pages/WishListPage/WishListPage';
// import AdminDashboard from './ADMIN/AdminDashboard/AdminDashboard';
// import GamePage from './ADMIN/GamesPage/GamePage';
// import OrdersPage from './ADMIN/OrdersPage/OrdersPage';
// import RevenuePage from './ADMIN/RevenuePage/RevenuePage';
// import UsersPage from './ADMIN/UsersPage/UsersPage';

// function LayoutWrapper({ children }) {
//   const location = useLocation();
//   const hideUnderNavbarRoutes = [
//     '/login',
//     '/register',
//     '/checkout',
//     '/profile',
//     '/dashboard/buyer',
//     '/admin/dashboard',
//     '/admin/games',
//     '/admin/orders',
//     '/admin/revenue',
//     '/admin/users'
//   ];

//   const showUnderNavbar = !hideUnderNavbarRoutes.includes(location.pathname);

//   return (
//     <>
//       <Navbar />
//       {showUnderNavbar && <UnderNavbar />}
//       {children}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <LayoutWrapper>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/game/:id" element={<GameDetailPage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/checkout" element={<WrapppedCheckoutPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/category/:categoryName" element={<CategoriesPage />} />
//           <Route path="/wishlist" element={<WishListPage />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/games" element={<GamePage />} />
//           <Route path="/admin/orders" element={<OrdersPage />} />
//           <Route path="/admin/revenue" element={<RevenuePage />} />
//           <Route path="/admin/users" element={<UsersPage />} />
//         </Routes>
//       </LayoutWrapper>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import UnderNavbar from './components/UnderNavbar';

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

import AdminApp from './ADMIN/AdminApp'; // 

function LayoutWrapper({ children }) {
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
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />

        <Route
          path="*"
          element={
            <LayoutWrapper>
              <Routes>
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


              </Routes>
            </LayoutWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
