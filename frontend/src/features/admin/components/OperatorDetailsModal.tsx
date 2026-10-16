import { useState } from 'react'
import {Bus,X,FileText,ExternalLink,Ban, ShieldCheck,AlertTriangle} from 'lucide-react'

import { getSignedDocmunetUrl } from '@/features/admin/services/adminService'
import toast from 'react-hot-toast'
import type { IOperator } from '@/types/operator.types'
 

export interface StatCardData {
  label: string
  value: string
  delta: string
  icon: typeof Bus
}
 

interface DocumentRowProps {

    label: string;

    objectKey: string;

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

export const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
      statusStyles[status] ?? 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
    }`}
  >
    {status}
  </span>
)


const handleDoumentView = async (objectKey : string) => {
  try {
    const response = await getSignedDocmunetUrl(objectKey)
      
    window.open(response.data.signedUrl,'_blank')
  } catch (error) {
    console.log(error);

  }
}
 
 
const DocumentRow = ({
    label,
    objectKey
}: DocumentRowProps) => (

    <button

        onClick={() => handleDoumentView(objectKey)}

        className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-blue-50"

    >

        <div className="flex items-center gap-3">

            <FileText className="h-5 w-5 text-blue-600"/>

            <span>{label}</span>

        </div>

        <ExternalLink className="h-5 w-5"/>

    </button>

);


interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'success'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null

  const isDanger = variant === 'danger'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
            isDanger ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isDanger ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
        </div>

        <h3 className="mt-4 text-center text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1.5 text-center text-sm text-slate-500">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 ${
              isDanger ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}


interface OperatorModalProps {
  operator: IOperator
  onClose: () => void
  onStatusChange: (id: string, status: IOperator["status"] , reason : string | null) => void
  updating: boolean
  onBlockToggle: (id: string, isBlocked: boolean) => void
  blocking: boolean
}

const OperatorDetailsModal = ({ operator, onClose, onStatusChange, updating, onBlockToggle, blocking }: OperatorModalProps) => {
  const [status, setStatus] = useState(operator.status)
  const [rejectReason, setRejectReason] = useState(operator.rejectReason ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isRejected = operator.status?.toLowerCase() === 'rejected'

  const handleUpdateStatus = () => {


    if (isRejected) {
      toast.error('A rejected operator cannot be changed to approved or pending')
      return
    }


    if (status === 'rejected' && !rejectReason.trim()) {
      toast.error('Please enter a rejection reason before rejecting this operator')
      return
    }

    if (status === 'rejected' && rejectReason.trim().length < 10) {
      toast.error('Rejection reason must be at least 10 characters')
      return
    }

    onStatusChange(
      operator._id,
      status,
      status === 'rejected' ? rejectReason.trim() : null
    )
  }

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
                disabled={updating || isRejected}
                onChange={(e) => setStatus(e.target.value  as IOperator["status"])}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>



              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating || isRejected || status === operator.status}
                className="inline-flex items-center justify-center rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>

              
            </div>

            {isRejected && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                This application was rejected and its status can no longer be changed.
              </p>
            )}
            
            {status === 'rejected' && (
              <div className="w-full basis-full rounded-xl border border-red-200 bg-red-50/50 p-4">
                <label
                  htmlFor="reject-reason"
                  className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800"
                >
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Rejection Reason
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter the reason for rejecting this operator..."
                  rows={4}
                  disabled={updating || isRejected}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                />

              
              </div>
            )}
          </div>


 
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Account Access
            </span>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {operator.isBlocked ? 'This operator is blocked' : 'This operator is active'}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {operator.isBlocked
                    ? 'They cannot log in until you unblock them.'
                    : 'Block to stop them from logging in.'}
                </p>
              </div>

              <button
                type="button"
                disabled={blocking || operator.status === 'pending' || operator.status === 'rejected'}
                onClick={() => setConfirmOpen(true)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                  operator.isBlocked ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {operator.isBlocked ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                {blocking ? 'Please wait...' : operator.isBlocked ? 'Unblock' : 'Block'}
              </button>
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
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Uploaded Documents
            </span>
            <div className="mt-2 flex flex-col gap-2">
               <DocumentRow
                    label="Registration Certificate"
                    objectKey={operator.registrationCertificate}
                />

                <DocumentRow
                    label="Tax Certificate"
                    objectKey={operator.taxCertificate}
                />

                <DocumentRow
                    label="Transport License"
                    objectKey={operator.transportLicense}
                />
            </div>
          </div>
        </div>
        </div>
              <ConfirmDialog
          open={confirmOpen}
          variant={operator.isBlocked ? 'success' : 'danger'}
          title={operator.isBlocked ? 'Unblock operator?' : 'Block operator?'}
          message={
            operator.isBlocked
              ? `${operator.legalEntityName} will be able to log in again.`
              : `${operator.legalEntityName} will no longer be able to log in.`
          }
          confirmLabel={operator.isBlocked ? 'Yes, Unblock' : 'Yes, Block'}
          loading={blocking}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            await onBlockToggle(operator._id, !operator.isBlocked)
            setConfirmOpen(false)
          }}
        />
    </div>
  )
}

export default OperatorDetailsModal