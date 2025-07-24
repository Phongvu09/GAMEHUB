import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import "./OrdersPage.css";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const ordersSnap = await getDocs(collection(db, "orders"));
            const fetchedOrders = ordersSnap.docs.map((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toDate?.()
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt || Date.now());

                const cartItems = data.cart || data.items || [];

                return {
                    id: doc.id,
                    email: data.buyer?.email || 'Không rõ',
                    createdAt,
                    total: typeof data.total === 'number' ? data.total : 0,
                    itemCount: cartItems.length,
                    gameNames: cartItems.map((item) => item.name || "Không rõ tên game"),
                };
            });
            setOrders(fetchedOrders);
        };
        fetchOrders();
    }, []);

    return (
        <div className="orders-page">
            <h1 className="admin-title"> Danh sách đơn hàng</h1>
            <div className="order-list">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <p><strong>ID:</strong> {order.id}</p>
                        <p><strong>Email:</strong> {order.email}</p>
                        <p><strong>Ngày:</strong> {order.createdAt.toLocaleDateString('vi-VN')}</p>
                        <p><strong>Thời gian:</strong> {order.createdAt.toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}</p>
                        <p><strong>Số lượng game:</strong> {order.itemCount}</p>
                        <p><strong>Tên game:</strong> {order.gameNames.join(', ')}</p>
                        <p><strong>Tổng tiền:</strong> <span className="text-highlight">${order.total.toFixed(2)}</span></p>
                    </div>
                ))}
                {orders.length === 0 && (
                    <p className="no-data">Không có đơn hàng nào.</p>
                )}
            </div>
        </div>
    );
}
