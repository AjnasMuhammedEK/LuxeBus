import mongoose, { Schema, HydratedDocument } from "mongoose";

import type { IBus } from "../types/bus";

import {
  seatSchema,
  layoutElementSchema,
  deckSchema,
} from "./schemas/seatLayoutSchemas";

const seatLayoutSnapshotSchema = new Schema(
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
      enum: ["SEATER", "SLEEPER", "SEATER_CUM_SLEEPER", "HYBRID"],
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
  {
    _id: false,
  },
);

const busSchema = new Schema<IBus>(
  {
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },

    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    manufacturingYear: {
      type: Number,
      required: true,
      min: 1900,
    },

    busType: {
      type: String,
      enum: ["SEATER", "SLEEPER", "SEATER_CUM_SLEEPER", "HYBRID"],
      required: true,
    },

    seatLayoutId: {
      type: Schema.Types.ObjectId,
      ref: "SeatLayout",
      required: true,
    },

    seatLayoutSnapshot: {
      type: seatLayoutSnapshotSchema,
      required: true,
    },

    amenities: {
      type: [
        {
          type: String,
          enum: [
            "AC",
            "WIFI",
            "CHARGING_PORT",
            "WATER_BOTTLE",
            "READING_LIGHT",
          ],
        },
      ],
      default: [],
    },

    documents: {
      rc: {
        type: String,
        required: true,
      },

      fitnessCertificate: {
        type: String,
        required: true,
      },

      insurance: {
        type: String,
        required: true,
      },
    },

    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    rejectReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

busSchema.index({ registrationNumber: 1 }, { unique: true });

export const Bus = mongoose.model<IBus>("Bus", busSchema);

export type BusDocument = HydratedDocument<IBus>;
