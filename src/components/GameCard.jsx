import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game }) {
    const [hovered, setHovered] = useState(false);
    const [tooltipSide, setTooltipSide] = useState('right');
    const [isWishlisted, setIsWishlisted] = useState(false);

    const cardRef = useRef(null);
    const navigate = useNavigate();
    const trailer = game.movies?.[0];

    const addToWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const exists = wishlist.find(item => item.id === game.id);
        if (!exists) {
            wishlist.push({
                id: game.id || game.steam_appid,
                name: game.name,
                header_image: game.header_image
            });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert("Đã thêm vào Wishlist");
        } else {
            alert("Game đã có trong Wishlist");
        }
    };


    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setIsWishlisted(wishlist.some(item => item.id === game.id));
    }, [game.id]);

    useEffect(() => {
        if (hovered && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const isNearRightEdge = window.innerWidth - rect.right < 300;
            setTooltipSide(isNearRightEdge ? 'left' : 'right');
        }
    }, [hovered]);

    const handleClick = () => {
        navigate(`/game/${game.steam_appid || game.id}`);
    };

    const handleAddToWishlist = (e) => {
        e.stopPropagation();
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const exists = wishlist.find(item => item.id === game.id);
        if (!exists) {
            wishlist.push({
                id: game.id,
                name: game.name,
                image: game.header_image,
            });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            setIsWishlisted(true);
            alert('💖 Đã thêm vào danh sách yêu thích');
        } else {
            alert('✅ Game đã có trong danh sách yêu thích');
        }
    };

    return (
        <div
            ref={cardRef}
            className="game-card-wrapper"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
        >
            <div className="game-card">
                {!hovered || !trailer ? (
                    <img src={game.header_image} alt={game.name} className="game-media" />
                ) : (
                    <video
                        className="game-media"
                        src={trailer.webm?.max || trailer.mp4?.max}
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={game.header_image}
                    />
                )}
            </div>

            {hovered && (
                <div className={`tooltip-panel tooltip-${tooltipSide}`}>
                    <h4>{game.name}</h4>
                    <p><strong>Giá:</strong> {game.price_overview?.final_formatted || 'Miễn phí'}</p>
                    <p><strong>Phát hành:</strong> {game.release_date?.date}</p>
                    <p><strong>Thể loại:</strong> {game.genres?.map(g => g.description).join(', ')}</p>
                    <button
                        className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
                        onClick={handleAddToWishlist}
                        title={isWishlisted ? 'Đã yêu thích' : 'Thêm vào danh sách yêu thích'}
                    >
                        ❤️ {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default GameCard;
