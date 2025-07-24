// RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase.js';
import '../Register/Register.css';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('')
    const [thanPhan, setThanPhan] = useState('Người mua');
    const navigate = useNavigate();


    const handleRegister = async () => {
        if (!email || !username || !password || !repassword || !thanPhan) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (repassword !== password) {
            alert("Mật khẩu không khớp");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Lưu thông tin người dùng vào "users"
            await setDoc(doc(db, 'users', uid), {
                email,
                username,
                thanPhan,
                createdAt: serverTimestamp(),
            });


            alert('Tạo tài khoản thành công!');
            navigate('/');
        } catch (error) {
            alert('Đăng ký thất bại: ' + error.message);
        }
    };


    return (
        <div className="register-container">
            <h2>Đăng ký</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Tên tài khoản" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Nhập lại mật khẩu" onChange={(e) => setRepassword(e.target.value)} />
            <select value={thanPhan} onChange={(e) => setThanPhan(e.target.value)}>
                <option>Người mua</option>
                <option>Nhà phát hành</option>
            </select>
            <button onClick={handleRegister}>Đăng ký</button>
        </div>
    );
}

export default RegisterPage