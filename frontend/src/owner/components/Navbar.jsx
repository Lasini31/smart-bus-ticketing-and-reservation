import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div className="brand">
        <img className="brand-mark" src="/STAR.png" alt="STAR" />
        <div className="brand-copy">
          <span>Smart Bus Ticketing</span>
          <strong>Owner Home</strong>
        </div>
      </div>

      <nav className="topnav" aria-label="Primary navigation">
        <a href="#analytics">Home</a>
        <a href="#buses">Find Bus</a>
        <a href="#drivers">Wallet</a>
        <button type="button" className="book-now-btn">Book Now</button>
        {user ? (
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <a href="/login">Login</a>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
