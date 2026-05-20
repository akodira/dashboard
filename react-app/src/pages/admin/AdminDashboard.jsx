import { useAuth } from '../../context/AuthContext'
import { useApp }  from '../../context/AppContext'

function StatCard({ icon, value, label, color }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-icon" style={{ color }}>{icon}</div>
      <div className="dash-stat-value">{value}</div>
      <div className="dash-stat-label">{label}</div>
    </div>
  )
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button className="qa-btn" onClick={onClick}>
      <span className="qa-icon">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default function AdminDashboard({ onGoTo }) {
  const { users }    = useAuth()
  const { settings } = useApp()

  const waiters    = users.filter(u => u.role === 'waiter' && u.active).length
  const admins     = users.filter(u => u.role === 'admin'  && u.active).length
  const menuItems  = Object.values(settings.menu).reduce((s, items) => s + items.length, 0)
  const categories = Object.keys(settings.menu).length

  const info = [
    { label: 'Cafe Name',         value: settings.cafeName },
    { label: 'Tables',            value: settings.numTables },
    { label: 'VAT',               value: `${settings.vatPct}%` },
    { label: 'Service Charge',    value: `${settings.servicePct}%` },
    { label: 'Currency',          value: settings.currency },
    { label: 'Menu Categories',   value: categories },
    { label: 'Total Menu Items',  value: menuItems },
    { label: 'Active Waiters',    value: waiters },
  ]

  return (
    <div className="admin-dashboard">
      <div className="dash-stats-grid">
        <StatCard icon="🪑" value={settings.numTables} label="Tables"         color="#e8c068" />
        <StatCard icon="👨‍🍳" value={waiters}           label="Active Waiters" color="#60a5fa" />
        <StatCard icon="🍽️" value={menuItems}          label="Menu Items"      color="#34d399" />
        <StatCard icon="📂" value={categories}         label="Categories"      color="#f472b6" />
        <StatCard icon="👑" value={admins}             label="Admins"          color="#fb923c" />
        <StatCard icon="👥" value={users.length}       label="Total Users"     color="#a78bfa" />
      </div>

      <div className="dash-section">
        <h3 className="dash-section-title">Quick Actions</h3>
        <div className="qa-grid">
          <QuickAction icon="👤" label="Add Waiter"    onClick={() => onGoTo('users')}    />
          <QuickAction icon="⚙️" label="Edit Cafe Info" onClick={() => onGoTo('settings')} />
          <QuickAction icon="🍽️" label="Edit Menu"     onClick={() => onGoTo('menu')}     />
          <QuickAction icon="👥" label="Manage Users"  onClick={() => onGoTo('users')}    />
        </div>
      </div>

      <div className="dash-section">
        <h3 className="dash-section-title">Current Configuration</h3>
        <div className="info-grid">
          {info.map(({ label, value }) => (
            <div key={label} className="info-item">
              <span className="info-label">{label}</span>
              <strong className="info-value">{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
