import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "../AdminDashboard/AdminDashboard.css";

export default function DashboardPage() {
    const [gameCount, setGameCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [categoryStats, setCategoryStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                setUserCount(usersSnap.size);

                const ordersSnap = await getDocs(collection(db, "orders"));
                let total = 0;
                ordersSnap.forEach((doc) => {
                    const data = doc.data();
                    if (data.total) total += data.total;
                });
                setTotalRevenue(total);

                const categorySnap = await getDoc(doc(db, "gameLists", "categories"));
                if (categorySnap.exists()) {
                    const data = categorySnap.data();
                    const stats = [];

                    // ✅ Lấy số lượng game từ 'all'
                    if (data.all && Array.isArray(data.all) && typeof data.all[0] === "string") {
                        const allIds = data.all[0]
                            .split(",")
                            .map((id) => id.trim())
                            .filter((id) => id.length > 0);
                        setGameCount(allIds.length);
                    } else {
                        console.warn("⚠️ Không tìm thấy field 'all' hợp lệ trong categories");
                    }

                    // ✅ Lấy các category khác (ngoại trừ 'all')
                    for (const [category, gameArray] of Object.entries(data)) {
                        if (category === "all") continue;
                        if (Array.isArray(gameArray) && typeof gameArray[0] === "string") {
                            const ids = gameArray[0]
                                .split(",")
                                .map((id) => id.trim())
                                .filter((id) => id.length > 0);
                            stats.push({
                                name: category,
                                count: ids.length,
                            });
                        }
                    }

                    setCategoryStats(stats);
                } else {
                    console.warn("⚠️ Không tìm thấy document 'gameLists/categories'");
                }
            } catch (error) {
                console.error("❌ Lỗi khi load dashboard:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h2 className="admin-title">Tổng quan</h2>
            <div className="stats">
                <div className="stat-box">
                    <h3>All games</h3>
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

            <h3 className="category-title">Category Statistics</h3>
            <div className="category-stats">
                {categoryStats.map((cat) => (
                    <div key={cat.name} className="stat-box">
                        <h4>{cat.name}</h4>
                        <p>{cat.count} game</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
