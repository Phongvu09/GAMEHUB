import '../AboutPage/AboutPage.css';

export default function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <div className="about-text-section">
                    <h1 className="about-title">Về GameHub</h1>
                    <p className="about-text">
                        GameHub là nền tảng kết nối cộng đồng game thủ Việt, nơi bạn có thể khám phá, tìm hiểu và chia sẻ về những tựa game hot nhất hiện nay.
                        Chúng tôi tổng hợp dữ liệu trực tiếp từ Steam để mang đến thông tin nhanh chóng, chính xác và đa dạng.
                    </p>
                    {/* <p className="about-text">
                        Website được xây dựng bằng ReactJS và Firebase, với giao diện hiện đại, dễ sử dụng, phù hợp với cả game thủ mới và kỳ cựu.
                    </p>
                    <p className="about-text">
                        GameHub không chỉ là nơi theo dõi thông tin game – mà còn là cộng đồng nơi bạn có thể tạo wishlist, chia sẻ đánh giá, và theo dõi xu hướng game toàn cầu.
                    </p>
                    <p className="about-text">
                        Cảm ơn bạn đã ghé thăm GameHub! Nếu có góp ý, hãy liên hệ với chúng tôi qua email:
                        <a href="mailto:gamehub.team@gmail.com" className="about-link">gamehub.team@gmail.com</a>
                    </p> */}
                </div>

                <div className="about-video-section">
                    <video
                        className="about-video"
                        src="https://cdn.fastly.steamstatic.com/store/about/videos/about_hero_loop_web.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                    ></video>
                </div>
            </div>
        </div>
    );
}