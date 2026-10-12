import { useState } from 'react'
import './App.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('Page 1')
  const [authMode, setAuthMode] = useState(null)

  const pages = ['Page 1', 'Page 2', 'Page 3', 'Page 4']

  const handlePageClick = (page) => {
    setCurrentPage(page)
    setAuthMode(null)
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-left">
          <svg className="crown-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 5l4 11h12l4-11-5.5 5.5L12 4l-4.5 6.5L2 5zm3 13h14v2H5v-2z" />
          </svg>
        </div>

        <div className="nav-center">
          {pages.map((page) => (
            <button
              key={page}
              className={`nav-link ${currentPage === page && !authMode ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <button className="btn-signin" onClick={() => setAuthMode('signin')}>
            Sign In
          </button>
          <button className="btn-signup" onClick={() => setAuthMode('signup')}>
            Sign Up
          </button>
        </div>
      </nav>

      <main className="main-content">
        {authMode ? (
          <div className="auth-card">
            <div className="card-header">
              <h2>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
              <button className="close-btn" onClick={() => setAuthMode(null)}>
                ✕
              </button>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Enter your name" />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter your password" />
              </div>

              <button type="submit" className="btn-submit">
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

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
