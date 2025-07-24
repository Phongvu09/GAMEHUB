import { useEffect, useState } from 'react';
import './CartPage.css';

function CartPage() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(stored);
    }, []);

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const goToCheckout = () => {
        if (cart.length === 0) {
            alert("Giỏ hàng đang trống.");
            return;
        }
        window.location.href = '/checkout';
    };

    return (
        <div className="cart-page">
            <h1>Giỏ Hàng</h1>

            {cart.length === 0 ? (
                <p className='cart'>Giỏ hàng đang trống</p>
            ) : (
                <>
                    <ul className="cart-list">
                        {cart.map(item => (
                            <li key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} />
                                <div className="item-info">
                                    <p><strong>{item.name}</strong></p>
                                    <p>Giá: {item.price}</p>
                                    <button onClick={() => removeItem(item.id)}>Xóa</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="cart-actions">
                        <button className="clear-btn" onClick={clearCart}>Xóa toàn bộ</button>
                        <button className="checkout-btn" onClick={goToCheckout}>Thanh toán</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
