import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const correctPassword = 'simtechon@123'

    if (password !== correctPassword) {
      alert('Invalid password. Please use: simtechon@123')
      return
    }

    const emailLower = email.toLowerCase()
    if (emailLower.includes('admin@simtechon.com')) {
      navigate('/dashboard/admin')
    } else if (emailLower.includes('hr@simtechon.com')) {
      navigate('/dashboard/hr')
    } else if (emailLower.includes('ceo@simtechon.com')) {
      navigate('/dashboard/ceo')
    } else if (emailLower.includes('employer@simtechon.com')) {
      navigate('/dashboard/employer')
    } else if (emailLower.includes('employee@simtechon.com')) {
      navigate('/dashboard/employee')
    } else {
      alert('Please use a registered company email.')
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
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
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
