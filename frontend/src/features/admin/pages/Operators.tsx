import { useEffect, useState } from 'react'
import {Bus,Users,Ticket,Wallet,TrendingUp,ArrowUpRight,ChevronRight,X,FileText,ExternalLink,} from 'lucide-react'
import { getOperators, updateOperatorStatus } from '@/features/admin/services/adminService'

 
interface Operator {
  _id: string
  ownerName: string
  legalEntityName: string
  email: string
  phone: string
  gstNumber: string
  yearOfIncorporation: string
  panNumber: string
  authorisedRepresentative: string
  registrationCertificate: string
  taxCertificate: string
  transportLicense: string
  status: string
  createdAt: string
}

interface StatCardData {
  label: string
  value: string
  delta: string
  icon: typeof Bus
}
 

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  under_review: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  Approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  Rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  rejected: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
}

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
      statusStyles[status] ?? 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
    }`}
  >
    {status}
  </span>
)

 
// const DocumentRow = ({ label, url }: { label: string; url: string }) => (
//   <a
//     href={url}
//     target="_blank"
//     rel="noopener noreferrer"
//     className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
//   >
//     <span>{label}</span>
//   </a>
// )

 
interface OperatorModalProps {
  operator: Operator
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
  updating: boolean
}

const OperatorDetailsModal = ({ operator, onClose, onStatusChange, updating }: OperatorModalProps) => {
  const [status, setStatus] = useState(operator.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-blue-950 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-white">{operator.legalEntityName}</h2>
            <p className="mt-0.5 text-xs text-blue-200">Operator Details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          {/* Status selector */}
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Application Status
            </span>
            <div className="flex items-center gap-3">
              <StatusBadge status={operator.status} />

              <select
                value={status}
                disabled={updating}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={() => onStatusChange(operator._id, status)}
                disabled={updating || status === operator.status}
                className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>

              {updating && <span className="text-xs text-slate-400">Updating...</span>}
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Owner Name</span>
              <p className="mt-1 text-sm font-medium text-slate-900">{operator.ownerName}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Authorised Representative
              </span>
              <p className="mt-1 text-sm font-medium text-slate-900">{operator.authorisedRepresentative}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</span>
              <p className="mt-1 text-sm font-medium text-slate-900">{operator.email}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</span>
              <p className="mt-1 text-sm font-medium text-slate-900">{operator.phone}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">GST Number</span>
              <p className="mt-1 text-sm font-medium text-slate-900">{operator.gstNumber}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">PAN Number</span>
              <p className="mt-1 text-sm font-medium text-slate-900">{operator.panNumber}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Year of Incorporation
              </span>
              <p className="mt-1 text-sm font-medium text-slate-900">{operator.yearOfIncorporation}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Registered On
              </span>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(operator.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Documents */}
          {/* <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Uploaded Documents
            </span>
            <div className="mt-2 flex flex-col gap-2">
              <DocumentRow label="Registration Certificate" url={operator.registrationCertificate} />
              <DocumentRow label="Tax Certificate" url={operator.taxCertificate} />
              <DocumentRow label="Transport License" url={operator.transportLicense} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}


const MasterCommandCenter = () => {
  const [operators, setOperators] = useState<Operator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchOperators()
  }, [])

  const fetchOperators = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getOperators()
        console.log(response)
      setOperators(Array.isArray(response) ? response : response.operators ?? [])
      // const totalOperators = operators.length;
    } catch (err) {
      console.error(err)
      setError('Failed to fetch operators')
    } finally {
      setLoading(false)
    }
  }

  const stats: StatCardData[] = [
  { label: 'Total Travel Operators', value: operators.length.toString(), delta: '+2 This Month', icon: Bus },
  { label: 'Total Passengers', value: 'comming soon', delta: '+12.5%', icon: Users },
  { label: 'Total Bookings', value: 'comming soon', delta: '852 Pending', icon: Ticket },
]

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setUpdatingStatus(true)
      await updateOperatorStatus(id, status)

      setOperators((prev) =>
        prev.map((op) => (op._id === id ? { ...op, status } : op))
      )
      setSelectedOperator((prev) => (prev && prev._id === id ? { ...prev, status } : prev))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

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

          <div className="overflow-x-auto">
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
                {loading ? (
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
        </div>
      </div>

      {selectedOperator && (
        <OperatorDetailsModal
          operator={selectedOperator}
          onClose={() => setSelectedOperator(null)}
          onStatusChange={handleStatusChange}
          updating={updatingStatus}
        />
      )}
    </section>
  )
}

export default MasterCommandCenter