import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import "./OrdersPage.css";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const snapshot = await getDocs(collection(db, "orders"));
            const data = snapshot.docs.map((doc) => {
                const {
                    buyer,
                    createdAt,
                    cart = [],
                    items = [],
                    total
                } = doc.data();

                const cartItems = cart.length > 0 ? cart : items;

                return {
                    id: doc.id,
                    email: buyer?.email ?? "Không rõ",
                    createdAt: createdAt?.toDate?.() ?? new Date(createdAt || Date.now()),
                    total: typeof total === "number" ? total : 0,
                    itemCount: cartItems.length,
                    gameNames: cartItems.map((item) => item?.name ?? "Không rõ tên game"),
                };
            });

            setOrders(data);
        };

        fetchOrders();
    }, []);

    return (
        <div className="orders-page">
            <h1 className="admin-title">Danh sách đơn hàng</h1>

            <div className="order-list">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <p><strong>ID:</strong> {order.id}</p>
                            <p><strong>Email:</strong> {order.email}</p>
                            <p><strong>Ngày:</strong> {order.createdAt.toLocaleDateString("vi-VN")}</p>
                            <p><strong>Thời gian:</strong> {order.createdAt.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</p>
                            <p><strong>Số lượng game:</strong> {order.itemCount}</p>
                            <p><strong>Tên game:</strong> {order.gameNames.join(", ")}</p>
                            <p><strong>Tổng tiền:</strong> <span className="text-highlight">${order.total.toFixed(2)}</span></p>
                        </div>
                    ))
                ) : (
                    <p className="no-data">Không có đơn hàng nào.</p>
                )}
            </div>
        </div>
    );
}
