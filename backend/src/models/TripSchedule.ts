
import mongoose, { Schema, HydratedDocument } from "mongoose";

import { ITripSchedule } from "../types/tripSchedule";

const tripScheduleSchema = new Schema(
  {
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },

    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },

    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    conductorId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    operatingDays: {
      type: [Number],
      required: true,
    },

    ticketPrice: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

tripScheduleSchema.index({
  operatorId: 1,
  isDeleted: 1,
  startDate: 1,
  endDate: 1,
});

export const TripSchedule = mongoose.model<ITripSchedule>(
  "TripSchedule",
  tripScheduleSchema,
);

export type TripScheduleDocument = HydratedDocument<ITripSchedule>;
