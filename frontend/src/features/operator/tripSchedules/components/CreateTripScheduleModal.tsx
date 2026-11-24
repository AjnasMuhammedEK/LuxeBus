
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, CalendarDays, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { createTripSchedule } from "../service/tripScheduleService";
import { getOperatorRoutes } from "../../routes/service/routeService";

import {
  tripScheduleSchema,
  type TripScheduleFormValues,
} from "../validation/tripScheduleSchema";

import {
  WEEKDAYS,
  type OperatingDay,
  type ICreateTripScheduleDTO,
} from "@/types/tripSchedule.types";

import type { IRoute } from "@/types/route.types";
import type { IBus } from "@/types/fleet.types";
import type { IStaff } from "@/types/staff.types";

interface CreateTripScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  buses: IBus[];
  drivers: IStaff[];
  conductors: IStaff[];
  loadingOptions: boolean;
}

const defaultValues: TripScheduleFormValues = {
  routeId: "",
  busId: "",
  driverId: "",
  conductorId: "",
  departureTime: "",
  startDate: "",
  endDate: "",
  operatingDays: [],
  ticketPrice: 0,
};

const extractRoutes = (response: unknown): IRoute[] => {
  if (Array.isArray(response)) {
    return response as IRoute[];
  }

  if (typeof response !== "object" || response === null) {
    return [];
  }

  const root = response as Record<string, unknown>;

  const candidates: unknown[] = [
    root.routes,
    root.data,
    root.schedules,
  ];

  if (typeof root.data === "object" && root.data !== null) {
    const data = root.data as Record<string, unknown>;

    candidates.push(data.routes, data.data);

    if (typeof data.data === "object" && data.data !== null) {
      const nestedData = data.data as Record<string, unknown>;
      candidates.push(nestedData.routes);
    }
  }

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as IRoute[];
    }

    if (typeof candidate === "object" && candidate !== null) {
      const nested = candidate as Record<string, unknown>;

      if (Array.isArray(nested.routes)) {
        return nested.routes as IRoute[];
      }
    }
  }

  return [];
};

const getApiErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = error.response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = response.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string" &&
        data.message.trim()
      ) {
        return data.message;
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to create trip schedule. Please try again.";
};

const CreateTripScheduleModal = ({
  open,
  onClose,
  onCreated,
  buses,
  drivers,
  conductors,
  loadingOptions,
}: CreateTripScheduleModalProps) => {
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripScheduleFormValues>({
    resolver: zodResolver(tripScheduleSchema),
    defaultValues,
  });

  const selectedDays = watch("operatingDays") ?? [];

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const fetchRoutes = async () => {
      try {
        setLoadingRoutes(true);
        setRoutes([]);

        const response = await getOperatorRoutes({
          page: 1,
          limit: 100,
        });

        const routeData = extractRoutes(response);

        if (!cancelled) {
          setRoutes(routeData);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setRoutes([]);
          toast.error(getApiErrorMessage(error) || "Failed to load routes");
        }
      } finally {
        if (!cancelled) {
          setLoadingRoutes(false);
        }
      }
    };

    void fetchRoutes();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const handleDayToggle = (day: OperatingDay) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((item) => item !== day)
      : [...selectedDays, day];

    setValue("operatingDays", updatedDays, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;

    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: TripScheduleFormValues) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const payload: ICreateTripScheduleDTO = {
        routeId: values.routeId,
        busId: values.busId,
        driverId: values.driverId,
        conductorId: values.conductorId,
        departureTime: values.departureTime,
        startDate: values.startDate,
        endDate: values.endDate,
        operatingDays: values.operatingDays as OperatingDay[],
        ticketPrice: values.ticketPrice,
      };

      await createTripSchedule(payload);

      toast.success("Trip schedule created successfully");

      reset(defaultValues);
      onCreated();
      onClose();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700";

  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
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
                Create Trip Schedule
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Configure a recurring bus trip schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-y-auto px-5 py-5 sm:px-6">
            {loadingRoutes ? (
              <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-gray-500">
                <Loader2 className="animate-spin" size={28} />
                <p className="text-sm">Loading routes...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Trip Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Route *</label>

                      <select
                        {...register("routeId")}
                        className={inputClass}
                        disabled={isSubmitting}
                      >
                        <option value="">Select route</option>

                        {routes.map((route) => (
                          <option key={route._id} value={route._id}>
                            {route.routeName}
                          </option>
                        ))}
                      </select>

                      {errors.routeId && (
                        <p className={errorClass}>
                          {errors.routeId.message}
                        </p>
                      )}

                      {routes.length === 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          No routes available. Create a route before
                          creating a schedule.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Bus *</label>

                      <select
                        {...register("busId")}
                        className={inputClass}
                        disabled={isSubmitting || loadingOptions}
                      >
                        <option value="">
                          {loadingOptions ? "Loading buses..." : "Select bus"}
                        </option>

                        {buses.map((bus) => (
                          <option key={bus._id} value={bus._id}>
                            {bus.registrationNumber} - {bus.manufacturer}{" "}
                            {bus.model}
                          </option>
                        ))}
                      </select>

                      {errors.busId && (
                        <p className={errorClass}>
                          {errors.busId.message}
                        </p>
                      )}

                      {!loadingOptions && buses.length === 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          No approved and active buses available for
                          scheduling.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Driver *</label>

                      <select
                        {...register("driverId")}
                        className={inputClass}
                        disabled={isSubmitting || loadingOptions}
                      >
                        <option value="">
                          {loadingOptions ? "Loading drivers..." : "Select driver"}
                        </option>

                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.fullName}
                          </option>
                        ))}
                      </select>

                      {errors.driverId && (
                        <p className={errorClass}>
                          {errors.driverId.message}
                        </p>
                      )}

                      {!loadingOptions && drivers.length === 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          No drivers available.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Conductor *</label>

                      <select
                        {...register("conductorId")}
                        className={inputClass}
                        disabled={isSubmitting || loadingOptions}
                      >
                        <option value="">
                          {loadingOptions
                            ? "Loading conductors..."
                            : "Select conductor"}
                        </option>

                        {conductors.map((conductor) => (
                          <option key={conductor._id} value={conductor._id}>
                            {conductor.fullName}
                          </option>
                        ))}
                      </select>

                      {errors.conductorId && (
                        <p className={errorClass}>
                          {errors.conductorId.message}
                        </p>
                      )}

                      {!loadingOptions && conductors.length === 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          No conductors available.
                        </p>
                      )}
                    </div>
                  </div>

                  {loadingOptions && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                      <Loader2 size={14} className="animate-spin" />
                      Loading buses and staff...
                    </div>
                  )}
                </section>

                <div className="border-t border-gray-100" />

                <section>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Schedule Timing
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className={labelClass}>
                        Departure Time *
                      </label>

                      <input
                        type="time"
                        {...register("departureTime")}
                        className={inputClass}
                        disabled={isSubmitting}
                      />

                      {errors.departureTime && (
                        <p className={errorClass}>
                          {errors.departureTime.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Start Date *</label>

                      <input
                        type="date"
                        {...register("startDate")}
                        className={inputClass}
                        disabled={isSubmitting}
                      />

                      {errors.startDate && (
                        <p className={errorClass}>
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>End Date *</label>

                      <input
                        type="date"
                        {...register("endDate")}
                        className={inputClass}
                        disabled={isSubmitting}
                      />

                      {errors.endDate && (
                        <p className={errorClass}>
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-100" />

                <section>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">
                    Operating Days *
                  </h3>

                  <p className="mb-4 text-xs text-gray-500">
                    Select the days this schedule should operate.
                  </p>

                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                    {WEEKDAYS.map((day) => {
                      const selected = selectedDays.includes(day.value);

                      return (
                        <button
                          key={day.value}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDayToggle(day.value)}
                          className={`rounded-lg border px-2 py-3 text-sm font-medium transition ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {day.short}
                        </button>
                      );
                    })}
                  </div>

                  {errors.operatingDays && (
                    <p className={errorClass}>
                      {errors.operatingDays.message}
                    </p>
                  )}
                </section>

                <div className="border-t border-gray-100" />

                <section>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Ticket Pricing
                  </h3>

                  <div className="max-w-sm">
                    <label className={labelClass}>
                      Ticket Price (₹) *
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="100000"
                      step="0.01"
                      placeholder="Enter ticket price"
                      {...register("ticketPrice", {
                        valueAsNumber: true,
                      })}
                      className={inputClass}
                      disabled={isSubmitting}
                    />

                    {errors.ticketPrice && (
                      <p className={errorClass}>
                        {errors.ticketPrice.message}
                      </p>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || loadingRoutes || loadingOptions}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Create Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripScheduleModal;
