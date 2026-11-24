
import type {
  ITripRouteSnapshot,
  ITripBusSnapshot,
  TripStatus,
} from "./trip";

export interface IPassengerTrip {
  _id: string;
  tripDate: string;
  departureTime: string;
  departureAt: Date;
  arrivalAt: Date;
  routeSnapshot: ITripRouteSnapshot;
  busSnapshot: ITripBusSnapshot;
  ticketPrice: number;
  status: TripStatus;
  availableSeats: number;
  totalSeats: number;
}

export interface IPassengerTripListResponse {
  trips: IPassengerTrip[];
  total: number;
  totalPages: number;
  currentPage: number;
}
