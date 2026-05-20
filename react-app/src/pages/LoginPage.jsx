import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp }  from '../context/AppContext'

export default function LoginPage() {
  const { login }    = useAuth()
  const { settings } = useApp()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => {
    e.preventDefault()
    setLoading(true); setError('')
    setTimeout(() => {
      const ok = login(form.username, form.password)
      if (!ok) setError('Invalid username or password.')
      setLoading(false)
    }, 380)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {settings.logo
          ? <img src={settings.logo} alt="logo" className="login-logo-img" />
          : <div className="login-icon">🍽️</div>
        }
        <h1 className="login-title">{settings.cafeName}</h1>
        <p className="login-sub">Order Management System</p>

        <form onSubmit={handle} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text" placeholder="Enter username"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              autoFocus required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" placeholder="Enter password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="login-hint">Default admin: <code>admin</code> / <code>admin123</code></p>
      </div>
    </div>
  )
}
