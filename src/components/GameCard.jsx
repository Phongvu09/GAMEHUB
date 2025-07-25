// import { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './GameCard.css';

// function GameCard({ game }) {
//     const [hovered, setHovered] = useState(false);
//     const [tooltipSide, setTooltipSide] = useState('right');
//     const [isWishlisted, setIsWishlisted] = useState(false);

//     const cardRef = useRef(null);
//     const navigate = useNavigate();
//     const trailer = game.movies?.[0];



//     useEffect(() => {
//         const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//         setIsWishlisted(wishlist.some(item => item.id === game.id));
//     }, [game.id]);

//     useEffect(() => {
//         if (hovered && cardRef.current) {
//             const rect = cardRef.current.getBoundingClientRect();
//             const isNearRightEdge = window.innerWidth - rect.right < 300;
//             setTooltipSide(isNearRightEdge ? 'left' : 'right');
//         }
//     }, [hovered]);

//     const handleClick = () => {
//         navigate(`/game/${game.steam_appid || game.id}`);
//     };

//     const handleAddToWishlist = (e) => {
//         e.stopPropagation();
//         const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//         const exists = wishlist.find(item => item.id === game.id);
//         if (!exists) {
//             wishlist.push({
//                 id: game.id,
//                 name: game.name,
//                 image: game.header_image,
//                 genres: game.genres,
//                 platforms: game.platforms,
//                 price: game.price_overview?.final_formatted || 'Miễn phí',
//             });
//             localStorage.setItem('wishlist', JSON.stringify(wishlist));
//             setIsWishlisted(true);
//             alert('💖 Đã thêm vào danh sách yêu thích');
//         } else {
//             alert('✅ Game đã có trong danh sách yêu thích');
//         }
//     };


//     return (
//         <div
//             ref={cardRef}
//             className="game-card-wrapper"
//             onMouseEnter={() => setHovered(true)}
//             onMouseLeave={() => setHovered(false)}
//             onClick={handleClick}
//         >
//             <div className="game-card">
//                 {!hovered || !trailer ? (
//                     <img src={game.header_image} alt={game.name} className="game-media" />
//                 ) : (
//                     <video
//                         className="game-media"
//                         src={trailer.webm?.max || trailer.mp4?.max}
//                         autoPlay
//                         muted
//                         loop
//                         playsInline
//                         poster={game.header_image}
//                     />
//                 )}
//             </div>

//             {hovered && (
//                 <div className={`tooltip-panel tooltip-${tooltipSide}`}>
//                     <h4>{game.name}</h4>
//                     <p><strong>Giá:</strong> {game.price_overview?.final_formatted || 'Miễn phí'}</p>
//                     <p><strong>Phát hành:</strong> {game.release_date?.date}</p>
//                     <p><strong>Thể loại:</strong> {game.genres?.map(g => g.description).join(', ')}</p>
//                     <button
//                         className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
//                         onClick={handleAddToWishlist}
//                         title={isWishlisted ? 'Đã yêu thích' : 'Thêm vào danh sách yêu thích'}
//                     >
//                         ❤️ {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default GameCard;

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameCard.css';

import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

function GameCard({ game }) {
    const [hovered, setHovered] = useState(false);
    const [tooltipSide, setTooltipSide] = useState('right');
    const [isWishlisted, setIsWishlisted] = useState(false);

    const cardRef = useRef(null);
    const navigate = useNavigate();
    const trailer = game.movies?.[0];

    // Kiểm tra game đã có trong wishlist chưa
    useEffect(() => {
        const checkWishlist = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const docRef = doc(db, 'wishlists', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const items = docSnap.data().items || [];
                const exists = items.some(item => item.id === game.id);
                setIsWishlisted(exists);
            }
        };

        checkWishlist();
    }, [game.id]);

    // Xác định vị trí tooltip
    useEffect(() => {
        if (hovered && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const isNearRightEdge = window.innerWidth - rect.right < 300;
            setTooltipSide(isNearRightEdge ? 'left' : 'right');
        }
    }, [hovered]);

    // Điều hướng đến trang chi tiết game
    const handleClick = () => {
        navigate(`/game/${game.steam_appid || game.id}`);
    };

    // Thêm vào wishlist
    const handleAddToWishlist = async (e) => {
        e.stopPropagation();

        const user = auth.currentUser;
        if (!user) {
            alert('🚫 Vui lòng đăng nhập để thêm vào danh sách yêu thích!');
            return;
        }

        const docRef = doc(db, 'wishlists', user.uid);
        const docSnap = await getDoc(docRef);

        const newItem = {
            id: game.id,
            name: game.name,
            image: game.header_image,
            genres: game.genres,
            platforms: game.platforms,
            price: game.price_overview?.final_formatted || 'Miễn phí',
        };

        if (docSnap.exists()) {
            const items = docSnap.data().items || [];
            const exists = items.some(item => item.id === game.id);
            if (exists) {
                alert('✅ Game đã có trong danh sách yêu thích');
                return;
            }

            await updateDoc(docRef, {
                items: arrayUnion(newItem),
            });
        } else {
            await setDoc(docRef, {
                items: [newItem],
            });
        }

        setIsWishlisted(true);
        alert('💖 Đã thêm vào danh sách yêu thích');
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
