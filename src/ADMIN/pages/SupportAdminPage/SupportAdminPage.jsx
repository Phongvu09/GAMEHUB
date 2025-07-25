import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import "./SupportAdminPage.css";

export default function SupportAdminPage() {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const snapshot = await getDocs(collection(db, "support_requests"));
                const list = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || "Không rõ",
                        email: data.email || "Không rõ",
                        message: data.message || "(Trống)",
                        createdAt: data.createdAt?.toDate?.() || null,
                    };
                });
                setFeedbacks(list);
            } catch (error) {
                console.error("❌ Lỗi tải phản hồi:", error);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div className="admin-page">
            <h2 className="admin-title">📬 Phản hồi từ khách hàng</h2>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Nội dung</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.length > 0 ? (
                            feedbacks.map((fb) => (
                                <tr key={fb.id}>
                                    <td>{fb.name}</td>
                                    <td>{fb.email}</td>
                                    <td>{fb.message}</td>
                                    <td>
                                        {fb.createdAt
                                            ? `${fb.createdAt.toLocaleDateString("vi-VN")} - ${fb.createdAt.toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}`
                                            : "Không rõ"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="no-data">
                                    Không có phản hồi nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
