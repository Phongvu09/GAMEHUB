import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { useState } from 'react';

export default function AdminSidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const links = [
        { to: '/admin/dashboard', label: 'Tổng quan' },
        { to: '/admin/games', label: 'Quản lý game' },
        { to: '/admin/users', label: 'Quản lý người dùng' },
        { to: '/admin/revenue', label: 'Doanh thu' },
        { to: '/admin/orders', label: 'Đơn hàng' },
        { to: '/admin/support-feedbacks', label: 'Hỗ trợ' },
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`admin-sidebar ${isOpen ? '' : 'collapsed'}`}>
            <div className="admin-sidebar-header">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    ☰
                </button>
                {isOpen && <div className="admin-sidebar-title">Bảng Điều Khiển</div>}
            </div>
            {isOpen && (
                <ul className="admin-nav-list">
                    {links.map(link => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className={location.pathname === link.to ? 'active-link' : ''}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
