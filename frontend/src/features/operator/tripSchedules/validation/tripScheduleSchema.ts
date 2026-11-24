
import { z } from "zod";

const operatingDaySchema = z
  .number()
  .int("Invalid operating day")
  .min(0, "Invalid operating day")
  .max(6, "Invalid operating day");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value: string): boolean => {
  if (!dateRegex.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const tripScheduleSchema = z
  .object({
    routeId: z
      .string()
      .min(1, "Please select a route"),

    busId: z
      .string()
      .min(1, "Please select a bus"),

    driverId: z
      .string()
      .min(1, "Please select a driver"),

    conductorId: z
      .string()
      .min(1, "Please select a conductor"),

    departureTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Please enter a valid departure time",
      ),

    startDate: z
      .string()
      .min(1, "Please select a start date")
      .regex(dateRegex, "Invalid start date"),

    endDate: z
      .string()
      .min(1, "Please select an end date")
      .regex(dateRegex, "Invalid end date"),

    operatingDays: z
      .array(operatingDaySchema)
      .min(1, "Select at least one operating day")
      .max(7, "Invalid operating days")
      .refine(
        (days) => new Set(days).size === days.length,
        "Duplicate operating days are not allowed",
      ),

    ticketPrice: z
      .number({
        error: "Please enter a valid ticket price",
      })
      .finite("Enter a valid ticket price")
      .positive("Ticket price must be greater than zero")
      .max(100000, "Ticket price cannot exceed ₹1,00,000"),
  })
  .superRefine((data, ctx) => {
    const validStartDate = isValidDate(data.startDate);
    const validEndDate = isValidDate(data.endDate);

    if (data.startDate && dateRegex.test(data.startDate) && !validStartDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Please enter a valid start date",
      });
    }

    if (data.endDate && dateRegex.test(data.endDate) && !validEndDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Please enter a valid end date",
      });
    }

    if (validStartDate && data.startDate < getTodayDate()) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date cannot be in the past",
      });
    }

    if (validStartDate && validEndDate) {
      if (data.endDate < data.startDate) {
        ctx.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "End date must be after or equal to start date",
        });
      }
    }
  });

export type TripScheduleFormValues = z.infer<
  typeof tripScheduleSchema
>;
