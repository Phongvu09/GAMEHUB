import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Header.css';

export default function AdminHeader() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="admin-header">
            <div className="admin-title">ADMIN GAMEHUB</div>
            <div className="admin-icons">
                <button className="icon-button" title="Thông báo">🔔</button>
                <button className="icon-button" title="Tài khoản">
                    {user ? user.displayName || user.email : '👤'}
                </button>
            </div>
        </header>
    );
}
