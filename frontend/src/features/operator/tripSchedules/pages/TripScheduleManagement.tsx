
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Trash2,
  CalendarDays,
  CheckCircle2,
  PauseCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import CreateTripScheduleModal from "../components/CreateTripScheduleModal";
import EditTripScheduleModal from "../components/EditTripScheduleModal";
import TripScheduleDetailsModal from "../components/TripScheduleDetailsModal";
import DeleteScheduleModal from "../components/DeleteScheduleModal";

import { getTripSchedules } from "../service/tripScheduleService";
import { getOperatorBuses } from "../../fleet/service/busService";
import { getStaffs } from "../../staffs/service/staffService";

import DataTable from "@/components/common/tables/DataTable";
import type { Column } from "@/components/common/tables/DataTable";

import {
  WEEKDAYS,
  asObject,
  type IScheduleBusRef,
  type IScheduleRouteRef,
  type IScheduleStaffRef,
  type ITripSchedule,
} from "@/types/tripSchedule.types";

import type { IBus } from "@/types/fleet.types";
import type { IStaff } from "@/types/staff.types";

const formatDate = (value: string): string => {
  if (!value) return "—";

  const parts = value.split("-");

  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);

    if (year && month && day) {
      return new Date(year, month - 1, day).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      );
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLocationName = (
  location?: { name?: string } | string,
): string => {
  if (!location) return "";

  if (typeof location === "string") return location;

  return location.name ?? "";
};

const extractList = <T,>(
  response: unknown,
  keys: string[],
  depth = 0,
): T[] => {
  if (depth > 5 || response === null || response === undefined) {
    return [];
  }

  if (Array.isArray(response)) {
    return response as T[];
  }

  if (typeof response !== "object") {
    return [];
  }

  const root = response as Record<string, unknown>;

  for (const key of keys) {
    if (Array.isArray(root[key])) {
      return root[key] as T[];
    }
  }

  const nestedKeys = ["data", "result", "payload"];

  for (const key of nestedKeys) {
    const nested = root[key];

    if (nested && typeof nested === "object") {
      const result = extractList<T>(nested, keys, depth + 1);

      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
};

const extractSchedules = (response: unknown): ITripSchedule[] => {
  return extractList<ITripSchedule>(response, ["schedules"]);
};

const TripScheduleManagement = () => {
  const [schedules, setSchedules] = useState<ITripSchedule[]>([]);

  const [buses, setBuses] = useState<IBus[]>([]);
  const [drivers, setDrivers] = useState<IStaff[]>([]);
  const [conductors, setConductors] = useState<IStaff[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailsTarget, setDetailsTarget] =
    useState<ITripSchedule | null>(null);
  const [editTarget, setEditTarget] =
    useState<ITripSchedule | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<ITripSchedule | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSchedules = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await getTripSchedules();

        if (cancelled) return;

        setSchedules(extractSchedules(response));
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch trip schedules:", error);
        setHasError(true);
        toast.error("Failed to load trip schedules");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadSchedules();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    let cancelled = false;

    const loadScheduleOptions = async () => {
      try {
        setIsLoadingOptions(true);

        const [busResponse, staffResponse] = await Promise.all([
          getOperatorBuses({
            page: 1,
            limit: 100,
            search: "",
            approvalStatus: "APPROVED",
          }),
          getStaffs({
            page: 1,
            limit: 100,
            search: "",
            sortBy: "createdAt",
            sortOrder: "desc",
          }),
        ]);

        if (cancelled) return;

        const busList = extractList<IBus>(busResponse, ["buses"]);

        const staffList = extractList<IStaff>(staffResponse, [
          "staffs",
          "staff",
          "employees",
          "results",
        ]);

        console.log("Staff API response:", staffResponse);
        console.log("Extracted staff list:", staffList);

        const availableBuses = busList.filter(
          (bus) =>
            bus.approvalStatus === "APPROVED" &&
            bus.isActive &&
            !bus.isDeleted,
        );

        const availableDrivers = staffList.filter(
          (staff) =>
            staff.role?.toLowerCase() === "driver" &&
            !staff.isBlocked,
        );

        const availableConductors = staffList.filter(
          (staff) =>
            staff.role?.toLowerCase() === "conductor" &&
            !staff.isBlocked,
        );

        setBuses(availableBuses);
        setDrivers(availableDrivers);
        setConductors(availableConductors);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load buses and staff:", error);

        setBuses([]);
        setDrivers([]);
        setConductors([]);

        toast.error("Failed to load buses and staff");
      } finally {
        if (!cancelled) {
          setIsLoadingOptions(false);
        }
      }
    };

    void loadScheduleOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const handleCreated = () => {
    setCreateOpen(false);
    refresh();
  };

  const handleUpdated = () => {
    setEditTarget(null);
    refresh();
  };

  const handleDeleted = () => {
    setDeleteTarget(null);
    refresh();
  };

  const stats = useMemo(() => {
    const active = schedules.filter(
      (schedule) => schedule.isActive && !schedule.isDeleted,
    ).length;

    const inactive = schedules.filter(
      (schedule) => !schedule.isActive && !schedule.isDeleted,
    ).length;

    return {
      total: schedules.filter((schedule) => !schedule.isDeleted).length,
      active,
      inactive,
    };
  }, [schedules]);

  const columns: Column<ITripSchedule>[] = [
    {
      key: "route",
      header: "Route",
      render: (schedule) => {
        const route = asObject<IScheduleRouteRef>(schedule.routeId);

        if (!route) {
          return (
            <span className="text-slate-400">
              Route unavailable
            </span>
          );
        }

        const origin = getLocationName(route.origin);
        const destination = getLocationName(route.destination);

        return (
          <div>
            <p className="font-medium text-slate-800">
              {route.routeName || route.name || "Unnamed route"}
            </p>

            {(origin || destination) && (
              <p className="mt-0.5 text-xs text-slate-400">
                {origin} → {destination}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "bus",
      header: "Bus",
      render: (schedule) => {
        const bus = asObject<IScheduleBusRef>(schedule.busId);

        if (!bus) {
          return (
            <span className="text-slate-400">
              Bus unavailable
            </span>
          );
        }

        return (
          <div>
            <p className="font-medium text-slate-700">
              {bus.registrationNumber || "—"}
            </p>
            <p className="text-xs text-slate-400">
              {[bus.manufacturer, bus.model]
                .filter(Boolean)
                .join(" ") || "—"}
            </p>
          </div>
        );
      },
    },
    {
      key: "driver",
      header: "Driver",
      render: (schedule) => {
        const driver = asObject<IScheduleStaffRef>(
          schedule.driverId,
        );

        return (
          <span className="text-slate-700">
            {driver?.fullName || driver?.name || "—"}
          </span>
        );
      },
    },
    {
      key: "conductor",
      header: "Conductor",
      render: (schedule) => {
        const conductor = asObject<IScheduleStaffRef>(
          schedule.conductorId,
        );

        return (
          <span className="text-slate-700">
            {conductor?.fullName || conductor?.name || "—"}
          </span>
        );
      },
    },
    {
      key: "departure",
      header: "Departure",
      render: (schedule) => (
        <span className="font-medium text-slate-700">
          {schedule.departureTime || "—"}
        </span>
      ),
    },
    {
      key: "days",
      header: "Operating Days",
      render: (schedule) => (
        <span className="text-slate-600">
          {WEEKDAYS.filter((day) =>
            (schedule.operatingDays ?? []).includes(day.value),
          )
            .map((day) => day.short)
            .join(", ") || "—"}
        </span>
      ),
    },
    {
      key: "period",
      header: "Schedule Period",
      render: (schedule) => (
        <div className="text-xs text-slate-600">
          <p>{formatDate(schedule.startDate)}</p>
          <p className="text-slate-400">
            to {formatDate(schedule.endDate)}
          </p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Ticket Price",
      render: (schedule) => (
        <span className="font-medium text-slate-800">
          ₹{Number(schedule.ticketPrice || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (schedule) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            schedule.isActive
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {schedule.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (schedule) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setDetailsTarget(schedule)}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="View schedule"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setEditTarget(schedule)}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Edit schedule"
            title="Edit schedule"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setDeleteTarget(schedule)}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Delete schedule"
            title="Delete schedule"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Trip Schedule Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create recurring schedules. Individual trips are
              generated automatically for each operating date.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition-colors hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Create Schedule
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Total Schedules
              </p>
              <CalendarDays className="h-5 w-5 text-blue-700" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Active Schedules
              </p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats.active}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Inactive Schedules
              </p>
              <PauseCircle className="h-5 w-5 text-slate-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats.inactive}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-sm font-bold text-slate-900">
              All Schedules
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage your recurring trip schedules here.
            </p>
          </div>

          {hasError && !isLoading ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <p className="text-sm text-slate-500">
                Something went wrong while loading schedules.
              </p>

              <button
                type="button"
                onClick={refresh}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Try again
              </button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={schedules}
              getRowKey={(schedule) => schedule._id}
              loading={isLoading}
              loadingMessage="Loading schedules..."
              emptyMessage="No schedules yet. Create a schedule to start generating trips."
              minWidth="1100px"
            />
          )}
        </div>

        {isLoadingOptions && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Loader2 size={14} className="animate-spin" />
            Loading buses and staff for schedule creation...
          </div>
        )}

        {!isLoadingOptions && (
          <div className="mt-3 text-xs text-slate-500">
            Staff loaded: {drivers.length} drivers and {conductors.length} conductors
          </div>
        )}
      </div>

      <CreateTripScheduleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        buses={buses}
        drivers={drivers}
        conductors={conductors}
        loadingOptions={isLoadingOptions}
      />

      <TripScheduleDetailsModal
        open={!!detailsTarget}
        schedule={detailsTarget}
        onClose={() => setDetailsTarget(null)}
      />

      <EditTripScheduleModal
        open={!!editTarget}
        schedule={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={handleUpdated}
        buses={buses}
        drivers={drivers}
        conductors={conductors}
      />

      <DeleteScheduleModal
        open={!!deleteTarget}
        schedule={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
};

export default TripScheduleManagement;
