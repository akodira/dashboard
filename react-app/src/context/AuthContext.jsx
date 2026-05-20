import { createContext, useContext, useState } from 'react'

const USERS_KEY   = 'tr_users'
const SESSION_KEY = 'tr_session'

const DEFAULT_USERS = [
  { id: '1', username: 'admin',   password: 'admin123',  name: 'Administrator', role: 'admin',  active: true },
  { id: '2', username: 'waiter1', password: 'waiter123', name: 'John Smith',    role: 'waiter', active: true },
  { id: '3', username: 'waiter2', password: 'waiter456', name: 'Sara Ahmed',    role: 'waiter', active: true },
]

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
const persist = (key, val) => localStorage.setItem(key, JSON.stringify(val))

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [users,       setUsers]       = useState(() => load(USERS_KEY, DEFAULT_USERS))
  const [currentUser, setCurrentUser] = useState(() => load(SESSION_KEY, null))

  const login = (username, password) => {
    const u = users.find(u => u.username === username && u.password === password && u.active)
    if (!u) return false
    const session = { id: u.id, username: u.username, name: u.name, role: u.role }
    setCurrentUser(session)
    persist(SESSION_KEY, session)
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  const addUser = (data) => {
    const u = { ...data, id: Date.now().toString(), active: true }
    const next = [...users, u]
    setUsers(next); persist(USERS_KEY, next)
  }

  const updateUser = (id, data) => {
    const next = users.map(u => u.id === id ? { ...u, ...data } : u)
    setUsers(next); persist(USERS_KEY, next)
    if (currentUser?.id === id) {
      const s = { ...currentUser, ...data }
      setCurrentUser(s); persist(SESSION_KEY, s)
    }
  }

  const deleteUser = (id) => {
    if (id === currentUser?.id) return
    const next = users.filter(u => u.id !== id)
    setUsers(next); persist(USERS_KEY, next)
  }

  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
