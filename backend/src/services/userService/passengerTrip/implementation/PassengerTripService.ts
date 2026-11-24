import { inject, injectable } from "inversify";
import { TYPES } from "../../../../DI/types";
import type { ITrip } from "../../../../types/trip";
import type { IPassengerTripRepository } from "../../../../repositories/passengerTrip/interfaces/IPassengerTripRepository";
import type { IPassengerTripService } from "../interfaces/IPassengerTripService";
import type { IPassengerTripSearchQuery } from "../../../../repositories/passengerTrip/interfaces/IPassengerTripRepository";

@injectable()
export class PassengerTripService implements IPassengerTripService {
  constructor(
    @inject(TYPES.PassengerTripRepository)
    private _passengerTripRepository: IPassengerTripRepository
  ) {}

  async getUpcomingTrips(): Promise<ITrip[]> {
    return this._passengerTripRepository.getUpcomingTrips();
  }

  async searchTrips(query: IPassengerTripSearchQuery): Promise<ITrip[]> {
    return this._passengerTripRepository.searchTrips(query);
  }
}