export type TripStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type TripSeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED";

export interface IPassengerTripLocation {
  name: string;
  address: string;
  placeId: string;
  latitude: number;
  longitude: number;
}

export interface IPassengerTripStop extends IPassengerTripLocation {
  order: number;
  isBoardingPoint: boolean;
  isDroppingPoint: boolean;
}

export interface IPassengerTripSeat {
  seatId: string;
  seatNumber: string;
  type: "SLEEPER" | "SEMI_SLEEPER" | "SEATER";
  deck: "LOWER" | "UPPER";
  status: TripSeatStatus;
}

export interface IPassengerTrip {
  _id: string;
  tripDate: string;
  departureTime: string;
  departureAt: string;
  arrivalAt: string;
  ticketPrice: number;
  status: TripStatus;
  routeSnapshot: {
    routeName: string;
    origin: IPassengerTripLocation;
    destination: IPassengerTripLocation;
    stops: IPassengerTripStop[];
    distanceInMeters: number;
    estimatedDurationInSeconds: number;
  };
  busSnapshot: {
    manufacturer: string;
    model: string;
    registrationNumber: string;
    busType: string;
    seatLayoutSnapshot: {
      name: string;
      totalCapacity: number;
    };
  };
  seats: IPassengerTripSeat[];
}