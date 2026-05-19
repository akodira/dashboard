import { useState } from 'react'

function buildReceipt(activeTable, order, bill, vatPct, servicePct) {
  const now  = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
  const W    = 40
  const line = '='.repeat(W)
  const dash = '-'.repeat(W)

  const pad  = (str, n) => str.length >= n ? str.slice(0, n) : str + ' '.repeat(n - str.length)
  const rpad = (str, n) => str.length >= n ? str.slice(0, n) : ' '.repeat(n - str.length) + str

  const rows = order.map(e =>
    `  ${pad(e.name, 22)} x${e.qty}  ${rpad('$' + (e.price * e.qty).toFixed(2), 8)}`
  )

  return [
    line,
    '         TOAST & ROAST',
    line,
    `  Table:  ${activeTable}`,
    `  Date:   ${now}`,
    dash,
    `  ${pad('ITEM', 22)} QTY  ${rpad('PRICE', 8)}`,
    dash,
    ...rows,
    dash,
    `  ${pad('Subtotal', 26)} ${rpad('$' + bill.subtotal.toFixed(2), 8)}`,
    `  ${pad('VAT (' + vatPct.toFixed(1) + '%)', 26)} ${rpad('$' + bill.vat.toFixed(2), 8)}`,
    `  ${pad('Service (' + servicePct.toFixed(1) + '%)', 26)} ${rpad('$' + bill.service.toFixed(2), 8)}`,
    line,
    `  ${pad('TOTAL', 26)} ${rpad('$' + bill.total.toFixed(2), 8)}`,
    line,
    '   Thank you for dining at Toast & Roast!',
    line,
  ].join('\n')
}

export default function OrderPanel({
  activeTable, order, onRemoveItem, onClearTable,
  vatPct, servicePct, bill,
}) {
  const [showReceipt, setShowReceipt] = useState(false)
  const hasItems = order.length > 0

  return (
    <div className="order-panel">
      <div className="order-panel-header">
        <h2>Table {activeTable} — Order</h2>
        {hasItems && (
          <button className="clear-btn" onClick={onClearTable}>Clear</button>
        )}
      </div>

      {!hasItems
        ? <p className="empty-order">No items yet. Add from the menu.</p>
        : <>
            <div className="order-items">
              {order.map(entry => (
                <div key={entry.name} className="order-row">
                  <span className="o-name">{entry.name}</span>
                  <span className="o-qty">×{entry.qty}</span>
                  <span className="o-total">${(entry.price * entry.qty).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => onRemoveItem(entry.name)}>−</button>
                </div>
              ))}
            </div>

            <div className="bill">
              <div className="bill-row">
                <span className="b-label">Subtotal</span>
                <span className="b-amount">${bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span className="b-label">VAT ({vatPct.toFixed(1)}%)</span>
                <span className="b-amount">${bill.vat.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span className="b-label">Service ({servicePct.toFixed(1)}%)</span>
                <span className="b-amount">${bill.service.toFixed(2)}</span>
              </div>
              <div className="bill-total">
                <span className="b-label">TOTAL</span>
                <span className="b-amount">${bill.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="receipt-toggle"
              onClick={() => setShowReceipt(v => !v)}
            >
              {showReceipt ? '▲ Hide Receipt' : '🧾 View / Print Receipt'}
            </button>
            {showReceipt && (
              <pre className="receipt-box">
                {buildReceipt(activeTable, order, bill, vatPct, servicePct)}
              </pre>
            )}
          </>
      }
    </div>
  )
}
