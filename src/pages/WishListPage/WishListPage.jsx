import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WishListPage.css';

export default function WishlistPage() {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('wishlist')) || [];
        setGames(stored);
    }, []);

    const removeFromWishlist = (id) => {
        const updated = games.filter(game => game.id !== id);
        setGames(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
    };

    const clearWishlist = () => {
        if (window.confirm('Bạn có chắc muốn xóa toàn bộ danh sách yêu thích?')) {
            setGames([]);
            localStorage.removeItem('wishlist');
        }
    };

    if (games.length === 0) {
        return (
            <div className="wishlist-page">
                <h2>Danh sách yêu thích đang trống</h2>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <h1>Danh sách yêu thích</h1>

            <div className="wishlist-list">
                {games.map(game => (
                    <div
                        key={game.id}
                        className="wishlist-item"
                        onClick={() => navigate(`/game/${game.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={game.image} alt={game.name} className="wishlist-img" />
                        <div className="wishlist-info">
                            <h3>{game.name}</h3>
                            <p><strong>Giá:</strong> {game.price}</p>
                            <p><strong>Hệ điều hành:</strong> {game.platforms && Object.entries(game.platforms)
                                .filter(([_, supported]) => supported)
                                .map(([os]) => os.toUpperCase())
                                .join(', ')}</p>
                            <p><strong>Thể loại:</strong> {game.genres?.map(g => g.description).join(', ')}</p>
                            <button
                                className="remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromWishlist(game.id);
                                }}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="wishlist-actions">
                <button className="clear-btn" onClick={clearWishlist}>Xóa toàn bộ</button>
            </div>
        </div>
    );
}
