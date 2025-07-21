// LoginPage.jsx (form cũ, chức năng mới - Firebase auth + phân quyền, KHÔNG dùng localStorage)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.js';
import '../LoginPage/LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ email và mật khẩu');
            return; x
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const userDoc = await getDoc(doc(db, 'users', uid));

            if (!userDoc.exists()) {
                alert('Tài khoản chưa được thiết lập đầy đủ. Vui lòng đăng ký.');
                navigate('/register');
                return;
            }

            const userData = userDoc.data();

            switch (userData.thanPhan) {
                case 'Người mua': navigate('/'); break;
                case 'Người bán': navigate('/dashboard/seller'); break;
                case 'Nhà phát hành': navigate('/dashboard/publisher'); break;
                default: navigate('/profile');
            }
        } catch (error) {
            alert('❌ Đăng nhập thất bại: ' + error.message);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="login-container">
            <h2>Đăng nhập</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Đăng nhập</button>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Chưa có tài khoản? <a href="/register">Tạo tài khoản mới</a>
            </p>
        </form>
    );
}
