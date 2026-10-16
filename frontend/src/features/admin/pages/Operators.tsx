import { useEffect, useState } from 'react'
import { Bus, Users, Ticket, Wallet, TrendingUp, ArrowUpRight, Search, X, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { getOperators, updateOperatorStatus, updateOperatorBlockStatus } from '@/features/admin/services/adminService'
import OperatorDetailsModal, {StatusBadge} from '@/features/admin/components/OperatorDetailsModal'
import type { IOperator } from '@/types/operator.types'

interface StatCardData {
  label: string
  value: string
  delta: string
  icon: typeof Bus
}

const sortOptions = [
  { value: 'legalEntityName', label: 'Agency Name' },
  { value: 'ownerName', label: 'Owner Name' },
  { value : 'createdAt' , label :'Joining Date'}
  
]

const getPageNumbers = (current: number, total: number): (number | '...')[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, '...', total]
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

const MasterCommandCenter = () => {
  const [operators, setOperators] = useState<IOperator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOperator, setSelectedOperator] = useState<IOperator | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [blocking, setBlocking] = useState(false)

  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const [search, setSearch] = useState("")

  const [sortBy, setSortBy] = useState("createdAt")

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const [totalPages, setTotalPages] = useState(1)

  const [totalOperators, setTotalOperators] = useState(0)


  useEffect(() => {
    let cancelled = false

    const loadOperators = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getOperators({
          page,
          limit,
          search,
          sortBy,
          sortOrder,
        })

        if (cancelled) return

        console.log(response.data)

        setOperators(response.data?.operators ?? [])
        setTotalPages(response.data?.pagination?.totalPages ?? 1)
        setTotalOperators(response.data?.pagination?.totalItems ?? 0)
      } catch (err) {
        if (cancelled) return

        console.error(err)
        setOperators([])
        setError('Failed to fetch operators')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadOperators()

    return () => {
      cancelled = true
    }
  }, [page, search, sortBy, sortOrder, limit])



  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 100)
    return () => clearTimeout(timer)
  }, [searchInput])


  const handleBlockToggle = async (id: string, isBlocked: boolean) => {
    try {
      setBlocking(true)
      await updateOperatorBlockStatus(id, isBlocked)

      setOperators((prev) =>
        prev.map((op) => (op._id === id ? { ...op, isBlocked } : op))
      )
      setSelectedOperator((prev) => (prev && prev._id === id ? { ...prev, isBlocked } : prev))
    } catch (err) {
      console.error(err)
    } finally {
      setBlocking(false)
    }
  }

  const stats: StatCardData[] = [
  { label: 'Total Travel Operators', value: totalOperators.toString(), delta: '+2 This Month', icon: Bus },
  { label: 'Total Passengers', value: 'comming soon', delta: '+12.5%', icon: Users },
  { label: 'Total Bookings', value: 'comming soon', delta: '852 Pending', icon: Ticket },
]

  const handleStatusChange = async (id: string,status: IOperator["status"],reason: string | null) => {
    try {
      setUpdatingStatus(true)

      await updateOperatorStatus(id, status, reason)

      setOperators((prev) =>
        prev.map((op) =>
          op._id === id ? { ...op, status } : op
        )
      )

      setSelectedOperator((prev) =>
        prev && prev._id === id
          ? { ...prev, status }
          : prev
      )
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const showingFrom = totalOperators === 0 ? 0 : (page - 1) * limit + 1
  const showingTo = Math.min(page * limit, totalOperators)

  return (
    <section className="min-h-screen w-full bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Master Command Center</h1>
          <p className="mt-1 text-sm text-slate-500">Real-time operational overview for LuxeBus Global.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, delta, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-bold text-slate-900">{value}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {delta}
                </span>
              </div>
            </div>
          ))}

          {/* Revenue card - dark, matches the accent panel from sign-up */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 p-5 shadow-lg shadow-blue-900/20">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-blue-200">Total Revenue</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-amber-300">
                <Wallet className="h-4 w-4" />
              </span>
            </div>
            <div className="relative mt-4 flex items-end justify-between">
              <span className="text-3xl font-bold text-amber-300">Commin Soon</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-blue-200">
                <TrendingUp className="h-3.5 w-3.5" />
                Premium Fleet +18%
              </span>
            </div>
          </div>
        </div>

        {/* Agency requests table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-blue-950 px-6 py-5">
            <div>
              <h2 className="text-base font-semibold text-white">Travel Agency Requests</h2>
              <p className="mt-0.5 text-xs text-blue-200">Operational onboarding queue</p>
            </div>
            {/* <button
              type="button"
              className="flex items-center gap-1 rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-semibold text-blue-950 transition-colors hover:bg-amber-300"
            >
              View All Requests
              <ChevronRight className="h-3.5 w-3.5" />
            </button> */}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, GST..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sort by</span>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(1)
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                onClick={() => {
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  setPage(1)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={`overflow-x-auto transition-opacity duration-150 ${loading && operators.length > 0 ? 'pointer-events-none opacity-50' : ''}`}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Agency Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">GST Number</th>
                  <th className="px-6 py-3">Reg. Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && operators.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">
                      Loading operators...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : operators.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">
                      No operators found.
                    </td>
                  </tr>
                ) : (
                  operators.map((operator) => (
                    <tr key={operator._id} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{operator.legalEntityName}</div>
                        <div className="text-xs text-slate-400">{operator.ownerName}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{operator.email}</td>
                      <td className="px-6 py-4 text-slate-600">{operator.phone}</td>
                      <td className="px-6 py-4 text-slate-600">{operator.gstNumber}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(operator.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={operator.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOperator(operator)}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-600"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{showingFrom}–{showingTo}</span> of{' '}
              <span className="font-semibold text-slate-700">{totalOperators}</span> operators
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>

              {getPageNumbers(page, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-1 text-xs text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-xs font-semibold transition ${
                      p === page
                        ? 'bg-blue-950 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedOperator && (
        <OperatorDetailsModal
          operator={selectedOperator}
          onClose={() => setSelectedOperator(null)}
          onStatusChange={handleStatusChange}
          updating={updatingStatus}
          onBlockToggle={handleBlockToggle}
          blocking={blocking}
        />
      )}
    </section>
  )
}

export default MasterCommandCenter