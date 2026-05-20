import { useApp } from '../context/AppContext'

export default function Sidebar({
  vatPct, setVatPct, servicePct, setServicePct,
  orders, numTables, computeBill, tableItemCount,
  activeTable, setActiveTable,
}) {
  const { settings } = useApp()

  const occupied   = Array.from({ length: numTables }, (_, i) => i + 1).filter(t => tableItemCount(t) > 0)
  const grandTotal = occupied.reduce((s, t) => s + computeBill(t).total, 0)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        {settings.logo && <img src={settings.logo} alt="" className="sidebar-logo-img" />}
        <h1>{settings.cafeName}</h1>
        <p>Order Management</p>
      </div>

      <div className="sidebar-section">
        <h3>⚙️ Charge Rates</h3>
        <div className="setting-row">
          <label>VAT %</label>
          <input
            className="setting-input" type="number" min="0" max="50" step="0.5"
            value={vatPct} onChange={e => setVatPct(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="setting-row">
          <label>Service Charge %</label>
          <input
            className="setting-input" type="number" min="0" max="30" step="0.5"
            value={servicePct} onChange={e => setServicePct(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="sidebar-section" style={{ flex: 1, overflowY: 'auto' }}>
        <h3>📊 Overview</h3>
        <div className="sidebar-stats">
          <div className="stat-badge">
            <div className="stat-value">{occupied.length}</div>
            <div className="stat-label">Occupied</div>
          </div>
          <div className="stat-badge">
            <div className="stat-value">{settings.currency}{grandTotal.toFixed(0)}</div>
            <div className="stat-label">Revenue</div>
          </div>
        </div>
        {occupied.length === 0
          ? <p className="overview-empty">No active tables</p>
          : occupied.map(t => {
              const { total } = computeBill(t)
              return (
                <div
                  key={t}
                  className={`overview-item${t === activeTable ? ' active' : ''}`}
                  onClick={() => setActiveTable(t)}
                >
                  <span className="overview-item-name">Table {t}</span>
                  <span className="overview-item-total">{settings.currency}{total.toFixed(2)}</span>
                </div>
              )
            })
        }
      </div>
    </aside>
  )
}
