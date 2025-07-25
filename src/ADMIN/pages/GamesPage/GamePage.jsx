import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { fetchSteamGame } from '../../../service/api';
import './GamePage.css';

export default function GamePage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGames = async () => {
            setLoading(true);
            setError(null);

            try {
                const docRef = doc(db, 'gameLists', 'categories');
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    throw new Error('Không tìm thấy document categories trong gameLists');
                }

                const all = docSnap.data()?.all;

                if (!Array.isArray(all) || all.length === 0) {
                    throw new Error('Field "all" không hợp lệ hoặc rỗng');
                }

                const ids = all
                    .map(id => typeof id === 'string' ? parseInt(id.trim()) : id)
                    .filter(id => typeof id === 'number' && !isNaN(id));

                if (ids.length === 0) {
                    throw new Error('Không có ID hợp lệ để tải game');
                }

                const responses = await Promise.allSettled(ids.map(fetchSteamGame));

                const gamesData = responses.map((res, idx) => {
                    if (res.status === 'fulfilled' && res.value?.name) {
                        return {
                            id: ids[idx],
                            name: res.value.name,
                            price: res.value.price_overview?.final_formatted || 'Miễn phí',
                            genre: res.value.genres?.map(g => g.description).join(', ') || 'Không rõ',
                        };
                    } else {
                        console.warn(`⚠️ Lỗi khi fetch game ID ${ids[idx]}`, res.reason);
                        return null;
                    }
                }).filter(Boolean);

                setGames(gamesData);
            } catch (err) {
                console.error('❌ Lỗi khi tải game:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadGames();
    }, []);

    return (
        <div className="admin-page">
            <h2 className="admin-title">Danh sách tất cả game</h2>

            {loading && <p>⏳ Đang tải game...</p>}
            {error && <p className="error-msg">❌ {error}</p>}

            {!loading && !error && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Tên game</th>
                                <th>Giá</th>
                                <th>Thể loại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.length > 0 ? (
                                games.map(game => (
                                    <tr key={game.id}>
                                        <td>{game.name}</td>
                                        <td>{game.price}</td>
                                        <td>{game.genre}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-data">Không có game nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
