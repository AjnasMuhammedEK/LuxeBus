
import { useEffect, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { getAdminBuses } from "../services/adminService";
import BusDetailsModal from "../components/BusDetailsModal";
import DataTable from "@/components/common/tables/DataTable";
import type { Column } from "@/components/common/tables/DataTable";
import type {
  IAdminBus,
  IBusStats,
  BusApprovalStatus,
} from "@/types/fleet.types";

const LIMIT = 10;

export const statusStyles: Record<BusApprovalStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-300",
  APPROVED: "bg-green-50 text-green-700 border-green-300",
  REJECTED: "bg-red-50 text-red-700 border-red-300",
};

const FILTERS: { label: string; value?: BusApprovalStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

// Same helper as the operators page – move it to a shared util if you like
const getPageNumbers = (current: number, total: number): (number | "...")[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2)
    return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Buses = () => {
  const [buses, setBuses] = useState<IAdminBus[]>([]);
  const [stats, setStats] = useState<IBusStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<BusApprovalStatus | undefined>();
  const [error, setError] = useState("");
  const [selectedBus, setSelectedBus] = useState<IAdminBus | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const requestKey = JSON.stringify([
    page,
    debouncedSearch,
    status ?? null,
    refreshKey,
  ]);

  const [loadedRequestKey, setLoadedRequestKey] = useState("");

  const loading = loadedRequestKey !== requestKey;

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    getAdminBuses({
      page,
      limit: LIMIT,
      search: debouncedSearch,
      approvalStatus: status,
    })
      .then((data) => {
        if (cancelled) return;

        setBuses(data.buses);
        setTotal(data.total);
        setStats(data.stats);
        setError("");
      })
      .catch(() => {
        if (cancelled) return;

        setBuses([]);
        setError("Failed to load buses");
        toast.error("Failed to load buses");
      })
      .finally(() => {
        if (!cancelled) {
          setLoadedRequestKey(requestKey);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status, refreshKey, requestKey]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const showingFrom = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const showingTo = Math.min(page * LIMIT, total);

  const statCards = [
    { label: "Total Buses", value: stats.total },
    { label: "Pending Review", value: stats.pending },
    { label: "Approved", value: stats.approved },
    { label: "Rejected", value: stats.rejected },
  ];

  const busColumns: Column<IAdminBus>[] = [
    {
      key: "registration",
      header: "Registration",
      render: (bus) => (
        <span className="font-semibold text-slate-900">
          {bus.registrationNumber}
        </span>
      ),
    },
    {
      key: "bus",
      header: "Bus",
      render: (bus) => (
        <>
          <div className="font-semibold text-slate-900">
            {bus.manufacturer} {bus.model}
          </div>
          <div className="text-xs text-slate-400">{bus.manufacturingYear}</div>
        </>
      ),
    },
    {
      key: "operator",
      header: "Operator",
      render: (bus) => (
        <>
          <div className="font-semibold text-slate-900">
            {bus.operatorId?.legalEntityName}
          </div>
          <div className="text-xs text-slate-400">{bus.operatorId?.email}</div>
        </>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (bus) => bus.busType.replaceAll("_", " "),
    },
    {
      key: "capacity",
      header: "Capacity",
      render: (bus) => bus.seatLayoutSnapshot.totalCapacity,
    },
    {
      key: "status",
      header: "Status",
      render: (bus) => (
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[bus.approvalStatus]}`}
        >
          {bus.approvalStatus}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (bus) => (
        <div className="text-right">
          <button
            type="button"
            onClick={() => setSelectedBus(bus)}
            className="text-xs font-semibold text-blue-700 hover:text-blue-600"
          >
            Review
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="min-h-screen w-full bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Bus Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review operator buses and approve or reject them.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {c.label}
              </span>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {/* Buses table card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-blue-950 px-6 py-5">
            <h2 className="text-base font-semibold text-white">
              Bus Approval Requests
            </h2>
            <p className="mt-0.5 text-xs text-blue-200">
              Fleet onboarding queue
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => {
                    setStatus(f.value);
                    setPage(1);
                  }}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                    status === f.value
                      ? "border-blue-950 bg-blue-950 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reg. number, model..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Reusable table */}
          <div
            className={`transition-opacity duration-150 ${
              loading && buses.length > 0 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <DataTable
              columns={busColumns}
              data={buses}
              getRowKey={(bus) => bus._id}
              loading={loading && buses.length === 0}
              error={error}
              loadingMessage="Loading buses..."
              emptyMessage="No buses found."
              minWidth="900px"
            />
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {showingFrom}–{showingTo}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{total}</span>{" "}
              buses
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>

              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-1 text-xs text-slate-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-xs font-semibold transition ${
                      p === page
                        ? "bg-blue-950 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedBus && (
        <BusDetailsModal
          bus={selectedBus}
          onClose={() => setSelectedBus(null)}
          onUpdated={() => {
            setSelectedBus(null);
            setRefreshKey((current) => current + 1);
          }}
        />
      )}
    </section>
  );
};

export default Buses;
