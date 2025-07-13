import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckoutPage.css';

const stripePromise = loadStripe('pk_test_...')

const cleanPrice = (priceStr) => {
    const numStr = priceStr.replace(/[^0-9.]/g, '');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
};

function CheckoutPage() {
    const [cart, setCart] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [message, setMessage] = useState(' ')
    const stripe = useStripe()
    const elements = useElements()



    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
    }, []);

    const getTotal = () => {
        const total = cart.reduce((sum, item) => sum + cleanPrice(item.price), 0);
        return total.toFixed(2);
    };

    const completeOrder = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng đang trống.");
            return
        }

        if (paymentMethod == "Stripe") {
            if (!stripe || !elements) {
                alert("Stripe chưa sẵn sàng")
                return
            }

            const card = elements.getElement(CardElement)
            const { error, paymentMethod: stripePM } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            })

            if (error) {
                setMessage(`Lỗi: ${error.message}`)
                return
            }

            setMessage(`Thanh toán thành công! ID : ${stripePM.id}`)
        } else {
            alert(`Thanh toán thành công bằng phương thức: ${paymentMethod}\nTổng tiền: $${getTotal()}`)
        }

        localStorage.removeItem('cart')
        setCart([])
        setTimeout(() => {
            window.location.href = `/`
        }, 2000)
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

                    <div className="checkout-total">++
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