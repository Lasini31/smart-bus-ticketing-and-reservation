import './home.css'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Smart <span className="highlight">Long-Distance</span> Bus</span>
            <br />
            Reservations
          </h1>
          <p className="hero-subtitle">
            Experience seamless island-wide travel. Book your seats instantly,
            manage your journeys, and pay securely using our centralized
            digital prepaid wallet.
          </p>
          <button className="btn-about" onClick={() => navigate('/booking')}>
            About Us
          </button>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="/bus.png"
            alt="Bus illustration"
            className="hero-image"
          />
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-email-label">Email Us</p>
            <p className="footer-email">support@companyb.lk</p>
          </div>
          <div className="footer-right">
            <h2 className="footer-heading">Need Help with Your Journey?</h2>
            <p className="footer-text">
              Our dedicated support team is available 24/7 to assist you. Whether you have
              questions about wallet top-ups, ticket sectioning, or need to submit a refund
              request, we are here to ensure your island-wide travel is seamless.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-links">
            <a href="/booking" onClick={(event) => { event.preventDefault(); navigate('/booking') }}>
              Help
            </a>
            <a href="/booking" onClick={(event) => { event.preventDefault(); navigate('/booking') }}>
              Services
            </a>
            <a href="/wallet" onClick={(event) => { event.preventDefault(); navigate('/wallet') }}>
              Contact Us
            </a>
          </div>
          <p className="footer-copyright">© 2026 Company B. All rights reserved</p>
        </div>
      </footer>
    </div>
  )
}
