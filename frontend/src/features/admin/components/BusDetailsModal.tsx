import { useState } from "react";
import { X, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { getBusDocumentUrl, updateBusStatus } from "../services/adminService";
import { statusStyles } from "../pages/Buses";
import type {
  IAdminBus,
  BusApprovalStatus,
  BusDocumentKey,
} from "@/types/fleet.types";

interface Props {
  bus: IAdminBus;
  onClose: () => void;
  onUpdated: () => void;
}

const DOCS: { key: BusDocumentKey; label: string }[] = [
  { key: "rc", label: "RC" },
  { key: "fitnessCertificate", label: "Fitness Certificate" },
  { key: "insurance", label: "Insurance" },
];

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[11px] uppercase text-gray-500 font-semibold">{label}</p>
    <p className="text-sm text-[#0B1F3A] font-medium">{value || "-"}</p>
  </div>
);

const BusDetailsModal = ({ bus, onClose, onUpdated }: Props) => {
  const [newStatus, setNewStatus] = useState<BusApprovalStatus>(
    bus.approvalStatus,
  );


  const isRejected = bus.approvalStatus === "REJECTED";

  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loadingDocument, setLoadingDocument] = useState<BusDocumentKey | null>(
    null,
  );
  const [reason, setReason] = useState(bus.rejectReason ?? "");
  const [saving, setSaving] = useState(false);

  const snapshot = bus.seatLayoutSnapshot;

  // Seat type wise count (snapshot-ൽ നിന്ന് തന്നെ calculate ചെയ്യുന്നു)
  const seatCounts = snapshot.seats.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {});

  const handleViewDoc = async (key: BusDocumentKey) => {
    try {
      setLoadingDocument(key);

      const url = await getBusDocumentUrl(bus._id, key);

      setDocumentUrl(url);
    } catch (error) {
      console.error("Document preview failed:", error);
      toast.error("Unable to open document");
    } finally {
      setLoadingDocument(null);
    }
  };

  const handleSave = async () => {
    if (newStatus === bus.approvalStatus) {
      toast.error("Select a different status");
      return;
    }
    if (newStatus === "REJECTED" && reason.trim().length < 5) {
      toast.error("Please enter a reject reason (min 5 characters)");
      return;
    }
    try {
      setSaving(true);
      await updateBusStatus(
        bus._id,
        newStatus,
        newStatus === "REJECTED" ? reason.trim() : undefined,
      );
      toast.success(`Bus ${newStatus.toLowerCase()}`);
      onUpdated();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-[#0B1F3A]">
              {bus.registrationNumber}
            </h2>
            <span
              className={`mt-1 inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusStyles[bus.approvalStatus]}`}
            >
              {bus.approvalStatus}
            </span>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bus info */}
          <section>
            <h3 className="font-semibold text-[#0B1F3A] mb-3">
              Bus Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Manufacturer" value={bus.manufacturer} />
              <Field label="Model" value={bus.model} />
              <Field label="Year" value={bus.manufacturingYear} />
              <Field
                label="Bus Type"
                value={bus.busType.replaceAll("_", " ")}
              />
              <Field label="Active" value={bus.isActive ? "Yes" : "No"} />
              <Field
                label="Added On"
                value={
                  bus.createdAt && new Date(bus.createdAt).toLocaleDateString()
                }
              />
            </div>
          </section>

          {/* Operator */}
          <section>
            <h3 className="font-semibold text-[#0B1F3A] mb-3">Operator</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Company" value={bus.operatorId?.legalEntityName} />
              <Field label="Owner" value={bus.operatorId?.ownerName} />
              <Field label="Email" value={bus.operatorId?.email} />
              <Field label="Phone" value={bus.operatorId?.phone} />
            </div>
          </section>

          {/* Seat layout */}
          <section>
            <h3 className="font-semibold text-[#0B1F3A] mb-3">Seat Layout</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Layout" value={snapshot.name} />
              <Field label="Total Capacity" value={snapshot.totalCapacity} />
              <Field
                label="Decks"
                value={snapshot.decks.map((d) => d.name).join(", ")}
              />
              {Object.entries(seatCounts).map(([type, count]) => (
                <Field
                  key={type}
                  label={type.replaceAll("_", " ")}
                  value={count}
                />
              ))}
            </div>
            {/* TODO: ഇവിടെ നമ്മുടെ SeatLayoutPreview reuse ചെയ്യാം (props അറിഞ്ഞിട്ട്) */}
          </section>

          {/* Amenities */}
          <section>
            <h3 className="font-semibold text-[#0B1F3A] mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {bus.amenities.length ? (
                bus.amenities.map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1 text-xs rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A]"
                  >
                    {a.replaceAll("_", " ")}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">None</p>
              )}
            </div>
          </section>

     
<section>
  <h3 className="font-semibold text-[#0B1F3A] mb-3">
    Documents
  </h3>

  <div className="grid md:grid-cols-3 gap-3">
    {DOCS.map((d) => (
      <button
        key={d.key}
        type="button"
        disabled={loadingDocument !== null}
        onClick={() => handleViewDoc(d.key)}
        className="flex items-center gap-2 border rounded-lg p-3 text-sm hover:border-[#C9A227] hover:bg-gray-50 disabled:opacity-50"
      >
        <FileText className="w-4 h-4 text-[#C9A227]" />

        {loadingDocument === d.key
          ? "Loading..."
          : d.label}
      </button>
    ))}
  </div>
</section>

          {/* Change status */}
         {/* Change status */}
<section className="border-t pt-5">
  <h3 className="font-semibold text-[#0B1F3A] mb-3">
    Change Status
  </h3>

  {isRejected && (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
      <p className="text-sm font-bold text-red-700">
        Rejected.
      </p>
      <p className="text-sm text-red-600 mt-1">
        The status cannot be changed.
      </p>
      <p className="text-sm text-red-600 mt-2">
        Rejection reason: {bus.rejectReason || "No reason provided"}
      </p>
    </div>
  )}

  <div className="flex flex-wrap gap-2 mb-3">
    {(["PENDING", "APPROVED", "REJECTED"] as BusApprovalStatus[]).map(
      (s) => (
        <button
          key={s}
          type="button"
          disabled={isRejected}
          onClick={() => setNewStatus(s)}
          className={`px-4 py-2 rounded-lg text-sm border ${
            newStatus === s
              ? "bg-[#0B1F3A] text-white border-[#0B1F3A]"
              : "hover:bg-gray-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {s}
        </button>
      ),
    )}
  </div>

  {newStatus === "REJECTED" && !isRejected && (
    <textarea
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      rows={3}
      placeholder="Reason for rejection (operator will see this)"
      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:border-[#C9A227]"
    />
  )}

  <div className="flex justify-end gap-3 mt-4">
    <button
      onClick={onClose}
      className="px-4 py-2 border rounded-lg text-sm"
    >
      Cancel
    </button>

    <button
      onClick={handleSave}
      disabled={saving || isRejected}
      className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#C9A227] text-[#0B1F3A] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isRejected ? "Rejected" : saving ? "Saving..." : "Update Status"}
    </button>
  </div>
</section>
        </div>
      </div>
      {/* Document Preview Modal */}
{documentUrl && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4">
    <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

      {/* Preview Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />

          <h3 className="text-base font-semibold text-slate-900">
            Bus Document Preview
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setDocumentUrl(null)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Document Viewer */}
      <iframe
        src={documentUrl}
        title="Bus Document Preview"
        className="min-h-0 w-full flex-1"
      />
    </div>
  </div>
)}
    </div>
  );
};

export default BusDetailsModal;
