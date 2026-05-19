import { useState, useEffect } from 'react'

export default function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = time.toLocaleString('en-GB', {
    weekday: 'short', day: '2-digit', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  return (
    <header className="header">
      <div>
        <h1>🍽️ Toast &amp; Roast</h1>
        <p>Waiter Order Management System</p>
      </div>
      <span className="header-time">{fmt}</span>
    </header>
  )
}
