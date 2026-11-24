
import { Schema } from "mongoose";

import type {
  ISeat,
  ILayoutElement,
  IDeckConfig,
} from "../../types/seatLayout";

 
export const seatSchema = new Schema<ISeat>(
  {
    seatId: {
      type: String,
      required: true,
      trim: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
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
      min: 1,
    },

    col: {
      type: Number,
      required: true,
      min: 1,
    },

    rowSpan: {
      type: Number,
      required: true,
      min: 1,
    },

    colSpan: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);
 
export const layoutElementSchema = new Schema<ILayoutElement>(
  {
    elementId: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "DRIVER",
        "TOILET",
        "STAIRCASE",
        "DOOR",
        "EMERGENCY_EXIT",
      ],
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
      min: 1,
    },

    col: {
      type: Number,
      required: true,
      min: 1,
    },

    rowSpan: {
      type: Number,
      required: true,
      min: 1,
    },

    colSpan: {
      type: Number,
      required: true,
      min: 1,
    },

    label: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);
  
export const deckSchema = new Schema<IDeckConfig>(
  {
    name: {
      type: String,
      enum: ["LOWER", "UPPER"],
      required: true,
    },

    rows: {
      type: Number,
      required: true,
      min: 1,
    },

    cols: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);
