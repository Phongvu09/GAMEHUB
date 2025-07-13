import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSteamGame } from "../../service/api";
import CategoryCard from "../../components/CategoryCard";
import GameCard from "../../components/GameCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./CategoriesPage.css";

function CategoriesPage() {
    const { categoryName } = useParams();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [remainingTime, setRemainingTime] = useState(10);
    const [gamePage, setGamePage] = useState(0);
    const [suggestedGames, setSuggestedGames] = useState([]);


    const timerRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        async function loadCategoryGames() {
            setLoading(true);
            setError("");
            setHighlightIndex(0);

            try {
                const docRef = doc(db, "gameLists", "categories");
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    setError("Không tìm thấy danh sách thể loại.");
                    setLoading(false);
                    return;
                }

                const categoryField = docSnap.data()[categoryName];

                if (!categoryField || typeof categoryField[0] !== "string") {
                    setError("Không có dữ liệu cho thể loại này.");
                    setLoading(false);
                    return;
                }

                const ids = categoryField[0]
                    .split(",")
                    .map(id => parseInt(id.trim()))
                    .filter(id => !isNaN(id));

                const responses = await Promise.allSettled(
                    ids.map(id =>
                        fetchSteamGame(id).catch(err => {
                            console.error(`❌ fetchSteamGame(${id}) lỗi:`, err.message);
                            return null;
                        })
                    )
                );

                const gameList = responses
                    .map((res, i) => res.status === "fulfilled" && res.value?.header_image
                        ? { ...res.value, id: ids[i] }
                        : null)
                    .filter(Boolean);

                setGames(gameList);
            } catch (err) {
                setError("Đã xảy ra lỗi khi tải dữ liệu.");
                console.error(err);
            }

            setLoading(false);
        }

        loadCategoryGames();
    }, [categoryName]);

    // Auto-switch CategoryCard
    useEffect(() => {
        if (games.length <= 1) return;

        clearInterval(intervalRef.current);
        clearTimeout(timerRef.current);

        if (isPaused) return;

        setRemainingTime(10);

        intervalRef.current = setInterval(() => {
            setRemainingTime(prev => {
                if (prev === 1) clearInterval(intervalRef.current);
                return prev - 1;
            });
        }, 1000);

        timerRef.current = setTimeout(() => {
            setHighlightIndex(prev => (prev + 1) % games.length);
        }, 10000);

        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(timerRef.current);
        };
    }, [highlightIndex, isPaused, games]);

    useEffect(() => {
        async function loadSuggestedGames() {
            const suggestedIds = [
                292030, 1174180, 1091500, 413150, 271590, 1145360, 236390,
                550, 1222670, 1222140, 582160, 812140, 379720, 203160,
                638970, 945360, 359550, 208650, 359870, 582010
            ];

            const responses = await Promise.allSettled(
                suggestedIds.map(fetchSteamGame)
            );

            const result = responses
                .filter(r => r.status === "fulfilled" && r.value?.header_image)
                .map((r, i) => ({ ...r.value, id: suggestedIds[i] }))
                .sort(() => Math.random() - 0.5)
                .slice(0, 3); // Lấy ngẫu nhiên 3 game

            setSuggestedGames(result);
        }

        loadSuggestedGames();
    }, []);


    const handleHighlightChange = (direction) => {
        setHighlightIndex(prev => {
            const total = games.length;
            let newIndex = prev + direction;
            if (newIndex < 0) newIndex = total - 1;
            if (newIndex >= total) newIndex = 0;
            return newIndex;
        });
    };

    const handleGamePageChange = (direction) => {
        const totalPages = Math.ceil((games.length - 1) / 2);
        setGamePage(prev => {
            let newPage = prev + direction;
            if (newPage < 0) newPage = totalPages - 1;
            if (newPage >= totalPages) newPage = 0;
            return newPage;
        });
    };

    const paginatedGames = games.filter((_, i) => i !== highlightIndex);
    const gamePerPage = 3;
    const totalPages = Math.ceil(paginatedGames.length / gamePerPage);
    const currentGames = paginatedGames.slice(gamePage * gamePerPage, gamePage * gamePerPage + gamePerPage);

    return (
        <div className="category-page">
            <h1 className="category-title">{categoryName.toUpperCase()}</h1>

            {loading && <p className="loading-text">Đang tải game...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && games.length > 0 && (
                <>
                    {/* CategoryCard Carousel */}
                    <div className="highlight-section">
                        <button className="nav-btn left" onClick={() => handleHighlightChange(-1)}>
                            <div className="arrow left-arrow"></div>
                        </button>

                        <div
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <CategoryCard game={games[highlightIndex]} />
                            <div className="category-indicator-wrapper">
                                <div className="category-dot-indicator">
                                    {games.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`dot ${index === highlightIndex ? 'active' : ''}`}
                                        ></span>
                                    ))}
                                </div>
                                <div className="timer-text">
                                    {isPaused
                                        ? '⏸ Paused while mouse is hovering'
                                        : `⏳ Chuyển trong ${remainingTime}s`}
                                </div>
                            </div>
                        </div>

                        <button className="nav-btn right" onClick={() => handleHighlightChange(1)}>
                            <div className="arrow right-arrow"></div>
                        </button>
                    </div>

                    {/* GameCard - chỉ 2 thẻ mỗi lần */}
                    <div className="highlight-section">
                        <button className="nav-btn left" onClick={() => handleGamePageChange(-1)}>
                            <div className="arrow left-arrow"></div>
                        </button>

                        <div className="game-list-single-line">
                            {currentGames.map(game => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>

                        <button className="nav-btn right" onClick={() => handleGamePageChange(1)}>
                            <div className="arrow right-arrow"></div>
                        </button>
                    </div>

                    <div className="category-dot-indicator">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <span
                                key={i}
                                className={`dot ${i === gamePage ? 'active' : ''}`}
                                onClick={() => setGamePage(i)}
                            ></span>
                        ))}
                    </div>

                    {suggestedGames.length > 0 && (
                        <div className="section" style={{ marginTop: "40px" }}>
                            <h3>Đề xuất bạn có thể thích</h3>
                            <div className="screenshots">
                                {suggestedGames.map(game => (
                                    <GameCard key={game.id} game={game} />
                                ))}
                            </div>
                        </div>
                    )}

                </>
            )}
        </div>
    );
}

export default CategoriesPage;
