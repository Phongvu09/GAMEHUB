import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Đường dẫn đúng tới firebase.js
import './SupportPage.css';

function SupportPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'support_requests'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('❌ Lỗi gửi yêu cầu hỗ trợ:', error);
            alert('Đã có lỗi xảy ra, vui lòng thử lại sau.');
        }
    };

    return (
        <div className="support-container">
            <h1>Hỗ trợ khách hàng</h1>

            <section className="support-section">
                <h2>📘 Câu hỏi thường gặp</h2>
                <ul>
                    <li><strong>Q:</strong> Làm sao để đăng ký tài khoản?<br /><strong>A:</strong> Nhấn vào nút "Đăng ký" ở góc trên bên phải và điền thông tin.</li>
                    <li><strong>Q:</strong> Tôi quên mật khẩu, phải làm sao?<br /><strong>A:</strong> Chọn “Quên mật khẩu” tại trang đăng nhập để đặt lại.</li>
                </ul>
            </section>

            <section className="support-section">
                <h2>📨 Liên hệ hỗ trợ</h2>
                <p>Bạn có thể gửi phản hồi hoặc báo lỗi qua địa chỉ email: <a href="mailto:support@example.com">support@example.com</a></p>
                <p>Hoặc điền vào biểu mẫu bên dưới:</p>

                {submitted ? (
                    <p style={{ color: 'lightgreen' }}>Cảm ơn bạn, thông tin đã được gửi!</p>
                ) : (
                    <form className="support-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Tên của bạn"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Nội dung hỗ trợ..."
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                        <button type="submit">Gửi yêu cầu</button>
                    </form>
                )}
            </section>
        </div>
    );
}

export default SupportPage;
