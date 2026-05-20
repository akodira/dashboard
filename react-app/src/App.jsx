import { useState } from 'react'
import { AppProvider }  from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage   from './pages/LoginPage'
import WaiterApp   from './pages/WaiterApp'
import AdminLayout from './pages/admin/AdminLayout'

function Root() {
  const { currentUser } = useAuth()
  const [forceWaiter, setForceWaiter] = useState(false)

  if (!currentUser) return <LoginPage />

  if (currentUser.role === 'admin' && !forceWaiter) {
    return <AdminLayout onSwitchToWaiter={() => setForceWaiter(true)} />
  }

  return (
    <WaiterApp
      onGoToAdmin={currentUser.role === 'admin' ? () => setForceWaiter(false) : null}
    />
  )
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </AppProvider>
  )
}
