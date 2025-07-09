import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game }) {
    const [hovered, setHovered] = useState(false);
    const [tooltipSide, setTooltipSide] = useState('right');
    const cardRef = useRef(null);
    const navigate = useNavigate();
    const trailer = game.movies?.[0];

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
                </div>
            )}
        </div>
    );
}

export default GameCard;

