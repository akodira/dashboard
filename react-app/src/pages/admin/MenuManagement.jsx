import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const ICONS = ['🥗', '🍽️', '🍰', '☕', '🥤', '🍷', '🍕', '🍔', '🥩', '🦐', '🥘', '🍜', '🍱', '🧁', '🍹', '🥂', '🌮', '🥪', '🍣', '🫕']

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default function MenuManagement() {
  const { settings, update } = useApp()
  const [menu, setMenu]             = useState(settings.menu)
  const [activeCat, setActiveCat]   = useState(Object.keys(settings.menu)[0] || '')
  const [modal, setModal]           = useState(null)
  const [catForm, setCatForm]       = useState({ name: '', icon: '🍽️' })
  const [itemForm, setItemForm]     = useState({ name: '', price: '' })
  const [editTarget, setEditTarget] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)

  const saveMenu = m => { setMenu(m); update({ menu: m }) }

  // ── Category actions ──────────────────────────────────────────────────────
  const addCategory = e => {
    e.preventDefault()
    const key = `${catForm.icon} ${catForm.name.trim()}`
    if (!catForm.name.trim() || menu[key]) return
    const m = { ...menu, [key]: [] }
    saveMenu(m); setActiveCat(key); setModal(null)
  }

  const renameCategory = e => {
    e.preventDefault()
    const newKey = `${catForm.icon} ${catForm.name.trim()}`
    if (editTarget === newKey) { setModal(null); return }
    const m = Object.fromEntries(
      Object.entries(menu).map(([k, v]) => k === editTarget ? [newKey, v] : [k, v])
    )
    saveMenu(m); setActiveCat(newKey); setModal(null)
  }

  const deleteCategory = cat => {
    const { [cat]: _, ...rest } = menu
    saveMenu(rest)
    setActiveCat(Object.keys(rest)[0] || '')
    setConfirmDel(null)
  }

  // ── Item actions ──────────────────────────────────────────────────────────
  const addItem = e => {
    e.preventDefault()
    const item = { name: itemForm.name.trim(), price: parseFloat(itemForm.price) }
    saveMenu({ ...menu, [activeCat]: [...(menu[activeCat] || []), item] })
    setModal(null)
  }

  const updateItem = e => {
    e.preventDefault()
    const items = menu[activeCat].map((it, i) =>
      i === editTarget ? { name: itemForm.name.trim(), price: parseFloat(itemForm.price) } : it
    )
    saveMenu({ ...menu, [activeCat]: items })
    setModal(null)
  }

  const deleteItem = idx => {
    saveMenu({ ...menu, [activeCat]: menu[activeCat].filter((_, i) => i !== idx) })
    setConfirmDel(null)
  }

  const categories = Object.keys(menu)
  const activeItems = menu[activeCat] || []

  return (
    <div className="admin-section">
      <div className="menu-mgmt">

        {/* Category list */}
        <div className="cat-panel">
          <div className="panel-header">
            <span>Categories ({categories.length})</span>
            <button className="btn-icon-sm" title="Add category"
              onClick={() => { setCatForm({ name: '', icon: '🍽️' }); setModal('addCat') }}>+</button>
          </div>
          <div className="cat-list">
            {categories.map(cat => (
              <div
                key={cat}
                className={`cat-item${cat === activeCat ? ' active' : ''}`}
                onClick={() => setActiveCat(cat)}
              >
                <span className="cat-item-name">{cat}</span>
                <span className="cat-item-count">{(menu[cat] || []).length}</span>
                <div className="cat-item-actions">
                  <button className="btn-icon-xs" onClick={e => {
                    e.stopPropagation()
                    const parts = cat.split(' ')
                    setCatForm({ icon: parts[0], name: parts.slice(1).join(' ') })
                    setEditTarget(cat); setModal('editCat')
                  }}>✏️</button>
                  <button className="btn-icon-xs danger" onClick={e => {
                    e.stopPropagation()
                    setConfirmDel({ type: 'cat', label: cat })
                  }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items list */}
        <div className="items-panel">
          <div className="panel-header">
            <span>{activeCat} — {activeItems.length} item{activeItems.length !== 1 ? 's' : ''}</span>
            <button className="btn-primary sm"
              onClick={() => { setItemForm({ name: '', price: '' }); setModal('addItem') }}
              disabled={!activeCat}
            >+ Add Item</button>
          </div>

          {activeItems.length === 0
            ? <p className="panel-empty">No items. Click "+ Add Item" to add one.</p>
            : (
              <div className="items-list">
                {activeItems.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <span className="item-row-name">{item.name}</span>
                    <span className="item-row-price">{settings.currency}{item.price.toFixed(2)}</span>
                    <button className="btn-icon-xs" onClick={() => {
                      setItemForm({ name: item.name, price: item.price.toString() })
                      setEditTarget(idx); setModal('editItem')
                    }}>✏️</button>
                    <button className="btn-icon-xs danger"
                      onClick={() => setConfirmDel({ type: 'item', label: item.name, value: idx })}>🗑️</button>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* Add / Edit Category */}
      {(modal === 'addCat' || modal === 'editCat') && (
        <Modal
          title={modal === 'addCat' ? 'Add Category' : 'Edit Category'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={modal === 'addCat' ? addCategory : renameCategory} className="modal-form">
            <div className="form-group">
              <label>Category Name *</label>
              <input
                value={catForm.name}
                onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))}
                required placeholder="e.g. Starters"
              />
            </div>
            <div className="form-group">
              <label>Icon</label>
              <div className="icon-picker">
                {ICONS.map(ic => (
                  <button key={ic} type="button"
                    className={`icon-opt${catForm.icon === ic ? ' selected' : ''}`}
                    onClick={() => setCatForm(p => ({ ...p, icon: ic }))}
                  >{ic}</button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn-primary">
                {modal === 'addCat' ? 'Add Category' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add / Edit Item */}
      {(modal === 'addItem' || modal === 'editItem') && (
        <Modal
          title={modal === 'addItem' ? `Add Item to ${activeCat}` : 'Edit Item'}
          onClose={() => setModal(null)}
        >
          <form onSubmit={modal === 'addItem' ? addItem : updateItem} className="modal-form">
            <div className="form-group">
              <label>Item Name *</label>
              <input
                value={itemForm.name}
                onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                required placeholder="e.g. Grilled Chicken"
              />
            </div>
            <div className="form-group">
              <label>Price ({settings.currency}) *</label>
              <input
                type="number" step="0.01" min="0"
                value={itemForm.price}
                onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))}
                required placeholder="0.00"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn-primary">
                {modal === 'addItem' ? 'Add Item' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete */}
      {confirmDel && (
        <Modal title="Confirm Delete" onClose={() => setConfirmDel(null)}>
          <p className="confirm-text">
            {confirmDel.type === 'cat'
              ? <>Delete category <strong>{confirmDel.label}</strong> and all its items? This cannot be undone.</>
              : <>Delete item <strong>{confirmDel.label}</strong>? This cannot be undone.</>
            }
          </p>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setConfirmDel(null)}>Cancel</button>
            <button className="btn-danger" onClick={() => {
              confirmDel.type === 'cat' ? deleteCategory(confirmDel.label) : deleteItem(confirmDel.value)
            }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
