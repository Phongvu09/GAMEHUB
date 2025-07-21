import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import "../AdminDashboard/AdminDashboard.css";

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
            <h2>Dashboard</h2>
            <div className="stats">
                <div className="stat-box">
                    <h3>Games</h3>
                    <p>{gameCount}</p>
                </div>
                <div className="stat-box">
                    <h3>Users</h3>
                    <p>{userCount}</p>
                </div>
                <div className="stat-box">
                    <h3>Total Revenue</h3>
                    <p>${totalRevenue.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
