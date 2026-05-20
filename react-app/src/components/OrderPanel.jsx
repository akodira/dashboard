import { useState } from 'react'
import { useApp } from '../context/AppContext'

function buildReceipt(settings, table, order, bill, vatPct, servicePct) {
  const { cafeName, currency, address, phone, taxId, receiptFooter } = settings
  const now  = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const W    = 42
  const L    = '='.repeat(W)
  const D    = '-'.repeat(W)
  const pad  = (s, n) => (s + '').padEnd(n).slice(0, n)
  const rpad = (s, n) => (s + '').padStart(n).slice(-n)

  return [
    L,
    `  ${cafeName}`,
    ...(address ? [`  ${address}`] : []),
    ...(phone   ? [`  Tel: ${phone}`] : []),
    ...(taxId   ? [`  Tax ID: ${taxId}`] : []),
    L,
    `  Table: ${table}        Date: ${now}`,
    D,
    `  ${pad('ITEM', 25)} ${'QTY'.padStart(3)}  ${'PRICE'.padStart(8)}`,
    D,
    ...order.map(e =>
      `  ${pad(e.name, 25)} ${rpad('x' + e.qty, 3)}  ${rpad(currency + (e.price * e.qty).toFixed(2), 8)}`
    ),
    D,
    `  ${pad('Subtotal', 29)} ${rpad(currency + bill.subtotal.toFixed(2), 8)}`,
    `  ${pad(`VAT (${vatPct.toFixed(1)}%)`, 29)} ${rpad(currency + bill.vat.toFixed(2), 8)}`,
    `  ${pad(`Service (${servicePct.toFixed(1)}%)`, 29)} ${rpad(currency + bill.service.toFixed(2), 8)}`,
    L,
    `  ${pad('TOTAL', 29)} ${rpad(currency + bill.total.toFixed(2), 8)}`,
    L,
    `  ${receiptFooter}`,
    L,
  ].join('\n')
}

export default function OrderPanel({ activeTable, order, onRemoveItem, onClearTable, vatPct, servicePct, bill }) {
  const { settings }    = useApp()
  const [showReceipt, setShowReceipt] = useState(false)
  const hasItems = order.length > 0

  return (
    <div className="order-panel">
      <div className="order-panel-header">
        <h2>Table {activeTable} — Order</h2>
        {hasItems && <button className="clear-btn" onClick={onClearTable}>Clear</button>}
      </div>

      {!hasItems
        ? <p className="empty-order">No items yet. Add from the menu.</p>
        : <>
            <div className="order-items">
              {order.map(entry => (
                <div key={entry.name} className="order-row">
                  <span className="o-name">{entry.name}</span>
                  <span className="o-qty">×{entry.qty}</span>
                  <span className="o-total">{settings.currency}{(entry.price * entry.qty).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => onRemoveItem(entry.name)}>−</button>
                </div>
              ))}
            </div>

            <div className="bill">
              <div className="bill-row">
                <span className="b-label">Subtotal</span>
                <span className="b-amount">{settings.currency}{bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span className="b-label">VAT ({vatPct.toFixed(1)}%)</span>
                <span className="b-amount">{settings.currency}{bill.vat.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span className="b-label">Service ({servicePct.toFixed(1)}%)</span>
                <span className="b-amount">{settings.currency}{bill.service.toFixed(2)}</span>
              </div>
              <div className="bill-total">
                <span className="b-label">TOTAL</span>
                <span className="b-amount">{settings.currency}{bill.total.toFixed(2)}</span>
              </div>
            </div>

            <button className="receipt-toggle" onClick={() => setShowReceipt(v => !v)}>
              {showReceipt ? '▲ Hide Receipt' : '🧾 View / Print Receipt'}
            </button>
            {showReceipt && (
              <pre className="receipt-box">
                {buildReceipt(settings, activeTable, order, bill, vatPct, servicePct)}
              </pre>
            )}
          </>
      }
    </div>
  )
}
