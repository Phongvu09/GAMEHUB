import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../GamesPage/GamePage.css";

export default function GamesPage() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            const querySnapshot = await getDocs(collection(db, "games"));
            const gameList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGames(gameList);
        };

        fetchGames();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Xác nhận xoá game này?");
        if (!confirm) return;

        await deleteDoc(doc(db, "games", id));
        setGames((prev) => prev.filter((game) => game.id !== id));
    };

    return (
        <div className="admin-page">
            <h2 className="admin-title">🎮 Danh sách game</h2>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tên game</th>
                            <th>Giá</th>
                            <th>Thể loại</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game.id}>
                                <td>{game.name}</td>
                                <td>{game.price} $</td>
                                <td>{game.genre}</td>
                                <td>
                                    <button onClick={() => handleDelete(game.id)} className="btn-delete">
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {games.length === 0 && (
                            <tr>
                                <td colSpan="4" className="no-data">Không có game nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
