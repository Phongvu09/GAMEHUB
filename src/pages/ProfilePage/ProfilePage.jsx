import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../ProfilePage/ProfilePage.css';

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                    setUsername(data.username || '');
                    setPhone(data.phone || '');
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSave = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, { username, phone });

            setUserData({ ...userData, username, phone });
            setEditing(false);
            alert('✅ Cập nhật thành công');
        } catch (error) {
            console.error('❌ Cập nhật thất bại:', error);
            alert('❌ Đã xảy ra lỗi khi cập nhật');
        }
    };

    const handleCancel = () => {
        setUsername(userData.username || '');
        setPhone(userData.phone || '');
        setEditing(false);
    };

    if (loading) return <div className="profile-loading">Đang tải...</div>;

    return (
        <div className="profile-container">
            <h2>👤 Thông tin tài khoản</h2>
            <p><strong>Email:</strong> {auth.currentUser?.email || 'Không xác định'}</p>

            {!editing ? (
                <>
                    <p><strong>Tên tài khoản:</strong> {userData.username || 'Chưa có'}</p>
                    <p><strong>Số điện thoại:</strong> {userData.phone || 'Chưa có'}</p>
                    <button className="edit-button" onClick={() => setEditing(true)}>Thay đổi</button>
                </>
            ) : (
                <>
                    <div className="profile-field">
                        <label>Tên tài khoản:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="profile-field">
                        <label>Số điện thoại:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ví dụ: 0912345678"
                        />
                    </div>

                    <div className="edit-actions">
                        <button className="save-button" onClick={handleSave}>Lưu</button>
                        <button className="cancel-button" onClick={handleCancel}>Hủy</button>
                    </div>
                </>
            )}
        </div>
    );
}
