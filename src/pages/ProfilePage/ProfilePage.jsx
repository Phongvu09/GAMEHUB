import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import '../ProfilePage/ProfilePage.css';

export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return navigate('/login');

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
        });
        return unsubscribe;
    }, [navigate]);

    if (!userData) return <div className="profile-loading">Đang tải...</div>;

    return (
        <div className="profile-container">
            <h2>👤 Thông tin tài khoản</h2>
            <p><strong>Email:</strong> {auth.currentUser.email}</p>
            <p><strong>Tên tài khoản:</strong> {userData.username}</p>
            <p><strong>Thân phận:</strong> {userData.thanPhan}</p>
        </div>
    );
}
