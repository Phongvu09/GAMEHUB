import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GameCard from './components/GameCard'
import Navbar from './components/Navbar'
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


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/buyer" element={<DashboardBuyer />} />
        <Route path="/dashboard/publisher" element={<DashboardPublisher />} />
        <Route path="/dashboard/admin" element={<AdminPanel />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<WrapppedCheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </Router>
  )
}

export default App
