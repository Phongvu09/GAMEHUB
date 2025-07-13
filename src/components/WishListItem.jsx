import './WishlistItem.css';

function WishlistItem({ game }) {
    const osIcons = {
        windows: '🪟',
        mac: '🍎',
        linux: '🐧',
    };

    const supportedOS = game.platforms || {}; // Ví dụ: { windows: true, mac: false, linux: true }

    return (
        <div className="wishlist-item">
            <img src={game.header_image} alt={game.name} className="wishlist-img" />
            <div className="wishlist-info">
                <h3>{game.name}</h3>
                <p><strong>Thể loại:</strong> {game.genres?.map(g => g.description).join(', ')}</p>
                <p><strong>Hệ điều hành hỗ trợ:</strong> {
                    Object.keys(supportedOS)
                        .filter(os => supportedOS[os])
                        .map(os => osIcons[os] || os)
                        .join(' ')
                }</p>
            </div>
        </div>
    );
}

export default WishlistItem;
