// import { Link } from 'react-router-dom';
// import './UnderNavbar.css';
// import { useState, useEffect } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase'

// export default function UnderNavbar() {
//     const [categories, setCategories] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);

//     useEffect(() => {
//         async function fetchCategories() {
//             const docRef = doc(db, "gameLists", "categories");
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 setCategories(Object.keys(docSnap.data()));
//             }
//         }
//         fetchCategories();
//     }, []);

//     return (
//         <nav className="under-navbar">
//             <div className="under-navbar-left">
//                 <Link to="/" className="nav-logo">YourStore</Link>

//                 <div
//                     className="dropdown"
//                     onMouseEnter={() => setShowDropdown(true)}
//                     onMouseLeave={() => setShowDropdown(false)}
//                 >
//                     <span className="nav-link dropdown-toggle">Categories ▾</span>
//                     {showDropdown && (
//                         <div className="dropdown-menu">
//                             {categories.map(cat => (
//                                 <Link
//                                     key={cat}
//                                     to={`/category/${cat}`}
//                                     className="dropdown-item"
//                                 >
//                                     {cat.toUpperCase()}
//                                 </Link>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 <Link to="/wishlist" className="nav-link">Wish List</Link>
//                 <Link to="/cart" className="nav-link">Cart</Link>
//             </div>

//             <div className="navbar-right">
//                 <input
//                     type="text"
//                     className="search-input"
//                     placeholder="Search games..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 {suggestions.length > 0 && (
//                     <ul className="suggestion-list">
//                         {suggestions.map(game => (
//                             <li key={game.id} onClick={() => handleSelect(game)}>
//                                 {game.name}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </nav>
//     );
// }

import { Link, useNavigate } from 'react-router-dom';
import './UnderNavbar.css';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UnderNavbar() {
    const [categories, setCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

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

    useEffect(() => {
        async function fetchSuggestions() {
            if (searchTerm.length === 0) {
                setSuggestions([]);
                return;
            }

            const docRef = doc(db, "gameLists", "allGames");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const allGames = docSnap.data();
                const filtered = Object.values(allGames).filter(game =>
                    game.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
                ).slice(0, 5);
                setSuggestions(filtered);
            }
        }

        fetchSuggestions();
    }, [searchTerm]);

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
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {suggestions.length > 0 && (
                    <ul className="suggestion-list">
                        {suggestions.map(game => (
                            <li key={game.id} onClick={() => handleSelect(game)}>
                                {game.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    );
}

