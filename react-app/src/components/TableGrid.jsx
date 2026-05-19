export default function TableGrid({ numTables, activeTable, setActiveTable, tableItemCount }) {
  return (
    <section>
      <p className="section-label">🪑 Select Table</p>
      <div className="table-grid">
        {Array.from({ length: numTables }, (_, i) => i + 1).map(t => {
          const count      = tableItemCount(t)
          const isActive   = t === activeTable
          const isOccupied = count > 0
          return (
            <button
              key={t}
              className={`table-btn${isActive ? ' active' : ''}${isOccupied ? ' occupied' : ''}`}
              onClick={() => setActiveTable(t)}
            >
              <span className="t-no">T{t}</span>
              <span className="t-status">{isOccupied ? `${count}` : '—'}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
