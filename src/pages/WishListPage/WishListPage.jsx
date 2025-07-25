import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import './WishListPage.css';

export default function WishlistPage() {
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const docRef = doc(db, 'wishlists', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setGames(docSnap.data().items || []);
            } else {
                setGames([]);
            }
        };

        fetchWishlist();
    }, []);

    const removeFromWishlist = async (id) => {
        const updated = games.filter(game => game.id !== id);
        setGames(updated);

        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, 'wishlists', user.uid);
        await updateDoc(docRef, { items: updated });
    };

    const clearWishlist = async () => {
        setGames([]);

        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, 'wishlists', user.uid);
        await setDoc(docRef, { items: [] }); // Xóa hết nhưng giữ document
    };

    if (!auth.currentUser) {
        return (
            <div className="wishlist-page">
                <h2>Vui lòng đăng nhập để xem danh sách yêu thích</h2>
            </div>
        );
    }

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
