import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const correctPassword = 'simtechon@123'
    const emailLower = email.toLowerCase()
    const validEmails = [
      'admin@simtechon.com',
      'hr@simtechon.com',
      'ceo@simtechon.com',
      'employer@simtechon.com',
      'employee@simtechon.com',
    ]

    if (password !== correctPassword || !validEmails.includes(emailLower)) {
      setError('Invalid credentials. Please check your email and password.')
      return
    }

    setError('')
    if (emailLower === 'admin@simtechon.com') {
      navigate('/dashboard/admin')
    } else if (emailLower === 'hr@simtechon.com') {
      navigate('/hr-dashboard')
    } else if (emailLower === 'ceo@simtechon.com') {
      navigate('/ceo-dashboard')
    } else if (emailLower === 'employer@simtechon.com') {
      navigate('/dashboard/employer')
    } else if (emailLower === 'employee@simtechon.com') {
      navigate('/dashboard/employee')
    }
  }

  return (
    <div style={{ paddingTop: '100px' }}>
      <section id="login">
        <div className="container">
          <div className="section-header fade-up">
            <h2 className="section-title">Welcome <span className="text-blue">Back</span></h2>
            <p className="section-sub">Log in to manage your portal account and stay connected.</p>
          </div>

          <div className="login-container fade-up">
            <form onSubmit={handleSubmit}>
              <div className="email-wrapper">
                {error && <p className="login-error">⚠ {error}</p>}
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" className="btn-portal-login">
                Log In <span>→</span>
              </button>

            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
