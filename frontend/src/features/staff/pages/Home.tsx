import { useMemo, useState } from 'react'
import { MapPin, ArrowRight, ScanLine, Search, Armchair, CheckCircle2, ClipboardList } from 'lucide-react'

type PassengerType = 'Regular' | 'Premium Gold' | 'VIP Lounge Access'

type Passenger = {
  id: string
  seat: string
  name: string
  pnr: string
  type: PassengerType
}

// TODO: replace with data from your API
const trip = {
  id: 'LX-501',
  from: 'Kochi (Cochin)',
  to: 'Bangalore Majestic',
  totalSeats: 36,
}

const passengers: Passenger[] = [
  { id: '1', seat: '04A', name: 'Aditi Sharma', pnr: 'LX889210', type: 'Regular' },
  { id: '2', seat: '05C', name: 'Rahul Varma', pnr: 'LX889245', type: 'Premium Gold' },
  { id: '3', seat: '12B', name: 'Meera Krishnan', pnr: 'LX889212', type: 'Regular' },
  { id: '4', seat: '02A', name: 'Vikram Singh', pnr: 'LX889201', type: 'VIP Lounge Access' },
]

const StaffHome = () => {
  const [search, setSearch] = useState('')

  const booked = 29
  const available = trip.totalSeats - booked
  const filled = trip.totalSeats - available

  const filteredPassengers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return passengers

    return passengers.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.seat.toLowerCase().includes(query) ||
        p.pnr.toLowerCase().includes(query)
    )
  }, [search])

  const handleQuickScan = () => {
    // TODO: open QR / ticket scanner
    console.log('Quick scan clicked')
  }

  const stats = [
    {
      label: 'Seat Availability',
      value: `${filled}/${trip.totalSeats}`,
      sub: 'Seats Filled',
      valueClass: 'text-blue-900',
      icon: Armchair,
    },
    {
      label: 'Booked',
      value: booked,
      valueClass: 'text-emerald-700',
      icon: CheckCircle2,
    },
    {
      label: 'Available',
      value: available,
      valueClass: 'text-amber-700',
      icon: ClipboardList,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Active Duty - Trip #{trip.id}</h1>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-blue-900" />
            <span>{trip.from}</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            <span>{trip.to}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickScan}
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-900 px-5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          <ScanLine className="h-4 w-4" />
          Quick Scan
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, sub, valueClass, icon: Icon }) => (
          <div
            key={label}
            className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</p>
              {sub && <p className="mt-0.5 text-[11px] font-semibold text-slate-600">{sub}</p>}
            </div>
            <Icon className="h-6 w-6 text-slate-300" />
          </div>
        ))}
      </div>

      {/* Passengers list */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Passengers List</h2>

          <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition-shadow focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 sm:w-64">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search passenger..."
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5">
          {filteredPassengers.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No passengers found.</p>
          ) : (
            filteredPassengers.map((p) => {
              const isSpecial = p.type !== 'Regular'

              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 ${
                    isSpecial ? 'border-l-4 border-l-amber-700' : ''
                  }`}
                >
                  <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-md bg-slate-100">
                    <span className="text-[8px] font-semibold uppercase text-slate-500">Seat</span>
                    <span className="text-sm font-bold text-slate-900">{p.seat}</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">
                      PNR: {p.pnr} &bull; {p.type}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default StaffHome