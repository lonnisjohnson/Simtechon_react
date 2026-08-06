import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { API_BASE } from '../../config.js'
import './CandidateLogin.css'

function CandidateLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/candidate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password.')
        setLoading(false)
        return
      }

      // Store session and redirect
      sessionStorage.setItem('candidate', JSON.stringify(data.candidate))
      navigate('/candidate-dashboard')
    } catch {
      setError('Unable to connect. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cl-root">
      <Link to="/" className="cl-back-top-right">
        <ArrowLeft size={16} />
      </Link>

      {/* Left panel — branding */}
      <div className="cl-left">
        <div className="cl-left-inner">
          <Link to="/" className="cl-brand">
            Simtech<span>ON</span>
          </Link>
          <div className="cl-left-content">
            <h1>Track Your<br /><span>Application</span></h1>
            <p>
              Log in with your registered email and password to view your application
              status, profile, and availability details.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="cl-right">
        <div className="cl-form-card">
          <div className="cl-form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access the portal</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="cl-error">⚠ {error}</div>}

            <div className="cl-form-group">
              <label htmlFor="candidateEmail">Email Address</label>
              <input
                id="candidateEmail"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                autoComplete="email"
              />
            </div>

            <div className="cl-form-group">
              <label htmlFor="candidatePassword">Password</label>
              <div className="cl-password-wrap">
                <input
                  id="candidatePassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="cl-toggle-eye"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="cl-submit-btn" disabled={loading}>
              {loading ? (
                <span className="cl-spinner" />
              ) : (
                <>Sign In <span>→</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CandidateLogin
