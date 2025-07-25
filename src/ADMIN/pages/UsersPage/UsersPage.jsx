import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "firebase/firestore";
import "../UsersPage/UsersPage.css";

export default function UsersPage() {
    const [users, setUsers] = useState([]);

    // Truy vấn người dùng
    const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, "users"));
        const userList = snapshot.docs.map((doc) => {
            const { createdAt, username, email, role } = doc.data();
            return {
                id: doc.id,
                username: username || "Chưa có",
                email: email || "Không rõ",
                role: role || "Người mua",
                createdAt: createdAt?.toDate?.() ?? null,
            };
        });
        setUsers(userList);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm xoá người dùng
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Bạn có chắc muốn xoá tài khoản này?");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "users", userId));
            setUsers(prev => prev.filter(user => user.id !== userId)); // Cập nhật UI
        } catch (error) {
            console.error("Lỗi khi xoá người dùng:", error);
            alert("Xoá thất bại!");
        }
    };

    return (
        <div className="admin-page">
            <h2 className="admin-title">Quản lý người dùng</h2>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Email</th>
                            <th>Thân phận</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td className="capitalize">{user.role}</td>
                                    <td>
                                        {user.createdAt
                                            ? user.createdAt.toLocaleDateString("vi-VN")
                                            : "Không rõ"}
                                    </td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="no-data">
                                    Không có người dùng nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
