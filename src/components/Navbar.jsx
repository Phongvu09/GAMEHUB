import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';
import { auth, db } from '../firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './Navbar.css';

export default function Navbar() {
    const [currentLang, setCurrentLang] = useState('VN');
    const [hoveredLink, setHoveredLink] = useState(null);
    const [username, setUsername] = useState(null);

    const navigate = useNavigate();

    const itemsMenuDropdown = [
        { key: 'EN', label: '🇺🇸 English' },
        { key: 'VN', label: '🇻🇳 Vietnamese' },
    ];

    const handleMenuClick = (e) => {
        setCurrentLang(e.key);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('📌 User onAuthStateChanged:', user);
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data();
                        setUsername(data.username);
                    } else {
                        setUsername(null);
                    }
                } catch (error) {
                    setUsername(null);
                }
            } else {
                setUsername(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };


    const handleLogout = async () => {
        await signOut(auth);
        setUsername(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-top">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <img src="/Neon GameHub Logo Design.png" alt="GameHub Logo" />
                </div>



                <div className="navbar-links-right">
                    {!username ? (
                        <>
                            <Link
                                to="/login"
                                className={`nav-link ${hoveredLink === 'login' ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredLink('login')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className={`nav-link ${hoveredLink === 'register' ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredLink('register')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <span
                                className="nav-user"
                                onClick={() => navigate('/profile')}
                                title="Go to Profile"
                            >
                                👤 {username}
                            </span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </>
                    )}



                    <Dropdown
                        trigger={['click']}
                        menu={{ items: itemsMenuDropdown, onClick: handleMenuClick }}
                    >
                        <button className="lang-btn">
                            {currentLang === 'VN' ? '🇻🇳 Vietnamese' : '🇺🇸 English'}
                        </button>
                    </Dropdown>
                </div>
            </div>

            <div className="navbar-bottom">
                <Link
                    to="/"
                    className={`nav-link ${hoveredLink === 'home' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredLink('home')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Home
                </Link>
                <Link
                    to="/about"
                    className={`nav-link ${hoveredLink === 'about' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredLink('about')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    About
                </Link>
                <Link
                    to="/support"
                    className={`nav-link ${hoveredLink === 'support' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredLink('support')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Support
                </Link>
            </div>
        </nav>
    );
}
