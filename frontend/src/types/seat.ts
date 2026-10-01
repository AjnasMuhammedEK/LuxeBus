// // export type SeatType =
// //   | "seater"
// //   | "semi-sleeper"
// //   | "sleeper";

// // export type Deck =
// //   | "lower"
// //   | "upper";

// // export type SeatStatus =
// //   | "available"
// //   | "held"
// //   | "booked"
// //   | "blocked";

// // export interface SeatPosition {
// //   row: number;
// //   col: number;
// // }

// // // export interface Seat {
// // //   seatNumber: string;

// // //   seatType: SeatType;

// // //   deck: Deck;

// // //   position: SeatPosition;

// // //   basePrice: number;

// // //   width?: number;

// // //   height?: number;

// // //   status?: SeatStatus;
// // // }

// // // types/seat.ts
// // export type SeatBlock = "main" | "side";

// // export interface Seat {
// //   seatNumber: string;
// //   seatType: SeatType;
// //   deck: Deck;
// //   block: SeatBlock;        // NEW: "main" (paired berth) or "side" (single berth)
// //   position: SeatPosition;  // row/col within its own block
// //   basePrice: number;
// //   width?: number;
// //   height?: number;
// //   status?: SeatStatus;
// // }


// export type SeatType = "seater" | "semi-sleeper" | "sleeper";
// export type Deck = "lower" | "upper";
// export type SeatStatus = "available" | "held" | "booked" | "blocked";
// export type SeatBlock = "main" | "side";

// export interface SeatPosition {
//   row: number;
//   col: number;
// }

// export interface Seat {
//   seatNumber: string;
//   seatType: SeatType;
//   deck: Deck;
//   block: SeatBlock;
//   position: SeatPosition;
//   basePrice: number;
//   status?: SeatStatus;
// }










export type SeatType = "seater" | "semi-sleeper" | "sleeper";
export type Deck = "lower" | "upper";
export type SeatStatus = "available" | "held" | "booked" | "blocked";
export type SeatBlock = "main" | "side";

export interface SeatPosition {
  row: number;
  col: number;
}

export interface Seat {
  seatNumber: string;
  seatType: SeatType;
  deck: Deck;
  block: SeatBlock;
  position: SeatPosition;
  basePrice: number;
  status?: SeatStatus;
}