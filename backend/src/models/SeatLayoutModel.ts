
import mongoose, {
  Schema,
  HydratedDocument,
} from "mongoose";

import type { ISeatLayout } from "../types/seatLayout";

import {
  seatSchema,
  layoutElementSchema,
  deckSchema,
} from "./schemas/seatLayoutSchemas";

const seatLayoutSchema = new Schema<ISeatLayout>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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

    isActive: {
      type: Boolean,
      default: true,
    },

  },
  {
    timestamps: true,
  }
);

export const SeatLayout = mongoose.model<ISeatLayout>(
  "SeatLayout",
  seatLayoutSchema
);

export type SeatLayoutDocument = HydratedDocument<ISeatLayout>;
