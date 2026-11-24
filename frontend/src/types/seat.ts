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