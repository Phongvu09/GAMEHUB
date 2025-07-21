import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import '../UsersPage/UsersPage.css'

export default function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, "users"));
            const userList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(userList);
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-page">
            <h2 className="admin-title">👥 Quản lý người dùng</h2>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Email</th>
                            <th>Thân phận</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id || index}>
                                <td>{user.username || "Chưa có"}</td>
                                <td>{user.email}</td>
                                <td className="capitalize">{user.role || "người mua"}</td>
                                <td>
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : "Không rõ"}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="no-data">
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
