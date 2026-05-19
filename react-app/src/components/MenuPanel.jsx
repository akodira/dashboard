import { MENU, CATEGORY_ICONS } from '../data/menu'

export default function MenuPanel({ activeCategory, setActiveCategory, onAddItem }) {
  const items = MENU[activeCategory] || []

  return (
    <div className="menu-panel">
      <p className="section-label">📋 Menu</p>

      <div className="category-tabs">
        {Object.keys(MENU).map(cat => (
          <button
            key={cat}
            className={`cat-tab${cat === activeCategory ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {items.map(item => (
          <div key={item.name} className="menu-card">
            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-price">${item.price.toFixed(2)}</div>
            </div>
            <button className="add-btn" onClick={() => onAddItem(item)}>+</button>
          </div>
        ))}
      </div>
    </div>
  )
}
