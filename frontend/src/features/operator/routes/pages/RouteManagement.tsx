
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import AddRouteModal from "../components/AddRouteModal";
import EditRouteModal from "../components/EditRouteModal";
import RouteDetailsModal from "../components/RouteDetailsModal";

import DataTable from "@/components/common/tables/DataTable";
import type { Column } from "@/components/common/tables/DataTable";

import {
  getOperatorRoutes,
  deleteRoute,
} from "../service/routeService";

import type { IRoute } from "@/types/route.types";

const PAGE_SIZE = 5;

type RouteTab = "ALL" | "ACTIVE" | "INACTIVE";

interface IRouteListResult {
  routes: IRoute[];
  total: number;
  totalPages: number;
}

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "—";
  }

  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

const formatDistance = (meters: number): string => {
  if (!Number.isFinite(meters) || meters < 0) {
    return "—";
  }

  return `${(meters / 1000).toFixed(1)} km`;
};

const RouteManagement = () => {
  const [routes, setRoutes] = useState<IRoute[]>([]);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<RouteTab>("ALL");

  const [addOpen, setAddOpen] = useState(false);

  const [editRouteId, setEditRouteId] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<IRoute | null>(null);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteRoute = async (
    route: IRoute,
    toastId: string,
  ) => {
    if (deletingRouteId) {
      return;
    }

    try {
      setDeletingRouteId(route._id);

      await deleteRoute(route._id);

      toast.dismiss(toastId);
      toast.success("Route deleted successfully");

      if (routes.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        refresh();
      }
    } catch (error) {
      toast.dismiss(toastId);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete route",
      );
    } finally {
      setDeletingRouteId(null);
    }
  };

  const confirmDeleteRoute = (route: IRoute) => {
    toast.custom(
      (t) => (
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">
                Delete Route?
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  {route.routeName}
                </span>
                ? This action will remove the route from your route list.
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              disabled={deletingRouteId === route._id}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleDeleteRoute(route, t.id)}
              disabled={deletingRouteId !== null}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingRouteId === route._id
                ? "Deleting..."
                : "Delete Route"}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
  };

  useEffect(() => {
    let cancelled = false;

    const loadRoutes = async () => {
      try {
        setIsLoading(true);

        const response = await getOperatorRoutes({
          page,
          limit: PAGE_SIZE,
          search,
          isActive:
            activeTab === "ALL"
              ? undefined
              : activeTab === "ACTIVE",
        });

        if (cancelled) return;

        const result: IRouteListResult | undefined = response?.data;

        if (!result || !Array.isArray(result.routes)) {
          throw new Error("Invalid routes API response");
        }

        setRoutes(result.routes);
        setTotal(result.total ?? 0);
        setTotalPages(Math.max(result.totalPages ?? 1, 1));
      } catch (error) {
        if (cancelled) return;

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load routes",
        );

        setRoutes([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadRoutes();

    return () => {
      cancelled = true;
    };
  }, [page, search, activeTab, refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));

    const end = Math.min(totalPages, start + maxVisible - 1);

    start = Math.max(1, end - maxVisible + 1);

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index,
    );
  }, [page, totalPages]);

  const routeColumns: Column<IRoute>[] = [
    {
      key: "route",
      header: "Route",
      render: (route) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <MapPin className="h-4 w-4" />
          </div>

          <div>
            <p className="font-medium text-slate-800">
              {route.routeName}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {route.origin.name} → {route.destination.name}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "boarding",
      header: "Boarding Points",
      render: (route) => (
        <PointsList
          points={[
            { name: route.origin.name },
            ...route.stops
              .filter((stop) => stop.isBoardingPoint)
              .map((stop) => ({ name: stop.name })),
          ]}
        />
      ),
    },
    {
      key: "dropping",
      header: "Dropping Points",
      render: (route) => (
        <PointsList
          points={[
            ...route.stops
              .filter((stop) => stop.isDroppingPoint)
              .map((stop) => ({ name: stop.name })),
            { name: route.destination.name },
          ]}
        />
      ),
    },
    {
      key: "distance",
      header: "Distance & Duration",
      render: (route) => (
        <div>
          <p className="font-medium text-slate-700">
            {formatDistance(route.distanceInMeters)}
          </p>

          <p className="text-xs text-slate-400">
            {formatDuration(route.estimatedDurationInSeconds)}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (route) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            route.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {route.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (route) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedRoute(route);
              setDetailsOpen(true);
            }}
            title="View route details"
            aria-label={`View ${route.routeName} details`}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setEditRouteId(route._id)}
            title="Edit route"
            aria-label={`Edit ${route.routeName}`}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => confirmDeleteRoute(route)}
            disabled={deletingRouteId !== null}
            title="Delete route"
            aria-label={`Delete ${route.routeName}`}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const tabs: { key: RouteTab; label: string }[] = [
    { key: "ALL", label: "All Routes" },
    { key: "ACTIVE", label: "Active" },
    { key: "INACTIVE", label: "Inactive" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Route Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage the routes your buses operate on.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Add New Route
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Total Routes
            </p>

            <p className="mt-1.5 text-2xl font-bold text-slate-900">
              {total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Current Page
            </p>

            <p className="mt-1.5 text-2xl font-bold text-slate-900">
              {routes.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Routes displayed on this page
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Total Pages
            </p>

            <p className="mt-1.5 text-2xl font-bold text-slate-900">
              {totalPages}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Route Directory
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Manage and monitor all your routes
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 ring-1 ring-transparent transition-shadow focus-within:border-blue-400 focus-within:ring-blue-100 sm:w-64">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />

                <input
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                  placeholder="Search name, origin, destination..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.key}
                    onClick={() => {
                      setPage(1);
                      setActiveTab(tab.key);
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DataTable
            columns={routeColumns}
            data={routes}
            getRowKey={(route) => route._id}
            loading={isLoading}
            loadingMessage="Loading routes..."
            emptyMessage="No routes found. Add a route to get started."
            minWidth="1050px"
          />

          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row">
            <p className="text-xs text-slate-400">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, total)} of {total} routes
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.max(1, prev - 1))
                }
                disabled={page === 1 || isLoading}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  disabled={isLoading}
                  className={`h-7 w-7 rounded-md text-xs font-semibold ${
                    page === number
                      ? "bg-blue-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setPage((prev) =>
                    Math.min(totalPages, prev + 1),
                  )
                }
                disabled={page >= totalPages || isLoading}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddRouteModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setAddOpen(false);
          setPage(1);
          refresh();
        }}
      />

      <EditRouteModal
        open={Boolean(editRouteId)}
        routeId={editRouteId}
        onClose={() => setEditRouteId(null)}
        onUpdated={() => {
          setEditRouteId(null);
          refresh();
        }}
      />

      <RouteDetailsModal
        open={detailsOpen}
        route={selectedRoute}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedRoute(null);
        }}
      />
    </div>
  );
};

const PointsList = ({
  points,
}: {
  points: { name: string }[];
}) => {
  if (!points || points.length === 0) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const visible = points.slice(0, 2);
  const remaining = points.length - visible.length;

  return (
    <div className="space-y-0.5">
      {visible.map((point, index) => (
        <p
          key={`${point.name}-${index}`}
          className="text-xs text-slate-600"
        >
          {point.name}
        </p>
      ))}

      {remaining > 0 && (
        <p className="text-xs font-medium text-blue-700">
          +{remaining} more
        </p>
      )}
    </div>
  );
};

export default RouteManagement;
