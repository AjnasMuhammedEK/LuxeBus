import mongoose, {
  Schema,
  HydratedDocument,
} from "mongoose";

import type {
  ITrip,
  ITripSeat,
} from "../types/trip";

import {
  seatSchema,
  layoutElementSchema,
  deckSchema,
} from "./schemas/seatLayoutSchemas";

 

const tripLocationSnapshotSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    placeId: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const tripStopSnapshotSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    placeId: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    isBoardingPoint: {
      type: Boolean,
      required: true,
    },

    isDroppingPoint: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
);

const tripRouteSnapshotSchema = new Schema(
  {
    routeName: {
      type: String,
      required: true,
    },

    origin: {
      type: tripLocationSnapshotSchema,
      required: true,
    },

    destination: {
      type: tripLocationSnapshotSchema,
      required: true,
    },

    stops: {
      type: [tripStopSnapshotSchema],
      default: [],
    },

    distanceInMeters: {
      type: Number,
      required: true,
    },

    estimatedDurationInSeconds: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

 

const tripSeatLayoutSnapshotSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    busType: {
      type: String,
      enum: [
        "SEATER",
        "SLEEPER",
        "SEATER_CUM_SLEEPER",
        "HYBRID",
      ],
      required: true,
    },

    totalCapacity: {
      type: Number,
      required: true,
      min: 1,
    },

    decks: {
      type: [deckSchema],
      required: true,
    },

    seats: {
      type: [seatSchema],
      required: true,
    },

    elements: {
      type: [layoutElementSchema],
      default: [],
    },
  },
  { _id: false },
);

const tripBusSnapshotSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
    },

    busType: {
      type: String,
      enum: [
        "SEATER",
        "SLEEPER",
        "SEATER_CUM_SLEEPER",
        "HYBRID",
      ],
      required: true,
    },

    seatLayoutSnapshot: {
      type: tripSeatLayoutSnapshotSchema,
      required: true,
    },
  },
  { _id: false },
);

 

const tripStaffSnapshotSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["driver", "conductor"],
      required: true,
    },
  },
  { _id: false },
);

 

const tripSeatSchema = new Schema<ITripSeat>(
  {
    seatId: {
      type: String,
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["SLEEPER", "SEMI_SLEEPER", "SEATER"],
      required: true,
    },

    deck: {
      type: String,
      enum: ["LOWER", "UPPER"],
      required: true,
    },

    row: {
      type: Number,
      required: true,
    },

    col: {
      type: Number,
      required: true,
    },

    rowSpan: {
      type: Number,
      required: true,
    },

    colSpan: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "LOCKED", "BOOKED"],
      default: "AVAILABLE",
      required: true,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { _id: false },
);

 
const tripSchema = new Schema<ITrip>(
  {
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },

    tripScheduleId: {
      type: Schema.Types.ObjectId,
      ref: "TripSchedule",
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

    tripDate: {
      type: String,
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    departureAt: {
      type: Date,
      required: true,
    },

    arrivalAt: {
      type: Date,
      required: true,
    },

    routeSnapshot: {
      type: tripRouteSnapshotSchema,
      required: true,
    },

    busSnapshot: {
      type: tripBusSnapshotSchema,
      required: true,
    },

    driverSnapshot: {
      type: tripStaffSnapshotSchema,
      required: true,
    },

    conductorSnapshot: {
      type: tripStaffSnapshotSchema,
      required: true,
    },

    
    seats: {
      type: [tripSeatSchema],
      required: true,
      default: [],
    },

    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "SCHEDULED",
    },
  },
  {
    timestamps: true,
  },
);

 
tripSchema.index(
  {
    tripScheduleId: 1,
    tripDate: 1,
  },
  {
    unique: true,
  },
);

tripSchema.index({
  operatorId: 1,
  departureAt: 1,
});

tripSchema.index({
  busId: 1,
  departureAt: 1,
  arrivalAt: 1,
});

tripSchema.index({
  driverId: 1,
  departureAt: 1,
  arrivalAt: 1,
});

tripSchema.index({
  conductorId: 1,
  departureAt: 1,
  arrivalAt: 1,
});

export const Trip = mongoose.model<ITrip>(
  "Trip",
  tripSchema,
);

export type TripDocument = HydratedDocument<ITrip>;