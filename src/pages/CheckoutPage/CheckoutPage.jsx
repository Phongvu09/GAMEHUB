import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { db } from '../../firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_...'); // Replace with your real publishable key

const cleanPrice = (priceStr) => {
    const numStr = priceStr.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
};

function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                alert("Bạn cần đăng nhập để thanh toán!");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setUser(currentUser);

                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.warn("Không tìm thấy user trong Firestore.");
                    }
                } catch (err) {
                    console.error("Lỗi khi lấy user từ Firestore:", err);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const getTotal = () => {
        const total = cart.reduce((sum, item) => sum + cleanPrice(item.price), 0);
        return total.toFixed(2);
    };

    const completeOrder = async () => {
        if (!user) {
            alert("Vui lòng đăng nhập để thực hiện thanh toán.");
            return;
        }

        if (cart.length === 0) {
            alert("Giỏ hàng đang trống.");
            return;
        }

        let paymentSuccess = false;
        let stripePMId = null;

        if (paymentMethod === "Stripe") {
            if (!stripe || !elements) {
                alert("Stripe chưa sẵn sàng");
                return;
            }

            const card = elements.getElement(CardElement);
            const { error, paymentMethod: stripePM } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (error) {
                setMessage(`Lỗi: ${error.message}`);
                return;
            }

            paymentSuccess = true;
            stripePMId = stripePM.id;
            setMessage(`Thanh toán thành công! ID: ${stripePMId}`);
        } else {
            paymentSuccess = true;
            alert(`Thanh toán thành công bằng phương thức: ${paymentMethod}\nTổng tiền: $${getTotal()}`);
        }

        if (paymentSuccess) {
            try {
                await addDoc(collection(db, 'orders'), {
                    cart,
                    total: parseFloat(getTotal()),
                    paymentMethod,
                    paymentId: stripePMId || null,
                    createdAt: serverTimestamp(),
                    buyer: {
                        name: userData?.username || "Không rõ",
                        email: user?.email || "Không rõ",
                    },
                });
            } catch (err) {
                console.error("Lỗi khi lưu đơn hàng:", err);
                setMessage("Thanh toán thành công nhưng không thể lưu đơn hàng.");
                return;
            }

            localStorage.removeItem('cart');
            setCart([]);
            setTimeout(() => {
                window.location.href = `/`;
            }, 100);
        }
    };

    return (
        <div className="checkout-page">
            <h1>Thanh toán</h1>

            {cart.length === 0 ? (
                <p className="empty-text">Giỏ hàng đang trống.</p>
            ) : (
                <>
                    <ul className="checkout-list">
                        {cart.map(item => (
                            <li key={item.id} className="checkout-item">
                                <img src={item.image} alt={item.name} />
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>Giá: {item.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="checkout-total">
                        <p><strong>Tổng tiền:</strong> ${getTotal()}</p>
                    </div>

                    <div className="payment-methods">
                        <h3>Chọn phương thức thanh toán:</h3>

                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="Bank"
                                checked={paymentMethod === 'Bank'}
                                onChange={() => setPaymentMethod('Bank')}
                            />
                            Bank
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="vnpay"
                                checked={paymentMethod === 'vnpay'}
                                onChange={() => setPaymentMethod('vnpay')}
                            />
                            VNPay
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value="Stripe"
                                checked={paymentMethod === 'Stripe'}
                                onChange={() => setPaymentMethod('Stripe')}
                            />
                            Thẻ tín dụng (Stripe Test)
                        </label>

                        {paymentMethod === 'Stripe' && (
                            <div className="stripe-form">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#fff',
                                                '::placeholder': { color: '#aaa' },
                                            },
                                            invalid: { color: '#e5424d' },
                                        },
                                    }}
                                />
                                {message && <p style={{ marginTop: '10px' }}>{message}</p>}
                            </div>
                        )}
                    </div>

                    <button className="complete-btn" onClick={completeOrder}>
                        Thanh toán
                    </button>
                </>
            )}
        </div>
    );
}

export default function WrappedCheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    );
}