import { useEffect, useState } from 'react';
import { fetchSteamGame } from '../../service/api.js';
import '../WishListPage/WishlistPage.css'

export default function WishlistPage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const loadWishlist = async () => {
            const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

            const results = await Promise.allSettled(
                wishlist.map(id => fetchSteamGame(id))
            );

            const loadedGames = results
                .filter(res => res.status === 'fulfilled')
                .map((res, index) => ({
                    ...res.value,
                    id: wishlist[index],
                }));

            setGames(loadedGames);
        };

        loadWishlist();
    }, []);

    if (games.length === 0) {
        return <div className="wishlist-page">💔 Danh sách yêu thích đang trống.</div>;
    }

    return (
        <div className="wishlist-page">
            <h1>Your Wish List</h1>
            {games.map(game => (
                <div key={game.id} className="wishlist-item">
                    <img
                        src={game.header_image}
                        alt={game.name}
                        className="wishlist-img"
                    />
                    <div className="wishlist-info">
                        <h3>{game.name}</h3>
                        <p><strong>Giá:</strong> {game.price_overview?.final_formatted || 'Miễn phí'}</p>
                        <p><strong>Hệ điều hành:</strong> {game.platforms && Object.entries(game.platforms)
                            .filter(([_, supported]) => supported)
                            .map(([os]) => os.toUpperCase())
                            .join(', ')}</p>
                        <p><strong>Thể loại:</strong> {game.genres?.map(g => g.description).join(', ')}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
