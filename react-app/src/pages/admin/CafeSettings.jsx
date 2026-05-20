import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'

export default function CafeSettings() {
  const { settings, update } = useApp()
  const [form,  setForm]     = useState({ ...settings })
  const [saved, setSaved]    = useState(false)
  const fileRef              = useRef()

  const field = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const num   = e => setForm(p => ({ ...p, [e.target.name]: parseFloat(e.target.value) || 0 }))

  const handleLogo = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(p => ({ ...p, logo: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setForm(p => ({ ...p, logo: null }))
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = e => {
    e.preventDefault()
    update(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="admin-section">
      <form onSubmit={handleSave} className="settings-form">

        {/* Identity */}
        <div className="settings-card">
          <h3 className="settings-card-title">🏷️ Identity</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Cafe / Restaurant Name *</label>
              <input name="cafeName" value={form.cafeName} onChange={field} required />
            </div>
            <div className="form-group" style={{ maxWidth: 120 }}>
              <label>Currency Symbol</label>
              <input name="currency" value={form.currency} onChange={field} maxLength={4} />
            </div>
          </div>
          <div className="form-group">
            <label>Logo</label>
            <div className="logo-row">
              {form.logo && <img src={form.logo} alt="logo" className="logo-preview" />}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
              <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>
                {form.logo ? '🔄 Change Logo' : '📷 Upload Logo'}
              </button>
              {form.logo && (
                <button type="button" className="btn-danger-sm" onClick={removeLogo}>Remove</button>
              )}
            </div>
          </div>
        </div>

        {/* Tables & Charges */}
        <div className="settings-card">
          <h3 className="settings-card-title">🪑 Tables &amp; Charges</h3>
          <div className="form-row three-col">
            <div className="form-group">
              <label>Number of Tables</label>
              <input type="number" name="numTables" value={form.numTables} onChange={num} min="1" max="200" />
            </div>
            <div className="form-group">
              <label>VAT %</label>
              <input type="number" name="vatPct" value={form.vatPct} onChange={num} min="0" max="50" step="0.5" />
            </div>
            <div className="form-group">
              <label>Service Charge %</label>
              <input type="number" name="servicePct" value={form.servicePct} onChange={num} min="0" max="30" step="0.5" />
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="settings-card">
          <h3 className="settings-card-title">🏢 Business Info <span className="card-sub">(printed on receipts)</span></h3>
          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input name="address" value={form.address} onChange={field} placeholder="123 Main St, City" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={field} placeholder="+1 234 567 8900" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tax / VAT Registration No.</label>
              <input name="taxId" value={form.taxId} onChange={field} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label>Receipt Footer Message</label>
              <input name="receiptFooter" value={form.receiptFooter} onChange={field} />
            </div>
          </div>
        </div>

        <div className="settings-actions">
          {saved && <span className="save-success">✓ Settings saved!</span>}
          <button type="submit" className="btn-primary lg">💾 Save Settings</button>
        </div>
      </form>
    </div>
  )
}
