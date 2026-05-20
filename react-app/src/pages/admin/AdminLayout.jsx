import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp }  from '../../context/AppContext'
import AdminDashboard from './AdminDashboard'
import UserManagement from './UserManagement'
import CafeSettings   from './CafeSettings'
import MenuManagement from './MenuManagement'

const NAV = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard'     },
  { key: 'users',     icon: '👥', label: 'Users'         },
  { key: 'settings',  icon: '⚙️',  label: 'Cafe Settings' },
  { key: 'menu',      icon: '🍽️', label: 'Menu'          },
]

export default function AdminLayout({ onSwitchToWaiter }) {
  const [section, setSection]       = useState('dashboard')
  const { currentUser, logout }     = useAuth()
  const { settings }                = useApp()

  const SECTIONS = {
    dashboard: <AdminDashboard onGoTo={setSection} />,
    users:     <UserManagement />,
    settings:  <CafeSettings />,
    menu:      <MenuManagement />,
  }

  const active = NAV.find(n => n.key === section)

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          {settings.logo
            ? <img src={settings.logo} alt="" className="admin-logo-img" />
            : <span className="admin-logo-icon">🍽️</span>
          }
          <div>
            <div className="admin-logo-name">{settings.cafeName}</div>
            <div className="admin-logo-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map(item => (
            <button
              key={item.key}
              className={`admin-nav-item${section === item.key ? ' active' : ''}`}
              onClick={() => setSection(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item switch-view" onClick={onSwitchToWaiter}>
            <span className="nav-icon">🪑</span>
            <span>Order View</span>
          </button>
          <div className="admin-user-row">
            <div className="admin-user-info">
              <span className="au-name">{currentUser?.name}</span>
              <span className="au-role">Administrator</span>
            </div>
            <button className="au-logout-btn" onClick={logout} title="Sign Out">⏏</button>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h2 className="admin-page-title">{active?.icon} {active?.label}</h2>
        </div>
        <div className="admin-content">
          {SECTIONS[section]}
        </div>
      </main>
    </div>
  )
}
