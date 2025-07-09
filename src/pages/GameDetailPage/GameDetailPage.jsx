import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSteamGame } from '../../service/api.js';
import GameCard from '../../components/GameCard';
import '../GameDetailPage/GameDetailPage.css'

function stripImageFromHTML(html) {
    return html.replace(/<img[^>]*>/g, '');
}

function GameDetailPage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [suggestedGames, setSuggestedGames] = useState([]);

    const handleClick = () => {
        navigate(`/game/${game.steam_appid || game.id}`);
    };

    useEffect(() => {
        async function load() {
            const data = await fetchSteamGame(id);
            if (data) {
                setGame(data);

                // Load game đề xuất
                const genre = data.genres?.[0]?.id || data.genres?.[0]?.description;

                if (genre) {
                    const suggestedIds = [
                        292030, 1174180, 1091500, 413150, 271590, 1145360, 236390, 550, 1222670, 1222140,
                        582160, 812140, 379720, 203160, 638970, 945360, 359550, 208650, 359870, 582010,
                        311210, 242760, 620, 47810, 8930, 644930, 19900, 6000, 204100, 304240]
                        .filter(gid => gid !== parseInt(id)); // Không lấy game hiện tại

                    const results = await Promise.allSettled(suggestedIds.map(fetchSteamGame));

                    const games = results
                        .filter(r => r.status === 'fulfilled')
                        .map((r, i) => ({ ...r.value, id: suggestedIds[i] }))
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3); //

                    setSuggestedGames(games);
                }

            }
        }
        load();
    }, [id]);

    if (!game) return <div className="loading">Đang tải game...</div>;

    const {
        name,
        header_image,
        short_description,
        detailed_description,
        release_date,
        developers,
        publishers,
        price_overview,
        genres,
        metacritic,
        movies,
        screenshots,
        pc_requirements,
    } = game;

    const trailer = movies?.[0];
    const price = price_overview?.final_formatted || 'Miễn phí';

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const exists = cart.find(item => item.id === id);
        if (!exists) {
            cart.push({ id, name, image: header_image, price });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Đã thêm vào giỏ hàng');
        } else {
            alert('Game đã có trong giỏ');
        }
    };

    const buyNow = () => {
        window.location.href = '/cart';
    };

    return (
        <div className="game-detail-page">
            <h1 className="detail-title">{name}</h1>

            <div className="detail-layout">
                <div className="detail-left">
                    {trailer ? (
                        <video
                            className="detail-video"
                            controls
                            src={trailer.webm?.max || trailer.mp4?.max}
                            poster={trailer.thumbnail}
                        />
                    ) : (
                        <img src={header_image} alt={name} className="detail-video" />
                    )}
                </div>

                <div className="detail-right">
                    <p><strong>Giá:</strong> {price}</p>
                    <p><strong>Phát hành:</strong> {release_date?.date}</p>
                    <p><strong>Nhà phát triển:</strong> {developers?.join(', ')}</p>
                    <p><strong>Nhà phát hành:</strong> {publishers?.join(', ')}</p>
                    <p><strong>Thể loại:</strong> {genres?.map(g => g.description).join(', ')}</p>
                    <p><strong>Metacritic:</strong> {metacritic?.score || 'Không có'}</p>

                    <div className="btn-group">
                        <button className="btn add" onClick={addToCart}>🛒 Thêm vào giỏ</button>
                        <button className="btn buy" onClick={buyNow}>💳 Mua ngay</button>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>Mô tả ngắn</h3>
                <p>{short_description}</p>
            </div>

            <div className="section">
                <h3>Mô tả chi tiết</h3>
                <div dangerouslySetInnerHTML={{ __html: stripImageFromHTML(detailed_description) }} />
            </div>

            {pc_requirements?.minimum && (
                <div className="section">
                    <h3>Yêu cầu hệ thống</h3>
                    <div dangerouslySetInnerHTML={{ __html: pc_requirements.minimum }} />
                    {pc_requirements.recommended && (
                        <>
                            <h4>Đề nghị:</h4>
                            <div dangerouslySetInnerHTML={{ __html: pc_requirements.recommended }} />
                        </>
                    )}
                </div>
            )}

            {screenshots?.length > 0 && (
                <div className="screenshots">
                    <h3>Ảnh màn hình</h3>
                    <div className="screenshots">
                        {screenshots.slice(0, 2).map(s => (
                            <img key={s.id} src={s.path_thumbnail} alt="screenshot" />
                        ))}
                    </div>
                </div>
            )}

            {suggestedGames.length > 0 && (
                <div className="section" onClick={handleClick}>
                    <h3> Đề xuất bạn cũng có thể thích</h3>
                    <div className="screenshots">
                        {suggestedGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameDetailPage;
