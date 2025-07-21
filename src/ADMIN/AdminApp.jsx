// src/ADMIN/AdminApp.jsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/AdminDashboard/AdminDashboard'
import GamesPage from './pages/GamesPage/GamePage'
import OrdersPage from './pages/OrdersPage/OrdersPage';
import RevenuePage from './pages/RevenuePage/RevenuePage';
import UsersPage from './pages/UsersPage/UsersPage';

import './admin.css';

export default function AdminApp() {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-main">
                <Header />
                <div className="admin-content">
                    <Routes>
                        <Route index element={<DashboardPage />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="games" element={<GamesPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="revenue" element={<RevenuePage />} />
                        <Route path="users" element={<UsersPage />} />
                    </Routes>

                </div>
            </div>
        </div>
    );
}
