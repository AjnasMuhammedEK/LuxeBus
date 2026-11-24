
export type BusDeck = "LOWER" | "UPPER";

 
export type BusType =
  | "SEATER"
  | "SLEEPER"
  | "SEATER_CUM_SLEEPER"
  | "HYBRID";

 
export type SeatType =
  | "SLEEPER"
  | "SEMI_SLEEPER"
  | "SEATER";

 
export type LayoutElementType =
  | "DRIVER"
  | "TOILET"
  | "STAIRCASE"
  | "DOOR"
  | "EMERGENCY_EXIT";

 
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

 
export interface IDeckConfig {
  name: BusDeck;

  rows: number;
  cols: number;
}
 
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
