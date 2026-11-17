
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db";
import { SeatLayout } from "../models/SeatLayoutModel";

import type {
  BusDeck,
  ILayoutElement,
  ISeat,
  ISeatLayout,
  LayoutElementType,
  SeatType,
} from "../types/seatLayout";



const SLEEPER_COLS = [1, 4, 6];
const SEATER_COLS = [1, 2, 4, 5];

const makeSeat = (
  deck: BusDeck,
  seatNumber: string,
  type: SeatType,
  row: number,
  col: number,
  rowSpan = 1,
  colSpan = 1
): ISeat => ({
  seatId: `${deck}-${seatNumber}`,
  seatNumber,
  type,
  deck,
  row,
  col,
  rowSpan,
  colSpan,
});

const makeElement = (
  deck: BusDeck,
  elementId: string,
  type: LayoutElementType,
  row: number,
  col: number,
  rowSpan = 1,
  colSpan = 1,
  label?: string
): ILayoutElement => ({
  elementId: `${deck}-${elementId}`,
  type,
  deck,
  row,
  col,
  rowSpan,
  colSpan,
  ...(label ? { label } : {}),
});



const generateSleeperSeats = (
  deck: BusDeck,
  prefix: "L" | "U",
  rows: number
): ISeat[] => {
  const seats: ISeat[] = [];

  for (let row = 1; row <= rows; row++) {
    SLEEPER_COLS.forEach((col, index) => {
      seats.push(
        makeSeat(
          deck,
          `${prefix}${(row - 1) * 3 + index + 1}`,
          "SLEEPER",
          row,
          col,
          1,
          2
        )
      );
    });
  }

  return seats;
};

 

const buildSingleDeck2x2 = (options: {
  name: string;
  slug: string;
  busType: ISeatLayout["busType"];
  seatRows: number;
  typeForRow: (row: number) => SeatType;
}): ISeatLayout => {
  const { name, slug, busType, seatRows, typeForRow } = options;

  const totalRows = seatRows + 1;

  const seats: ISeat[] = [];
  let number = 1;

  for (let row = 2; row <= totalRows; row++) {
    SEATER_COLS.forEach((col) => {
      seats.push(
        makeSeat(
          "LOWER",
          String(number),
          typeForRow(row),
          row,
          col
        )
      );

      number++;
    });
  }

  return defineLayout({
    name,
    slug,
    busType,
    decks: [
      {
        name: "LOWER",
        rows: totalRows,
        cols: 5,
      },
    ],
    seats,
    elements: [
      makeElement("LOWER", "door", "DOOR", 1, 1, 1, 2),
      makeElement(
        "LOWER",
        "exit",
        "EMERGENCY_EXIT",
        totalRows,
        3
      ),
    ],
  });
};
   

const validateLayout = (layout: ISeatLayout): void => {
  const ids = new Set<string>();

  for (const deck of layout.decks) {
    const occupied = new Map<string, string>();

    const items = [...layout.seats, ...layout.elements].filter(
      (item) => item.deck === deck.name
    );

    for (const item of items) {
      const id = "seatId" in item ? item.seatId : item.elementId;

      if (ids.has(id)) {
        throw new Error(
          `[${layout.slug}] duplicate id: ${id}`
        );
      }

      ids.add(id);

      if (
        item.row + item.rowSpan - 1 > deck.rows ||
        item.col + item.colSpan - 1 > deck.cols
      ) {
        throw new Error(
          `[${layout.slug}] ${id} is outside the ${deck.name} deck grid`
        );
      }

      for (
        let r = item.row;
        r < item.row + item.rowSpan;
        r++
      ) {
        for (
          let c = item.col;
          c < item.col + item.colSpan;
          c++
        ) {
          const key = `${r}:${c}`;
          const other = occupied.get(key);

          if (other) {
            throw new Error(
              `[${layout.slug}] ${id} overlaps ${other} on ${deck.name} (row ${r}, col ${c})`
            );
          }

          occupied.set(key, id);
        }
      }
    }
  }

  const deckNames = layout.decks.map((deck) => deck.name);

  if (
    layout.seats.some(
      (seat) => !deckNames.includes(seat.deck)
    )
  ) {
    throw new Error(
      `[${layout.slug}] a seat references a deck that is not configured`
    );
  }
};



const defineLayout = (
  layout: Omit<ISeatLayout, "totalCapacity" | "isActive">
): ISeatLayout => {
  const full: ISeatLayout = {
    ...layout,
    totalCapacity: layout.seats.length,
    isActive: true,
  };

  validateLayout(full);

  return full;
};



const sleeper36 = defineLayout({
  name: "36 Berth Sleeper",
  slug: "36-berth-sleeper",
  busType: "SLEEPER",

  decks: [
    { name: "LOWER", rows: 6, cols: 7 },
    { name: "UPPER", rows: 6, cols: 7 },
  ],

  seats: [
    ...generateSleeperSeats("LOWER", "L", 6),
    ...generateSleeperSeats("UPPER", "U", 6),
  ],

  elements: [],
});

// 2. 42 Berth Sleeper

const sleeper42 = defineLayout({
  name: "42 Berth Sleeper",
  slug: "42-berth-sleeper",
  busType: "SLEEPER",

  decks: [
    { name: "LOWER", rows: 7, cols: 7 },
    { name: "UPPER", rows: 7, cols: 7 },
  ],

  seats: [
    ...generateSleeperSeats("LOWER", "L", 7),
    ...generateSleeperSeats("UPPER", "U", 7),
  ],

  elements: [
    makeElement(
      "LOWER",
      "exit",
      "EMERGENCY_EXIT",
      7,
      3
    ),
  ],
});

 

const seaterCumSleeper46 = defineLayout({
  name: "46 Seater cum Sleeper (2+1)",
  slug: "46-seater-cum-sleeper",
  busType: "SEATER_CUM_SLEEPER",

  decks: [
    { name: "LOWER", rows: 12, cols: 7 },
    { name: "UPPER", rows: 12, cols: 7 },
  ],

  seats: (() => {
    const seats: ISeat[] = [];

    // Lower deck: 6 sleepers

    for (let i = 0; i < 6; i++) {
      seats.push(
        makeSeat(
          "LOWER",
          `L${i + 1}`,
          "SLEEPER",
          i * 2 + 1,
          1,
          2,
          2
        )
      );
    }

 

    for (let row = 1; row <= 11; row++) {
      seats.push(
        makeSeat(
          "LOWER",
          String(row * 2 - 1).padStart(2, "0"),
          "SEATER",
          row,
          4,
          1,
          2
        ),
        makeSeat(
          "LOWER",
          String(row * 2).padStart(2, "0"),
          "SEATER",
          row,
          6,
          1,
          2
        )
      );
    }
 

    for (let group = 0; group < 6; group++) {
      SLEEPER_COLS.forEach((col, index) => {
        seats.push(
          makeSeat(
            "UPPER",
            `U${group * 3 + index + 1}`,
            "SLEEPER",
            group * 2 + 1,
            col,
            2,
            2
          )
        );
      });
    }

    return seats;
  })(),

  elements: [
    makeElement(
      "LOWER",
      "exit",
      "EMERGENCY_EXIT",
      12,
      6,
      1,
      2
    ),
  ],
});

 

const seater40 = buildSingleDeck2x2({
  name: "40 Seater (2+2)",
  slug: "40-seater-2x2",
  busType: "SEATER",
  seatRows: 10,
  typeForRow: () => "SEATER",
});

 

const semiSleeper36 = buildSingleDeck2x2({
  name: "36 Semi-Sleeper (2+2)",
  slug: "36-semi-sleeper-2x2",
  busType: "SEATER",
  seatRows: 9,
  typeForRow: () => "SEMI_SLEEPER",
});

 

const seatLayouts: ISeatLayout[] = [
  sleeper36,
  sleeper42,
  seaterCumSleeper46,
  seater40,
  semiSleeper36,
];

 
const seedSeatLayouts = async (): Promise<void> => {
  try {
    await connectDB();

    const allowedSlugs = seatLayouts.map(
      (layout) => layout.slug
    );

    
    await SeatLayout.updateMany(
      { slug: { $nin: allowedSlugs } },
      { $set: { isActive: false } }
    );

    for (const layout of seatLayouts) {
      const { slug, isActive, ...fields } = layout;

      const result = await SeatLayout.updateOne(
        { slug },
        {
          $set: fields,
          $setOnInsert: { isActive },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(
          `Inserted: ${layout.name} (${layout.totalCapacity})`
        );
      } else if (result.modifiedCount > 0) {
        console.log(
          `Updated: ${layout.name} (${layout.totalCapacity})`
        );
      } else {
        console.log(`Unchanged: ${layout.name}`);
      }
    }

    console.log("Seat layout seeding completed");
  } catch (error) {
    console.error("Seat layout seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void seedSeatLayouts();
