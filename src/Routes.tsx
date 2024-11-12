import { Route, Routes } from 'react-router-dom'

import { Home } from './pages/Home'
import { Overview } from './pages/Overview'
import { DefaultLayout } from './pages/DefaultLayout'
import { Employee } from './pages/Employee'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="infos/:id" element={<Employee />} />
        <Route path="overview" element={<Overview />} />
      </Route>
    </Routes>
  )
}
