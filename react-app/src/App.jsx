import { useState, useCallback } from 'react'
import { MENU, NUM_TABLES } from './data/menu'
import Sidebar    from './components/Sidebar'
import Header     from './components/Header'
import TableGrid  from './components/TableGrid'
import MenuPanel  from './components/MenuPanel'
import OrderPanel from './components/OrderPanel'

function initOrders() {
  const o = {}
  for (let i = 1; i <= NUM_TABLES; i++) o[i] = []
  return o
}

export default function App() {
  const [orders,          setOrders]          = useState(initOrders)
  const [activeTable,     setActiveTable]     = useState(1)
  const [activeCategory,  setActiveCategory]  = useState(Object.keys(MENU)[0])
  const [vatPct,          setVatPct]          = useState(14)
  const [servicePct,      setServicePct]      = useState(12)

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

  const clearTable = useCallback(() => {
    setOrders(prev => ({ ...prev, [activeTable]: [] }))
  }, [activeTable])

  const tableItemCount = (t) => (orders[t] || []).reduce((s, e) => s + e.qty, 0)

  const computeBill = (t) => {
    const order    = orders[t] || []
    const subtotal = order.reduce((s, e) => s + e.price * e.qty, 0)
    const vat      = subtotal * vatPct    / 100
    const service  = subtotal * servicePct / 100
    return { subtotal, vat, service, total: subtotal + vat + service }
  }

  return (
    <div className="app">
      <Sidebar
        vatPct={vatPct}           setVatPct={setVatPct}
        servicePct={servicePct}   setServicePct={setServicePct}
        orders={orders}
        numTables={NUM_TABLES}
        computeBill={computeBill}
        tableItemCount={tableItemCount}
        activeTable={activeTable}
        setActiveTable={setActiveTable}
      />
      <div className="main-content">
        <Header />
        <div className="content-body">
          <TableGrid
            numTables={NUM_TABLES}
            activeTable={activeTable}
            setActiveTable={setActiveTable}
            tableItemCount={tableItemCount}
          />
          <div className="order-area">
            <MenuPanel
              activeCategory={activeCategory}
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
