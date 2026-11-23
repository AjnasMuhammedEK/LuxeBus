
import { z } from "zod";

const routeLocationSchema = z.object({
  name: z.string().trim().min(2, "Location name is required"),
  address: z.string().trim().min(3, "Address is required"),
  placeId: z.string().trim().min(1, "Please select a valid map location"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const routeStopSchema = routeLocationSchema.extend({
  order: z.number().int().min(1),
  isBoardingPoint: z.boolean(),
  isDroppingPoint: z.boolean(),
});

export const createRouteSchema = z.object({
  routeName: z
    .string()
    .trim()
    .min(3, "Route name must contain at least 3 characters")
    .max(100, "Route name is too long"),

  origin: routeLocationSchema,

  destination: routeLocationSchema,

  stops: z.array(routeStopSchema),

  distanceInMeters: z
    .number()
    .positive("Route distance must be greater than zero"),

  estimatedDurationInSeconds: z
    .number()
    .positive("Estimated duration must be greater than zero"),
}).superRefine((data, ctx) => {
  if (data.origin.placeId === data.destination.placeId) {
    ctx.addIssue({
      code: "custom",
      path: ["destination"],
      message: "Origin and destination cannot be the same",
    });
  }

  const orders = data.stops.map((stop) => stop.order);

  if (new Set(orders).size !== orders.length) {
    ctx.addIssue({
      code: "custom",
      path: ["stops"],
      message: "Stop order must be unique",
    });
  }

  if (data.stops.some((stop) => stop.placeId === data.origin.placeId)) {
    ctx.addIssue({
      code: "custom",
      path: ["stops"],
      message: "Origin should not be added again as an intermediate stop",
    });
  }

  if (data.stops.some((stop) => stop.placeId === data.destination.placeId)) {
    ctx.addIssue({
      code: "custom",
      path: ["stops"],
      message: "Destination should not be added again as an intermediate stop",
    });
  }
});

export type CreateRouteSchema = z.infer<typeof createRouteSchema>;
export { routeLocationSchema, routeStopSchema };
