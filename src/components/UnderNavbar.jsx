import { Link, useNavigate } from 'react-router-dom';
import './UnderNavbar.css';
import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UnderNavbar() {
    const [categories, setCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [allGames, setAllGames] = useState([]);
    const navigate = useNavigate();
    const debounceRef = useRef(null);

    // Lấy danh sách thể loại
    useEffect(() => {
        async function fetchCategories() {
            const docRef = doc(db, "gameLists", "categories");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCategories(Object.keys(docSnap.data()));
            }
        }
        fetchCategories();
    }, []);

    // Hàm fetch từng game từ Steam
    async function fetchGameName(appid) {
        try {
            const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
            const data = await res.json();
            if (data[appid]?.success) {
                return {
                    id: appid,
                    name: data[appid].data.name,
                    header_image: data[appid].data.header_image
                };
            }
        } catch (e) {
            console.error(`Lỗi khi fetch app ${appid}`, e);
        }
        return null;
    }

    // Chỉ fetch 1 lần rồi cache vào localStorage
    useEffect(() => {
        async function fetchAllGames() {
            const cached = localStorage.getItem("cachedGames");
            if (cached) {
                setAllGames(JSON.parse(cached));
                return;
            }

            const docRef = doc(db, "gameLists", "categories");
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) return;

            console.log("✅ Firestore categories data:", docSnap.data());  // ✅ dòng này giúp kiểm tra


            const categories = docSnap.data();
            let appIds = [];

            Object.values(categories).forEach(arr => {
                if (Array.isArray(arr) && arr.length > 0) {
                    const ids = arr[0].split(',').map(id => id.trim());
                    appIds = appIds.concat(ids);
                }
            });

            const limitedIds = appIds.slice(0, 50); // lấy tối đa 50 để nhẹ
            const results = await Promise.all(limitedIds.map(id => fetchGameName(id)));
            const cleanResults = results.filter(Boolean);

            setAllGames(cleanResults);
            localStorage.setItem("cachedGames", JSON.stringify(cleanResults));
        }

        fetchAllGames();
    }, []);

    // Debounce gợi ý search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (searchTerm.length === 0) {
                setSuggestions([]);
                return;
            }

            const filtered = allGames.filter(game =>
                game.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 5);

            setSuggestions(filtered);
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [searchTerm, allGames]);

    const handleSelect = (game) => {
        setSearchTerm('');
        setSuggestions([]);
        navigate(`/game/${game.id}`);
    };

    return (
        <nav className="under-navbar">
            <div className="under-navbar-left">
                <Link to="/" className="nav-logo">YourStore</Link>

                <div
                    className="dropdown"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <span className="nav-link dropdown-toggle">Categories ▾</span>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            {categories.map(cat => (
                                <Link
                                    key={cat}
                                    to={`/category/${cat}`}
                                    className="dropdown-item"
                                >
                                    {cat.toUpperCase()}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <Link to="/wishlist" className="nav-link">Wish List</Link>
                <Link to="/cart" className="nav-link">Cart</Link>
            </div>

            <div className="navbar-right">
                <div className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {suggestions.length > 0 && (
                    <ul className="suggestion-list">
                        {suggestions.map(game => (
                            <li key={game.id} onClick={() => handleSelect(game)} className="suggestion-item">
                                <img src={game.header_image} alt={game.name} className="suggestion-img" />
                                <span className="suggestion-name">{game.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}
