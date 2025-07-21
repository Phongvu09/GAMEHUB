import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import '../OrdersPage/OrdersPage.css'

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const ordersSnap = await getDocs(collection(db, "orders"));
            const fetchedOrders = ordersSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(fetchedOrders);
        };
        fetchOrders();
    }, []);

    return (
        <div className="admin-page">
            <h1 className="admin-title">🧾 Quản lý đơn hàng</h1>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID Đơn</th>
                            <th>Email</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Số lượng game</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.email}</td>
                                <td>{new Date(order.date).toLocaleString()}</td>
                                <td className="text-highlight">${order.totalPrice?.toLocaleString()}</td>
                                <td>{order.items?.length}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="no-data">Không có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
