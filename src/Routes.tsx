import { Route, Routes } from 'react-router-dom'

import { Home } from './pages/Home'
import { Overview } from './pages/Overview'
import { DefaultLayout } from './pages/DefaultLayout'
import { Employee } from './pages/Employee'
import { OverviewEmployee } from './pages/OverviewEmployee'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="infos/:id" element={<Employee />} />
        <Route path="overview" element={<Overview />} />
        <Route path="overview-employee/:id" element={<OverviewEmployee />} />
      </Route>
    </Routes>
  )
}
