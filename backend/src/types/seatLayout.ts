
export type BusDeck = "LOWER" | "UPPER";

// Overall bus configuration
export type BusType =
  | "SEATER"
  | "SLEEPER"
  | "SEATER_CUM_SLEEPER"
  | "HYBRID";

// Individual passenger seat / berth category
export type SeatType =
  | "SLEEPER"
  | "SEMI_SLEEPER"
  | "SEATER";

// Non-passenger layout elements
export type LayoutElementType =
  | "DRIVER"
  | "TOILET"
  | "STAIRCASE"
  | "DOOR"
  | "EMERGENCY_EXIT";

// Individual seat or berth
export interface ISeat {
  seatId: string;
  seatNumber: string;

  type: SeatType;
  deck: BusDeck;

  row: number;
  col: number;

  rowSpan: number;
  colSpan: number;
}

// Elements such as driver, door, toilet and staircase
export interface ILayoutElement {
  elementId: string;
  type: LayoutElementType;

  deck: BusDeck;

  row: number;
  col: number;

  rowSpan: number;
  colSpan: number;

  label?: string;
}

// Configuration for each bus deck
export interface IDeckConfig {
  name: BusDeck;

  rows: number;
  cols: number;
}

// Complete predefined seat layout
export interface ISeatLayout {
  name: string;
  slug: string;

  busType: BusType;

  totalCapacity: number;

  decks: IDeckConfig[];

  seats: ISeat[];

  elements: ILayoutElement[];

  isActive: boolean;
 
}
