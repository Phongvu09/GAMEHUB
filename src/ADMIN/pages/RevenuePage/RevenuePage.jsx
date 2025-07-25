import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import "./RevenuePage.css";

export default function RevenuePage() {
    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            const ordersSnap = await getDocs(collection(db, "orders"));
            const data = ordersSnap.docs.map((doc) => {
                const {
                    createdAt,
                    cart = [],
                    total = 0,
                    paymentMethod = "N/A"
                } = doc.data();

                const safeCreatedAt =
                    createdAt?.toDate?.() ?? new Date(createdAt || Date.now());

                const gameNames = cart.map(item => item?.name ?? "Không rõ");

                return {
                    id: doc.id,
                    createdAt: safeCreatedAt,
                    total,
                    paymentMethod,
                    gameNames,
                };
            });

            setOrders(data);
            setTotalRevenue(data.reduce((sum, o) => sum + o.total, 0));
        };

        fetchOrders();
    }, []);

    return (
        <div className="revenue-page">
            <h1 className="admin-title">Quản lý doanh thu</h1>

            <div className="total-revenue">
                <strong>Tổng doanh thu:</strong>{" "}
                <span className="text-highlight">${totalRevenue.toFixed(2)}</span>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID Đơn</th>
                            <th>Phương thức</th>
                            <th>Ngày</th>
                            <th>Thời gian</th>
                            <th>Tên game</th>
                            <th>Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.createdAt.toLocaleDateString("vi-VN")}</td>
                                    <td>{order.createdAt.toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}</td>
                                    <td>
                                        <div className="game-names">
                                            {order.gameNames.join(", ")}
                                        </div>
                                    </td>
                                    <td className="text-highlight">${order.total.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">Không có đơn nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
