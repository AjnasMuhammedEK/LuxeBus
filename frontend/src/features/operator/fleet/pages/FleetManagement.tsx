
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import AddBusModal from "../components/AddBusModal";
import BusDetailsModal from "../components/BusDetailsModal";
import { getOperatorBuses } from "../service/busService";

import DataTable from "@/components/common/tables/DataTable";
import type { Column } from "@/components/common/tables/DataTable";

import type {
  IBus,
  BusApprovalStatus,
  IBusStats,
} from "@/types/fleet.types";

const PAGE_SIZE = 5;

const statusStyle: Record<BusApprovalStatus, string> = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
};

const FleetManagement = () => {
  const [buses, setBuses] = useState<IBus[]>([]);

  const [stats, setStats] = useState<IBusStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<
    "ALL" | BusApprovalStatus
  >("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<IBus | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch buses and statistics
  useEffect(() => {
    let cancelled = false;

    const loadBuses = async () => {
      try {
        setIsLoading(true);

        const response = await getOperatorBuses({
          page,
          limit: PAGE_SIZE,
          search,
          approvalStatus:
            activeTab === "ALL" ? undefined : activeTab,
        });

        if (cancelled) return;

        setBuses(response.data.buses);
        setStats(response.data.stats);
        setTotal(response.data.pagination.totalItems);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch buses:", error);
        toast.error("Failed to load buses");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadBuses();

    return () => {
      cancelled = true;
    };
  }, [page, search, activeTab, refreshKey]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Pagination
  const pageNumbers = useMemo(() => {
    const maxVisible = 5;

    let start = Math.max(
      1,
      page - Math.floor(maxVisible / 2)
    );

    const end = Math.min(
      totalPages,
      start + maxVisible - 1
    );

    start = Math.max(1, end - maxVisible + 1);

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }, [page, totalPages]);

  // Table columns
  const busColumns: Column<IBus>[] = [
    {
      key: "details",
      header: "Bus Details",
      render: (bus) => (
        <div>
          <p className="font-medium text-slate-800">
            {bus.manufacturer} {bus.model}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            Year: {bus.manufacturingYear}
          </p>
        </div>
      ),
    },
    {
      key: "registration",
      header: "Registration",
      render: (bus) => (
        <span className="font-medium text-slate-700">
          {bus.registrationNumber}
        </span>
      ),
    },
    {
      key: "type",
      header: "Bus Type",
      render: (bus) => (
        <span className="text-slate-500">
          {bus.busType.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      key: "layout",
      header: "Seat Layout",
      render: (bus) => (
        <div>
          <p className="text-slate-700">
            {bus.seatLayoutSnapshot.name}
          </p>

          <p className="text-xs text-slate-400">
            {bus.seatLayoutSnapshot.totalCapacity} seats
          </p>
        </div>
      ),
    },
    {
      key: "approval",
      header: "Approval",
      render: (bus) => (
        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[bus.approvalStatus]}`}
          >
            {bus.approvalStatus}
          </span>

          {bus.rejectReason && (
            <p className="mt-1 max-w-40 text-xs text-red-600">
              {bus.rejectReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (bus) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            bus.isActive
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {bus.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (bus) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => {
              setSelectedBus(bus);
              setDetailsOpen(true);
            }}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={`View ${bus.registrationNumber}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const statCards = [
    { label: "Total Buses", value: stats.total },
    { label: "Approved", value: stats.approved },
    { label: "Pending Approval", value: stats.pending },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Fleet Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your buses and their approval status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Add New Bus
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {card.label}
              </p>

              <p className="mt-1.5 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Bus Directory */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Bus Directory
            </h2>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 sm:w-64">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />

                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search registration, model..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {(
                  ["ALL", "PENDING", "APPROVED", "REJECTED"] as const
                ).map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => {
                      setPage(1);
                      setActiveTab(tab);
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === tab
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab === "ALL" ? "All Buses" : tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={busColumns}
            data={buses}
            getRowKey={(bus) => bus._id}
            loading={isLoading}
            loadingMessage="Loading buses..."
            emptyMessage="No buses found. Add a bus to start managing your fleet."
            minWidth="850px"
          />

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row">
            <p className="text-xs text-slate-400">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, total)} of {total} buses
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  disabled={isLoading}
                  className={`h-7 w-7 rounded-md text-xs font-semibold ${
                    page === n
                      ? "bg-blue-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page >= totalPages || isLoading}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bus Modal */}
      <AddBusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setModalOpen(false);
          setPage(1);
          setRefreshKey((prev) => prev + 1);
        }}
      />

      {/* Bus Details Modal */}
      <BusDetailsModal
        open={detailsOpen}
        bus={selectedBus}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedBus(null);
        }}
        onUpdated={() => {
          setDetailsOpen(false);
          setSelectedBus(null);
          setPage(1);
          setRefreshKey((prev) => prev + 1);
        }}
      />
    </div>
  );
};

export default FleetManagement;
