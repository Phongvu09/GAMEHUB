import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import AdminCard from '../components/AdminCard';
import '../admin.css';

export default function DashboardPage() {
    const [gameCount, setGameCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const gamesSnap = await getDocs(collection(db, "games"));
            const usersSnap = await getDocs(collection(db, "users"));
            const ordersSnap = await getDocs(collection(db, "orders"));

            setGameCount(gamesSnap.size);
            setUserCount(usersSnap.size);

            let total = 0;
            ordersSnap.forEach((doc) => {
                const data = doc.data();
                if (data.totalPrice) {
                    total += data.totalPrice;
                }
            });
            setTotalRevenue(total);
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Trang Quản Trị</h1>
            <div className="card-container">
                <AdminCard title="Số lượng game" value={gameCount} color="#4CAF50" />
                <AdminCard title="Số lượng người dùng" value={userCount} color="#2196F3" />
                <AdminCard title="Tổng doanh thu" value={`$${totalRevenue.toLocaleString()}`} color="#FF9800" />
            </div>
        </div>
    );
}
