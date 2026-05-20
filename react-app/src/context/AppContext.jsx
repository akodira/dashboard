import { createContext, useContext, useState } from 'react'
import { MENU as DEFAULT_MENU } from '../data/menu'

const SETTINGS_KEY = 'tr_settings'

const DEFAULTS = {
  cafeName:      'Toast & Roast',
  logo:          null,
  numTables:     20,
  vatPct:        14,
  servicePct:    12,
  currency:      '$',
  receiptFooter: 'Thank you for dining at Toast & Roast!',
  address:       '',
  phone:         '',
  taxId:         '',
  menu:          DEFAULT_MENU,
}

const load = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ? { ...fallback, ...v } : fallback
  } catch { return fallback }
}
const persist = (key, val) => localStorage.setItem(key, JSON.stringify(val))

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => load(SETTINGS_KEY, DEFAULTS))

  const update = (patch) => {
    setSettings(prev => {
      const next = { ...prev, ...patch }
      persist(SETTINGS_KEY, next)
      return next
    })
  }

  return (
    <AppContext.Provider value={{ settings, update }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
