import mongoose, { Schema, HydratedDocument } from "mongoose";
import type { IRoute } from "../types/route";

const routeLocationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    placeId: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  {
    _id: false,
  },
);

const routeStopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    placeId: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    isBoardingPoint: {
      type: Boolean,
      default: false,
    },

    isDroppingPoint: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const routeSchema = new Schema<IRoute>(
  {
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },

    routeName: {
      type: String,
      required: true,
      trim: true,
    },

    origin: {
      type: routeLocationSchema,
      required: true,
    },

    destination: {
      type: routeLocationSchema,
      required: true,
    },

    stops: {
      type: [routeStopSchema],
      default: [],
    },

    distanceInMeters: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedDurationInSeconds: {
      type: Number,
      required: true,
      min: 1,
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

routeSchema.index({ operatorId: 1, isDeleted: 1 });

export const Route = mongoose.model<IRoute>("Route", routeSchema);

export type RouteDocument = HydratedDocument<IRoute>;