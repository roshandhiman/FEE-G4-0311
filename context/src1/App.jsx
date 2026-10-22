import { useState } from 'react'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('Page 1')
  const [authMode, setAuthMode] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const pages = ['Page 1', 'Page 2', 'Page 3', 'Page 4']

  const handleLogin = () => {
    setIsLoggedIn(true)
    setAuthMode(null)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('Page 1')
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-left">
          <svg className="crown-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 5l4 11h12l4-11-5.5 5.5L12 4l-4.5 6.5L2 5zm3 13h14v2H5v-2z" />
          </svg>
        </div>

        {/* Center pages - only visible after login */}
        <div className="nav-center">
          {isLoggedIn &&
            pages.map((page) => (
              <button
                key={page}
                className={`nav-link ${currentPage === page && !authMode ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(page)
                  setAuthMode(null)
                }}
              >
                {page}
              </button>
            ))}
        </div>

        {/* Right corner - Sign in/Sign up buttons before login, Logout icon after login */}
        <div className="nav-right">
          {!isLoggedIn ? (
            <>
              <button className="btn-signin" onClick={() => setAuthMode('signin')}>
                Sign In
              </button>
              <button className="btn-signup" onClick={() => setAuthMode('signup')}>
                Sign Up
              </button>
            </>
          ) : (
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              <svg
                className="logout-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      <main className="main-content">
        {authMode ? (
          <div className="auth-card">
            <div className="card-header">
              <h2>Enter your details</h2>
              <button className="close-btn" onClick={() => setAuthMode(null)}>
                ✕
              </button>
            </div>

            <button className="btn-submit" onClick={handleLogin}>
              {authMode === 'signin' ? 'Login' : 'Sign Up'}
            </button>
          </div>
        ) : (
          <div className="page-display">
            <h1>{currentPage}</h1>
            <p>Welcome to {currentPage}</p>
          </div>
        )}
      </main>
    </div>
  )
}
