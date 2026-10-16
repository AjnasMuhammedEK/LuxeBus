import { Outlet } from 'react-router-dom'

import StaffSidebar from './StaffSidebar'
import StaffNavbar from './StaffNavbar'
 

function StaffLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <StaffSidebar />

      <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50">
        <StaffNavbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

        
      </div>
    </div>
  )
}

export default StaffLayout