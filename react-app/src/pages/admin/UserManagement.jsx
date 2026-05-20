import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const EMPTY_FORM = { username: '', password: '', name: '', role: 'waiter' }

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

export default function UserManagement() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useAuth()
  const [modal,       setModal]       = useState(null)   // 'add' | 'edit'
  const [editTarget,  setEditTarget]  = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [confirmDel,  setConfirmDel]  = useState(null)
  const [search,      setSearch]      = useState('')

  const field = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = u => {
    setEditTarget(u)
    setForm({ username: u.username, password: '', name: u.name, role: u.role })
    setModal('edit')
  }
  const closeModal = () => { setModal(null); setEditTarget(null) }

  const handleAdd = e => {
    e.preventDefault()
    addUser({ username: form.username, password: form.password, name: form.name, role: form.role })
    closeModal()
  }

  const handleEdit = e => {
    e.preventDefault()
    const patch = { name: form.name, role: form.role, username: form.username }
    if (form.password) patch.password = form.password
    updateUser(editTarget.id, patch)
    closeModal()
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-section">
      <div className="section-toolbar">
        <input
          className="search-input"
          placeholder="Search users…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn-primary" onClick={openAdd}>+ Add User</button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className={!u.active ? 'row-inactive' : ''}>
                <td>
                  <span className="user-name-cell">{u.name}</span>
                  {u.id === currentUser?.id && <span className="badge you">You</span>}
                </td>
                <td><code className="code-chip">{u.username}</code></td>
                <td><span className={`badge role-${u.role}`}>{u.role}</span></td>
                <td>
                  <span className={`badge status-${u.active ? 'active' : 'inactive'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="action-cell">
                  <button className="btn-icon" title="Edit" onClick={() => openEdit(u)}>✏️</button>
                  <button
                    className="btn-icon"
                    title={u.active ? 'Deactivate' : 'Activate'}
                    onClick={() => updateUser(u.id, { active: !u.active })}
                  >{u.active ? '🔒' : '🔓'}</button>
                  {u.id !== currentUser?.id && (
                    <button className="btn-icon danger" title="Delete" onClick={() => setConfirmDel(u)}>🗑️</button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="table-empty">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          title={modal === 'add' ? 'Add New User' : `Edit — ${editTarget?.name}`}
          onClose={closeModal}
        >
          <form onSubmit={modal === 'add' ? handleAdd : handleEdit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={field} required placeholder="e.g. John Smith" />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={form.role} onChange={field}>
                  <option value="waiter">Waiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input name="username" value={form.username} onChange={field} required placeholder="e.g. john123" />
              </div>
              <div className="form-group">
                <label>{modal === 'edit' ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input
                  name="password" type="password" value={form.password} onChange={field}
                  required={modal === 'add'}
                  placeholder={modal === 'edit' ? 'Leave blank to keep current' : 'Min 6 characters'}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn-primary">
                {modal === 'add' ? 'Add User' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete */}
      {confirmDel && (
        <Modal title="Delete User" onClose={() => setConfirmDel(null)}>
          <p className="confirm-text">
            Are you sure you want to delete <strong>{confirmDel.name}</strong>?
            This cannot be undone.
          </p>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={() => setConfirmDel(null)}>Cancel</button>
            <button className="btn-danger" onClick={() => { deleteUser(confirmDel.id); setConfirmDel(null) }}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
