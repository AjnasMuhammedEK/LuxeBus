import { MapPin, Calendar, Search } from 'lucide-react'
import { useState } from 'react'
import banner from '../../../../public/banner.avif'

type TripType = 'roundTrip' | 'oneWay'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatDate = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const buildQuickDates = () => {
  return Array.from({ length: 3 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      value: formatDate(d),
      weekday: i === 0 ? 'Today' : WEEKDAY_LABELS[d.getDay()],
      day: String(d.getDate()).padStart(2, '0'),
    }
  })
}

const HeroSection = () => {
  const [tripType, setTripType] = useState<TripType>('oneWay')
  const [from, setFrom] = useState('Ernakulam')
  const [to, setTo] = useState('Bengalore')
  const [date, setDate] = useState('2024-10-24')
  const [returnDate, setReturnDate] = useState('')

  const isRoundTrip = tripType === 'roundTrip'
  const quickDates = buildQuickDates()

 

  return (
    <section className="relative overflow-hidden">
      {/* Animation keyframes */}
      <style>{`
        @keyframes quickDateBoxIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .quick-date-box {
          animation: quickDateBoxIn 0.22s ease-out backwards;
        }
        .date-slot-panel {
          transition: opacity 0.28s ease-out, transform 0.28s ease-out;
        }
        .date-slot-panel[data-active="true"] {
          opacity: 1;
          transform: translateY(0);
        }
        .date-slot-panel[data-active="false"] {
          opacity: 0;
          transform: translateY(-4px);
          pointer-events: none;
        }
      `}</style>

      {/* Background image layer - overflow-hidden lives HERE only */}
      <div className="absolute inset-0">
        <img
          src={banner}
          alt="LuxeBus premium coach on the highway at sunset"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/20 to-slate-900/70" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex min-h-[560px] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[600px] md:min-h-[640px]">
        <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Premium Journeys. <span className="font-medium text-slate-200">Every Time</span>
        </h1>

        {/* Search card */}
        <div className="mt-10 w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-md sm:p-6">
          {/* Trip type toggle */}
          <div className="relative mx-auto mb-5 flex w-full max-w-[220px] gap-1 rounded-full bg-slate-800/80 p-1 sm:w-fit">
            <span
              aria-hidden="true"
              className="absolute bottom-1 top-1 rounded-full bg-amber-500 transition-transform duration-300 ease-out"
              style={{
                width: 'calc((100% - 12px) / 2)',
                transform: isRoundTrip ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
              }}
            />
            <button
              type="button"
              onClick={() => setTripType('oneWay')}
              aria-pressed={!isRoundTrip}
              className={`relative z-10 flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                !isRoundTrip ? 'text-slate-900' : 'text-slate-300 hover:text-white'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => setTripType('roundTrip')}
              aria-pressed={isRoundTrip}
              className={`relative z-10 flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                isRoundTrip ? 'text-slate-900' : 'text-slate-300 hover:text-white'
              }`}
            >
              Round Trip
            </button>
          </div>

          {/* Fields - all in a single line on large screens, all rows locked to h-[42px] */}
          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">From</span>
              <div className="flex h-[42px] items-center gap-2 rounded-lg bg-slate-800/80 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-amber-400/60">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Leaving from"
                  className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">To</span>
              <div className="flex h-[42px] items-center gap-2 rounded-lg bg-slate-800/80 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-amber-400/60">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Going to"
                  className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Departure Date</span>
              <div className="flex h-[42px] items-center gap-2 rounded-lg bg-slate-800/80 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-amber-400/60">
                <Calendar className="h-4 w-4 shrink-0 text-amber-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                />
              </div>
            </label>

            {/* Swapping slot: 3 Quick Date boxes <-> Return Date, same column, same row, same h-[42px] */}
            <div className="relative grid">
              {/* Quick Date boxes - shown for One Way */}
              <div
                data-active={!isRoundTrip}
                className="date-slot-panel col-start-1 row-start-1 flex flex-col gap-1"
                aria-hidden={isRoundTrip}
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Quick selection
                </span>
                <div className="flex h-[42px] items-stretch gap-1.5">
                  {quickDates.map((qd, i) => (
                    <button
                      key={qd.value}
                      type="button"
                      tabIndex={isRoundTrip ? -1 : 0}
                      onClick={() => setDate(qd.value)}
                      style={{ animationDelay: `${i * 40}ms` }}
                      aria-pressed={date === qd.value}
                      className={`quick-date-box flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 transition-colors duration-200 ${
                        date === qd.value
                          ? 'border-amber-400 bg-amber-500 text-slate-900'
                          : 'border-transparent bg-slate-800/80 text-slate-300 ring-1 ring-transparent hover:border-amber-400/40 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-medium uppercase tracking-wide opacity-80">
                        {qd.weekday}
                      </span>
                      <span className="text-sm font-semibold leading-none">{qd.day}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Return Date - shown for Round Trip, same slot */}
              <div
                data-active={isRoundTrip}
                className="date-slot-panel col-start-1 row-start-1 flex flex-col gap-1"
                aria-hidden={!isRoundTrip}
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Return Date
                </span>
                <div className="flex h-[42px] items-center gap-2 rounded-lg bg-slate-800/80 px-3 ring-1 ring-transparent transition-shadow focus-within:ring-amber-400/60">
                  <Calendar className="h-4 w-4 shrink-0 text-amber-400" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    tabIndex={isRoundTrip ? 0 : -1}
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-500 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              
              className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:col-span-2 lg:col-span-1 lg:w-auto"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection