import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function Header({ currentUser, onLogout, onGoToAdmin }) {
  const [time, setTime]  = useState(new Date())
  const { settings }     = useApp()

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = time.toLocaleString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  return (
    <header className="header">
      <div className="header-left">
        {settings.logo
          ? <img src={settings.logo} alt="" className="header-logo" />
          : <span>🍽️</span>
        }
        <div>
          <h1>{settings.cafeName}</h1>
          <p>Waiter: <strong>{currentUser?.name}</strong></p>
        </div>
      </div>
      <div className="header-right">
        <span className="header-time">{fmt}</span>
        {onGoToAdmin && (
          <button className="header-btn" onClick={onGoToAdmin}>⚙️ Admin</button>
        )}
        <button className="header-btn danger" onClick={onLogout}>⏏ Sign Out</button>
      </div>
    </header>
  )
}
