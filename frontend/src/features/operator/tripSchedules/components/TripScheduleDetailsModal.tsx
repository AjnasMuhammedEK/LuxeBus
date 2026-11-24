import {
  X,
  CalendarDays,
  Clock,
  Bus,
  UserRound,
  IndianRupee,
  Route as RouteIcon,
  CalendarCheck,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";

import {
  WEEKDAYS,
  asObject,
  type ITripSchedule,
  type IScheduleRouteRef,
  type IScheduleBusRef,
  type IScheduleStaffRef,
} from "@/types/tripSchedule.types";

interface TripScheduleDetailsModalProps {
  open: boolean;
  schedule: ITripSchedule | null;
  onClose: () => void;
}

const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (time?: string) => {
  if (!time) return "Not available";

  const [hours, minutes] = time.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getReferenceName = (
  value:
    | string
    | IScheduleRouteRef
    | IScheduleBusRef
    | IScheduleStaffRef
    | null
    | undefined,
) => {
  if (!value) return "Not available";

  if (typeof value === "string") return "Reference not populated";

  if ("routeName" in value && value.routeName) {
    return value.routeName;
  }

  if ("registrationNumber" in value) {
    return `${value.registrationNumber} - ${value.manufacturer} ${value.model}`;
  }

  if ("fullName" in value && value.fullName) {
    return value.fullName;
  }

  if ("name" in value && value.name) {
    return value.name;
  }

  return "Not available";
};

const getRouteLocation = (
  value: IScheduleRouteRef["origin"] | IScheduleRouteRef["destination"],
) => {
  if (!value) return "Not available";

  if (typeof value === "string") return value;

  return value.name || "Not available";
};

const TripScheduleDetailsModal = ({
  open,
  schedule,
  onClose,
}: TripScheduleDetailsModalProps) => {
  if (!open || !schedule) return null;

  const route = asObject<IScheduleRouteRef>(schedule.routeId);

  const bus = asObject<IScheduleBusRef>(schedule.busId);

  const driver = asObject<IScheduleStaffRef>(schedule.driverId);

  const conductor = asObject<IScheduleStaffRef>(schedule.conductorId);

  const selectedDays = WEEKDAYS.filter((day) =>
    schedule.operatingDays.includes(day.value),
  );

  const InfoItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3">
      <div className="rounded-lg bg-blue-50 p-2 text-blue-700">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                <CalendarDays size={20} />
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                Trip Schedule Details
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Complete information about this trip schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Schedule ID</p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-gray-800">
                {schedule._id}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                schedule.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {schedule.isActive ? (
                <CheckCircle2 size={14} />
              ) : (
                <PauseCircle size={14} />
              )}

              {schedule.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <RouteIcon size={17} className="text-blue-700" />
                Route Information
              </h3>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="mb-4 text-base font-semibold text-gray-900">
                  {getReferenceName(schedule.routeId)}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full border-2 border-green-600 bg-green-100" />

                    <div>
                      <p className="text-xs text-gray-500">Origin</p>
                      <p className="text-sm font-medium text-gray-800">
                        {getRouteLocation(route?.origin)}
                      </p>
                    </div>
                  </div>

                  <div className="ml-1.5 h-6 border-l-2 border-dashed border-gray-300" />

                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full border-2 border-red-600 bg-red-100" />

                    <div>
                      <p className="text-xs text-gray-500">Destination</p>
                      <p className="text-sm font-medium text-gray-800">
                        {getRouteLocation(route?.destination)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Bus size={17} className="text-blue-700" />
                Bus Information
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Registration Number"
                  value={bus?.registrationNumber ?? "Not populated"}
                  icon={<Bus size={18} />}
                />

                <InfoItem
                  label="Manufacturer"
                  value={bus?.manufacturer ?? "Not populated"}
                  icon={<Bus size={18} />}
                />

                <InfoItem
                  label="Model"
                  value={bus?.model ?? "Not populated"}
                  icon={<Bus size={18} />}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <UserRound size={17} className="text-blue-700" />
                Assigned Staff
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Driver"
                  value={getReferenceName(schedule.driverId)}
                  icon={<UserRound size={18} />}
                />

                <InfoItem
                  label="Conductor"
                  value={getReferenceName(schedule.conductorId)}
                  icon={<UserRound size={18} />}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <CalendarDays size={17} className="text-blue-700" />
                Schedule Timing
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Departure Time"
                  value={formatTime(schedule.departureTime)}
                  icon={<Clock size={18} />}
                />

                <InfoItem
                  label="Start Date"
                  value={formatDate(schedule.startDate)}
                  icon={<CalendarDays size={18} />}
                />

                <InfoItem
                  label="End Date"
                  value={formatDate(schedule.endDate)}
                  icon={<CalendarCheck size={18} />}
                />

                <InfoItem
                  label="Ticket Price"
                  value={`₹${schedule.ticketPrice.toLocaleString("en-IN")}`}
                  icon={<IndianRupee size={18} />}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <CalendarCheck size={17} className="text-blue-700" />
                Operating Days
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedDays.length > 0 ? (
                  selectedDays.map((day) => (
                    <span
                      key={day.value}
                      className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                    >
                      {day.label}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No operating days selected.
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Record Information
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  label="Created At"
                  value={formatDateTime(schedule.createdAt)}
                  icon={<CalendarDays size={18} />}
                />

                <InfoItem
                  label="Last Updated"
                  value={formatDateTime(schedule.updatedAt)}
                  icon={<Clock size={18} />}
                />
              </div>
            </section>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripScheduleDetailsModal;
