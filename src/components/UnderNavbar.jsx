import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'

export default function UnderNavbar() {
    const Navbar = () => {
        return (
            <nav className="navbar">
                <div className="navbar-left">
                    <a href="/" className="nav-logo">GameHobby</a>
                    <a href="/" className="nav-link">Home</a>
                    <a href="/categories" className="nav-link">Categories</a>
                    <a href="/cart" className="nav-link">Cart</a>
                </div>
                <div className="navbar-right">
                    <input type="text" className="search-input" placeholder="Search games..." />
                </div>
            </nav>
        );
    };
}