import { useState, useCallback, useEffect } from 'react'
import { useApp }  from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import Header     from '../components/Header'
import Sidebar    from '../components/Sidebar'
import TableGrid  from '../components/TableGrid'
import MenuPanel  from '../components/MenuPanel'
import OrderPanel from '../components/OrderPanel'

function initOrders(n) {
  const o = {}
  for (let i = 1; i <= n; i++) o[i] = []
  return o
}

export default function WaiterApp({ onGoToAdmin }) {
  const { settings }           = useApp()
  const { currentUser, logout } = useAuth()

  const [orders,         setOrders]         = useState(() => initOrders(settings.numTables))
  const [activeTable,    setActiveTable]     = useState(1)
  const [activeCategory, setActiveCategory] = useState(() => Object.keys(settings.menu)[0] || '')
  const [vatPct,         setVatPct]         = useState(settings.vatPct)
  const [servicePct,     setServicePct]     = useState(settings.servicePct)

  // Sync defaults when settings change
  useEffect(() => { setVatPct(settings.vatPct)     }, [settings.vatPct])
  useEffect(() => { setServicePct(settings.servicePct) }, [settings.servicePct])

  // Keep activeCategory valid when menu changes
  const menuKeys = Object.keys(settings.menu)
  const safeCategory = settings.menu[activeCategory] ? activeCategory : (menuKeys[0] || '')

  const addItem = useCallback((item) => {
    setOrders(prev => {
      const list = [...(prev[activeTable] || [])]
      const idx  = list.findIndex(e => e.name === item.name)
      if (idx >= 0) list[idx] = { ...list[idx], qty: list[idx].qty + 1 }
      else          list.push({ ...item, qty: 1 })
      return { ...prev, [activeTable]: list }
    })
  }, [activeTable])

  const removeItem = useCallback((itemName) => {
    setOrders(prev => {
      const list = [...(prev[activeTable] || [])]
      const idx  = list.findIndex(e => e.name === itemName)
      if (idx < 0) return prev
      if (list[idx].qty > 1) list[idx] = { ...list[idx], qty: list[idx].qty - 1 }
      else                   list.splice(idx, 1)
      return { ...prev, [activeTable]: list }
    })
  }, [activeTable])

  const clearTable = useCallback(() =>
    setOrders(prev => ({ ...prev, [activeTable]: [] }))
  , [activeTable])

  const tableItemCount = t => (orders[t] || []).reduce((s, e) => s + e.qty, 0)

  const computeBill = t => {
    const order    = orders[t] || []
    const subtotal = order.reduce((s, e) => s + e.price * e.qty, 0)
    const vat      = subtotal * vatPct     / 100
    const service  = subtotal * servicePct / 100
    return { subtotal, vat, service, total: subtotal + vat + service }
  }

  return (
    <div className="app">
      <Sidebar
        vatPct={vatPct}         setVatPct={setVatPct}
        servicePct={servicePct} setServicePct={setServicePct}
        orders={orders}
        numTables={settings.numTables}
        computeBill={computeBill}
        tableItemCount={tableItemCount}
        activeTable={activeTable}
        setActiveTable={setActiveTable}
      />
      <div className="main-content">
        <Header
          currentUser={currentUser}
          onLogout={logout}
          onGoToAdmin={onGoToAdmin}
        />
        <div className="content-body">
          <TableGrid
            numTables={settings.numTables}
            activeTable={activeTable}
            setActiveTable={setActiveTable}
            tableItemCount={tableItemCount}
          />
          <div className="order-area">
            <MenuPanel
              activeCategory={safeCategory}
              setActiveCategory={setActiveCategory}
              onAddItem={addItem}
            />
            <OrderPanel
              activeTable={activeTable}
              order={orders[activeTable] || []}
              onRemoveItem={removeItem}
              onClearTable={clearTable}
              vatPct={vatPct}
              servicePct={servicePct}
              bill={computeBill(activeTable)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
