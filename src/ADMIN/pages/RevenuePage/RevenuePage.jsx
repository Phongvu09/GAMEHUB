import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../RevenuePage/RevenuePage.css";

export default function RevenuePage() {
    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            const querySnapshot = await getDocs(collection(db, "orders"));
            const orderList = querySnapshot.docs.map((doc) => doc.data());
            setOrders(orderList);

            const revenue = orderList.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
            setTotalRevenue(revenue);
        };

        fetchOrders();
    }, []);

    return (
        <div className="admin-page">
            <h2 className="admin-title">💰 Tổng doanh thu</h2>

            <div className="admin-revenue-box">
                {totalRevenue.toLocaleString()} $
            </div>

            <h3 className="admin-subtitle">Danh sách đơn hàng</h3>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Người mua</th>
                            <th>Số game</th>
                            <th>Tổng tiền</th>
                            <th>Ngày mua</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.buyer || "Không rõ"}</td>
                                <td>{order.items?.length || 0}</td>
                                <td className="text-highlight">${order.totalPrice?.toLocaleString()}</td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="no-data">Không có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
