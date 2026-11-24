
import { useState } from "react";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import { deleteTripSchedule } from "../service/tripScheduleService";

import {
  asObject,
  type ITripSchedule,
  type IScheduleRouteRef,
} from "@/types/tripSchedule.types";

interface DeleteTripScheduleModalProps {
  open: boolean;
  schedule: ITripSchedule | null;
  onClose: () => void;
  onDeleted: () => void;
}

const getRouteName = (schedule: ITripSchedule) => {
  const route = asObject<IScheduleRouteRef>(schedule.routeId);

  if (route?.routeName) {
    return route.routeName;
  }

  return "Selected route";
};

const DeleteTripScheduleModal = ({
  open,
  schedule,
  onClose,
  onDeleted,
}: DeleteTripScheduleModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!open || !schedule) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteTripSchedule(schedule._id);

      toast.success("Trip schedule deleted successfully");

      onDeleted();
      onClose();
    } catch (error) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(
        apiError.response?.data?.message ??
          "Failed to delete trip schedule",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Trip Schedule
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-6">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 size={26} />
          </div>

          <h3 className="text-center text-base font-semibold text-gray-900">
            Are you sure you want to delete this schedule?
          </h3>

          <p className="mt-2 text-center text-sm text-gray-500">
            You are about to delete the following trip schedule.
          </p>

          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Route</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {getRouteName(schedule)}
                </p>
              </div>

              <div className="border-t border-gray-200" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Departure</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {schedule.departureTime}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Ticket Price</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    ₹{schedule.ticketPrice.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {schedule.startDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {schedule.endDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <p className="text-xs leading-5 text-amber-800">
              Deleting this schedule will not delete already-generated
              individual trips. Those trips will remain available for
              their existing management and booking lifecycle.
            </p>
          </div>

        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Schedule
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteTripScheduleModal;
