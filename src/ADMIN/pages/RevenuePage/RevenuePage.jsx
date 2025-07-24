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
                const order = doc.data();
                const createdAt = order.createdAt?.toDate?.()
                    ? order.createdAt.toDate()
                    : new Date(order.createdAt || Date.now());

                const gameNames = (order.cart || []).map(item => item.name || "Không rõ");

                return {
                    id: doc.id,
                    createdAt,
                    total: order.total || 0,
                    paymentMethod: order.paymentMethod || "N/A",
                    gameNames,
                };
            });

            setOrders(data);
            const total = data.reduce((sum, order) => sum + order.total, 0);
            setTotalRevenue(total);
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
                        {orders.map((order) => (
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
                                        {order.gameNames.map((name, index) => (
                                            <span key={index} className="game-tag">{name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="text-highlight">${order.total.toFixed(2)}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
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
