import type { RootState } from '@/redux/store/store'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const formatDateTime = (date: Date) => {
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${time} | ${day}`
}

function StaffNavbar() {
  const [now, setNow] = useState(new Date())

  // TODO: adjust to match your staff auth slice shape
  const staff = useSelector((state: RootState) => state.staffAuth?.staff)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center justify-between px-6">
        <p className="text-sm font-medium text-slate-600">{formatDateTime(now)}</p>

        <div className="flex flex-col items-end leading-tight">
          <span className="text-sm font-medium text-blue-900">{staff?.fullName ?? 'Staff Member'}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
            {staff?.role ?? 'Conductor'}
          </span>
        </div>
      </div>

      {/* Accent bar */}
      <div className="h-0.5 w-16 bg-blue-900" />
    </header>
  )
}

export default StaffNavbar