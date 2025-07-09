import { useEffect, useState } from 'react';
import { fetchSteamGame } from '../../service/api.js';
import GameCard from '../../components/GameCard.jsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import './HomePage.css';

const titles = {
    best: 'Game hay nên chơi',
    cheap: 'Game rẻ dưới 15$',
    Hot: 'Game bán chạy',
    New: 'Game nổi gần đây'
};


const fetchAPIgames = async (categoriesName = ["best", "cheap", "Hot", "New"]) => {
    const docRef = doc(db, "gameLists", "categories");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.log("❌ Không tìm thấy document `categories`");
        return {};
    }

    const data = docSnap.data();
    const result = {};

    for (const category of categoriesName) {
        const field = data[category];

        if (!field || typeof field[0] !== "string") {
            console.warn(`⚠️ Field ${category} không tồn tại hoặc không đúng định dạng`, field);
            continue;
        }

        const ids = field[0]
            .split(",")
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        const limitIDs = ids.slice(0, 9)

        result[category] = {
            title: titles[category] || category,
            ids: limitIDs
        };
    }

    console.log("✅ fetchAPIgames() result:", result);
    return result;
};



function HomePages() {

    console.log("🏁 HomePages mounted");

    const [sections, setSections] = useState({});
    const gamepage = 3

    useEffect(() => {
        async function loadGames() {
            const apiGames = await fetchAPIgames(); // 🔁 Dữ liệu động từ Firestore
            const result = {};

            for (const key in apiGames) {
                const { title, ids } = apiGames[key];
                const games = [];

                const responses = await Promise.allSettled(
                    ids.map(id =>
                        fetchSteamGame(id).catch(err => {
                            console.error(`❌ fetchSteamGame(${id}) lỗi:`, err.message || err);
                            return null;
                        })
                    )
                );

                if (!Array.isArray(responses)) {
                    console.error(`❌ responses không phải mảng:`, responses);
                    continue; // hoặc return
                }

                responses.forEach((res, i) => {
                    if (res.status === 'fulfilled' && res.value?.header_image) {
                        games.push({ ...res.value, id: ids[i] });
                    }
                });

                result[key] = {
                    title,
                    data: games,
                    page: 0
                };
            }

            setSections(result);
        }

        loadGames();
    }, []);

    const handlePageChange = (key, direction) => {
        setSections(prev => {
            const section = prev[key];
            const totalPages = Math.ceil(section.data.length / gamepage);
            let newPage = section.page + direction;

            if (newPage < 0) newPage = totalPages - 1;
            if (newPage >= totalPages) newPage = 0;

            return {
                ...prev,
                [key]: { ...section, page: newPage }
            };
        });
    };

    return (
        <div className="home-page">
            {Object.entries(sections).map(([key, section]) => {
                const start = section.page * gamepage;
                const games = section.data.slice(start, start + gamepage);
                const totalPages = Math.ceil(section.data.length / gamepage);

                return (
                    <section key={key} className="game-section-wrapper">
                        <h2 className="section-title">{section.title}</h2>

                        <div className="carousel-container">
                            <button className="nav-btn left" onClick={() => handlePageChange(key, -1)}>
                                <div className="arrow left-arrow"></div>
                            </button>

                            <div className="game-list">
                                {games.map(game => (
                                    <GameCard key={game.id} game={game} />
                                ))}
                            </div>

                            <button className="nav-btn right" onClick={() => handlePageChange(key, 1)}>
                                <div className="arrow right-arrow"></div>
                            </button>
                        </div>

                        <div className="dot-indicators">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <span key={i} className={`dot ${i === section.page ? 'active' : ''}`}></span>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

export default HomePages;
