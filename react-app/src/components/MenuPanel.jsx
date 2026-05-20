import { useApp } from '../context/AppContext'

export default function MenuPanel({ activeCategory, setActiveCategory, onAddItem }) {
  const { settings } = useApp()
  const menu  = settings.menu
  const items = menu[activeCategory] || []

  return (
    <div className="menu-panel">
      <p className="section-label">📋 Menu</p>

      <div className="category-tabs">
        {Object.keys(menu).map(cat => (
          <button
            key={cat}
            className={`cat-tab${cat === activeCategory ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {items.map(item => (
          <div key={item.name} className="menu-card">
            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-price">{settings.currency}{item.price.toFixed(2)}</div>
            </div>
            <button className="add-btn" onClick={() => onAddItem(item)}>+</button>
          </div>
        ))}
      </div>
    </div>
  )
}
