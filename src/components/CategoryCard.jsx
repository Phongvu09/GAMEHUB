import { Link } from 'react-router-dom';
import './CategoryCard.css'

export default function CategoryCard({ game }) {
    if (!game) return null;

    const { id, name, short_description, header_image, movies } = game;
    const videoUrl = movies?.[0]?.webm?.max || movies?.[0]?.mp4?.max;

    return (
        <div className="category-card">
            {/* Video bên trái */}
            <div className="category-video">
                {videoUrl ? (
                    <video src={videoUrl} autoPlay loop muted />
                ) : (
                    <div className="video-placeholder">Không có video</div>
                )}
            </div>

            {/* Bên phải */}
            <div className="category-info">
                <div className="game-image">
                    <img src={header_image} alt={name} />
                </div>
                <div className="game-details">
                    <h2>{name}</h2>
                    <p>{short_description}</p>
                    <Link to={`/game/${id}`} className="view-button">Xem chi tiết</Link>
                </div>
            </div>
        </div>
    );
}
