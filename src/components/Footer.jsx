import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} GameHub. All rights reserved.</p>
                <p>Liên hệ: <a href="mailto:support@gamehub.com">support@gamehub.com</a></p>
            </div>
        </footer>
    );
}
