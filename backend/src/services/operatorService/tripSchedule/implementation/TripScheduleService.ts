
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../DI/types";

import { ITripScheduleService } from "../interfaces/ITripScheduleService";

import { ITripScheduleRepository } from "../../../../repositories/tripSchedule/interfaces/ITripScheduleRepository";
import { ITripRepository } from "../../../../repositories/trip/interfaces/ITripRepository";  
import { IBusRepository } from "../../../../repositories/Operator/bus/interfaces/IBusRepository";
import { IStaffRepository } from "../../../../repositories/syaffRepository/interface/IStaffRepository";
import { IRouteRepository } from "../../../../repositories/route/interfaces/IRouteRepository";

import {
  ITripSchedule,
  ICreateTripScheduleDTO,
  OperatingDay,
} from "../../../../types/tripSchedule";

import { ITrip } from "../../../../types/trip";
import { IRoute } from "../../../../types/route";
import { IBus } from "../../../../types/bus";
import { IStaff } from "../../../../types/staff";

type ITripDraft = Omit<ITrip, "tripScheduleId">;

@injectable()
export class TripScheduleService implements ITripScheduleService {
  constructor(
    @inject(TYPES.TripScheduleRepository)
    private _tripScheduleRepository: ITripScheduleRepository,

    @inject(TYPES.TripRepository)
    private _tripRepository: ITripRepository,

    @inject(TYPES.RouteRepository)
    private _routeRepository: IRouteRepository,

    @inject(TYPES.BusRepository)
    private _busRepository: IBusRepository,

    @inject(TYPES.StaffRepository)
    private _staffRepository: IStaffRepository,
  ) {}

  async createSchedule(
    operatorId: string,
    data: ICreateTripScheduleDTO,
  ): Promise<ITripSchedule> {
    this.validateObjectId(operatorId, "Invalid operator ID");

    this.validateScheduleData(data);

    const operatorObjectId = new Types.ObjectId(operatorId);

    const [route, bus, driver, conductor] = await Promise.all([
      this._routeRepository.findRouteById(data.routeId, operatorId),

      this._busRepository.findBusById(data.busId),

      this._staffRepository.findStaffByIdAndOperator(
        data.driverId,
        operatorObjectId,
      ),

      this._staffRepository.findStaffByIdAndOperator(
        data.conductorId,
        operatorObjectId,
      ),
    ]);

    this.validateRoute(route, operatorId);
    this.validateBus(bus, operatorId);

    this.validateStaff(driver, "driver", operatorId);
    this.validateStaff(conductor, "conductor", operatorId);

    if (String(driver._id) === String(conductor._id)) {
      throw new Error("Driver and conductor must be different staff members");
    }

    const tripDates = this.getOperatingDates(
      data.startDate,
      data.endDate,
      data.operatingDays,
    );

    if (tripDates.length === 0) {
      throw new Error("No operating dates found in the selected date range");
    }

    if (tripDates.length > 180) {
      throw new Error(
        "A maximum of 180 trips can be generated in one schedule",
      );
    }

    const tripDrafts = this.buildTrips(
      operatorId,
      route,
      bus,
      driver,
      conductor,
      data,
      tripDates,
    );

    await this.validateTripConflicts(operatorId, tripDrafts);

    const scheduleData: ITripSchedule = {
      operatorId: operatorObjectId,
      routeId: new Types.ObjectId(data.routeId),
      busId: new Types.ObjectId(data.busId),
      driverId: new Types.ObjectId(data.driverId),
      conductorId: new Types.ObjectId(data.conductorId),
      departureTime: data.departureTime,
      startDate: data.startDate,
      endDate: data.endDate,
      operatingDays: data.operatingDays,
      ticketPrice: data.ticketPrice,
      isActive: true,
      isDeleted: false,
    };

    const schedule =
      await this._tripScheduleRepository.createSchedule(scheduleData);

    if (!schedule._id) {
      throw new Error("Unable to create trip schedule");
    }

    for (const tripDraft of tripDrafts) {
      const trip: ITrip = {
        ...tripDraft,
        tripScheduleId: schedule._id,
      };

      await this._tripRepository.createTrip(trip);
    }

    return schedule;
  }

  async getSchedules(operatorId: string): Promise<ITripSchedule[]> {
    this.validateObjectId(operatorId, "Invalid operator ID");

    return await this._tripScheduleRepository.getSchedulesByOperator(
      new Types.ObjectId(operatorId),
    );
  }

  async getScheduleById(
    scheduleId: string,
    operatorId: string,
  ): Promise<ITripSchedule> {
    this.validateObjectId(scheduleId, "Invalid schedule ID");
    this.validateObjectId(operatorId, "Invalid operator ID");

    const schedule =
      await this._tripScheduleRepository.findScheduleById(
        scheduleId,
        new Types.ObjectId(operatorId),
      );

    if (!schedule) {
      throw new Error("Trip schedule not found");
    }

    return schedule;
  }

  async updateSchedule(
    scheduleId: string,
    operatorId: string,
    data: Partial<ICreateTripScheduleDTO>,
  ): Promise<ITripSchedule> {
    this.validateObjectId(scheduleId, "Invalid schedule ID");
    this.validateObjectId(operatorId, "Invalid operator ID");

    const existingSchedule =
      await this._tripScheduleRepository.findScheduleById(
        scheduleId,
        new Types.ObjectId(operatorId),
      );

    if (!existingSchedule) {
      throw new Error("Trip schedule not found");
    }

    if (!existingSchedule.isActive || existingSchedule.isDeleted) {
      throw new Error("Inactive schedule cannot be updated");
    }

    const updatedData: ICreateTripScheduleDTO = {
      routeId: data.routeId ?? String(existingSchedule.routeId),
      busId: data.busId ?? String(existingSchedule.busId),
      driverId: data.driverId ?? String(existingSchedule.driverId),
      conductorId:
        data.conductorId ?? String(existingSchedule.conductorId),
      departureTime: data.departureTime ?? existingSchedule.departureTime,
      startDate: data.startDate ?? existingSchedule.startDate,
      endDate: data.endDate ?? existingSchedule.endDate,
      operatingDays: data.operatingDays ?? existingSchedule.operatingDays,
      ticketPrice: data.ticketPrice ?? existingSchedule.ticketPrice,
    };

    this.validateScheduleData(updatedData);

    await this.validateUpdatedResources(
      operatorId,
      existingSchedule,
      updatedData,
    );

    const updatedSchedule =
      await this._tripScheduleRepository.updateSchedule(
        scheduleId,
        new Types.ObjectId(operatorId),
        {
          routeId: new Types.ObjectId(updatedData.routeId),
          busId: new Types.ObjectId(updatedData.busId),
          driverId: new Types.ObjectId(updatedData.driverId),
          conductorId: new Types.ObjectId(updatedData.conductorId),
          departureTime: updatedData.departureTime,
          startDate: updatedData.startDate,
          endDate: updatedData.endDate,
          operatingDays: updatedData.operatingDays,
          ticketPrice: updatedData.ticketPrice,
        },
      );

    if (!updatedSchedule) {
      throw new Error("Unable to update trip schedule");
    }

    return updatedSchedule;
  }

  async deleteSchedule(
    scheduleId: string,
    operatorId: string,
  ): Promise<ITripSchedule> {
    this.validateObjectId(scheduleId, "Invalid schedule ID");
    this.validateObjectId(operatorId, "Invalid operator ID");

    const schedule =
      await this._tripScheduleRepository.softDeleteSchedule(
        scheduleId,
        new Types.ObjectId(operatorId),
      );

    if (!schedule) {
      throw new Error("Trip schedule not found");
    }

    return schedule;
  }

  private validateObjectId(value: string, message: string): void {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error(message);
    }
  }

  private validateRoute(
    route: IRoute | null,
    operatorId: string,
  ): asserts route is IRoute {
    if (!route) {
      throw new Error("Route not found");
    }

    if (
      String(route.operatorId) !== operatorId ||
      route.isDeleted ||
      !route.isActive
    ) {
      throw new Error("Route is not available");
    }

    if (
      !Number.isFinite(route.estimatedDurationInSeconds) ||
      route.estimatedDurationInSeconds <= 0
    ) {
      throw new Error("Route duration is invalid");
    }

    if (!route._id) {
      throw new Error("Invalid route information");
    }
  }

  private validateBus(
    bus: IBus | null,
    operatorId: string,
  ): asserts bus is IBus {
    if (!bus) {
      throw new Error("Bus not found");
    }

    if (
      String(bus.operatorId) !== operatorId ||
      bus.isDeleted ||
      !bus.isActive ||
      bus.approvalStatus !== "APPROVED"
    ) {
      throw new Error("Bus is not approved or available");
    }

    if (!bus.seatLayoutSnapshot?.seats?.length) {
      throw new Error("Bus seat layout is not available");
    }

    if (!bus._id) {
      throw new Error("Invalid bus information");
    }
  }

  private validateStaff(
    staff: IStaff | null,
    expectedRole: "driver" | "conductor",
    operatorId: string,
  ): asserts staff is IStaff {
    if (!staff) {
      throw new Error(`${expectedRole} not found`);
    }

    if (String(staff.operatorId) !== operatorId) {
      throw new Error(`${expectedRole} does not belong to this operator`);
    }

    if (staff.role !== expectedRole) {
      throw new Error(`Selected staff member is not a ${expectedRole}`);
    }

    if (staff.isBlocked) {
      throw new Error(`${expectedRole} is blocked and cannot be assigned`);
    }

    if (!staff._id) {
      throw new Error(`Invalid ${expectedRole} information`);
    }
  }

  private validateScheduleData(data: ICreateTripScheduleDTO): void {
    this.validateObjectId(data.routeId, "Invalid route ID");
    this.validateObjectId(data.busId, "Invalid bus ID");
    this.validateObjectId(data.driverId, "Invalid driver ID");
    this.validateObjectId(data.conductorId, "Invalid conductor ID");

    if (!/^\d{2}:\d{2}$/.test(data.departureTime)) {
      throw new Error("Departure time must be in HH:mm format");
    }

    const [hours, minutes] = data.departureTime.split(":").map(Number);

    if (hours > 23 || minutes > 59) {
      throw new Error("Invalid departure time");
    }

    this.validateDate(data.startDate);
    this.validateDate(data.endDate);

    if (data.startDate > data.endDate) {
      throw new Error("Start date cannot be after end date");
    }

    if (
      !Array.isArray(data.operatingDays) ||
      data.operatingDays.length === 0
    ) {
      throw new Error("Select at least one operating day");
    }

    const validDays = [0, 1, 2, 3, 4, 5, 6];

    for (const day of data.operatingDays) {
      if (!validDays.includes(day)) {
        throw new Error("Invalid operating day");
      }
    }

    if (new Set(data.operatingDays).size !== data.operatingDays.length) {
      throw new Error("Duplicate operating days are not allowed");
    }

    if (
      typeof data.ticketPrice !== "number" ||
      !Number.isFinite(data.ticketPrice) ||
      data.ticketPrice <= 0 ||
      data.ticketPrice > 100000
    ) {
      throw new Error("Ticket price must be greater than zero and cannot exceed ₹1,00,000");
    }
  }

  private validateDate(value: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error("Date must be in YYYY-MM-DD format");
    }

    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error("Invalid calendar date");
    }
  }

  private getOperatingDates(
    startDate: string,
    endDate: string,
    operatingDays: OperatingDay[],
  ): string[] {
    const dates: string[] = [];

    const current = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T00:00:00.000Z`);

    while (current <= end) {
      const day = current.getUTCDay();

      if (operatingDays.includes(day as OperatingDay)) {
        dates.push(current.toISOString().slice(0, 10));
      }

      current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
  }

  private buildTrips(
    operatorId: string,
    route: IRoute,
    bus: IBus,
    driver: IStaff,
    conductor: IStaff,
    data: ICreateTripScheduleDTO,
    tripDates: string[],
  ): ITripDraft[] {
    const routeSnapshot = {
      routeName: route.routeName,
      origin: { ...route.origin },
      destination: { ...route.destination },
      stops: route.stops.map((stop) => ({ ...stop })),
      distanceInMeters: route.distanceInMeters,
      estimatedDurationInSeconds: route.estimatedDurationInSeconds,
    };

    const busSnapshot = {
      manufacturer: bus.manufacturer,
      model: bus.model,
      registrationNumber: bus.registrationNumber,
      busType: bus.busType,
      seatLayoutSnapshot: {
        name: bus.seatLayoutSnapshot.name,
        slug: bus.seatLayoutSnapshot.slug,
        busType: bus.seatLayoutSnapshot.busType,
        totalCapacity: bus.seatLayoutSnapshot.totalCapacity,
        decks: bus.seatLayoutSnapshot.decks.map((deck) => ({ ...deck })),
        seats: bus.seatLayoutSnapshot.seats.map((seat) => ({ ...seat })),
        elements: bus.seatLayoutSnapshot.elements.map((element) => ({
          ...element,
        })),
      },
    };

    const driverSnapshot = {
      fullName: driver.fullName,
      phone: driver.phone,
      role: "driver" as const,
    };

    const conductorSnapshot = {
      fullName: conductor.fullName,
      phone: conductor.phone,
      role: "conductor" as const,
    };

    return tripDates.map((tripDate) => {
      const departureAt = new Date(
        `${tripDate}T${data.departureTime}:00+05:30`,
      );

      const arrivalAt = new Date(
        departureAt.getTime() +
          route.estimatedDurationInSeconds * 1000,
      );

      const seats = bus.seatLayoutSnapshot.seats.map((seat) => ({
        seatId: seat.seatId,
        seatNumber: seat.seatNumber,
        type: seat.type,
        deck: seat.deck,
        row: seat.row,
        col: seat.col,
        rowSpan: seat.rowSpan,
        colSpan: seat.colSpan,
        status: "AVAILABLE" as const,
        lockedUntil: null,
        bookingId: null,
      }));

      return {
        operatorId: new Types.ObjectId(operatorId),
        routeId: route._id!,
        busId: bus._id!,
        driverId: driver._id!,
        conductorId: conductor._id!,
        tripDate,
        departureTime: data.departureTime,
        departureAt,
        arrivalAt,
        routeSnapshot,
        busSnapshot,
        driverSnapshot,
        conductorSnapshot,
        seats,
        ticketPrice: data.ticketPrice,
        status: "SCHEDULED" as const,
      };
    });
  }

  private async validateTripConflicts(
    operatorId: string,
    trips: ITripDraft[],
  ): Promise<void> {
    const operatorObjectId = new Types.ObjectId(operatorId);

    for (const trip of trips) {
      const conflict =
        await this._tripRepository.findConflictingTrip(
          operatorObjectId,
          trip.busId,
          trip.driverId,
          trip.conductorId,
          trip.departureAt,
          trip.arrivalAt,
        );

      if (conflict) {
        throw new Error(
          `Bus or staff already assigned to another trip on ${trip.tripDate}`,
        );
      }
    }

    for (let i = 0; i < trips.length; i++) {
      for (let j = i + 1; j < trips.length; j++) {
        const first = trips[i];
        const second = trips[j];

        const overlaps =
          first.departureAt < second.arrivalAt &&
          first.arrivalAt > second.departureAt;

        if (overlaps) {
          throw new Error(
            `Generated trips have overlapping schedules on ${second.tripDate}`,
          );
        }
      }
    }
  }

  private async validateUpdatedResources(
    operatorId: string,
    existingSchedule: ITripSchedule,
    data: ICreateTripScheduleDTO,
  ): Promise<void> {
    const operatorObjectId = new Types.ObjectId(operatorId);

    const routeChanged =
      String(existingSchedule.routeId) !== data.routeId;

    const busChanged =
      String(existingSchedule.busId) !== data.busId;

    const driverChanged =
      String(existingSchedule.driverId) !== data.driverId;

    const conductorChanged =
      String(existingSchedule.conductorId) !== data.conductorId;

    const [route, bus, driver, conductor] = await Promise.all([
      routeChanged
        ? this._routeRepository.findRouteById(data.routeId, operatorId)
        : Promise.resolve(null),

      busChanged
        ? this._busRepository.findBusById(data.busId)
        : Promise.resolve(null),

      driverChanged
        ? this._staffRepository.findStaffByIdAndOperator(
            data.driverId,
            operatorObjectId,
          )
        : Promise.resolve(null),

      conductorChanged
        ? this._staffRepository.findStaffByIdAndOperator(
            data.conductorId,
            operatorObjectId,
          )
        : Promise.resolve(null),
    ]);

    if (routeChanged) {
      this.validateRoute(route, operatorId);
    }

    if (busChanged) {
      this.validateBus(bus, operatorId);
    }

    if (driverChanged) {
      this.validateStaff(driver, "driver", operatorId);
    }

    if (conductorChanged) {
      this.validateStaff(conductor, "conductor", operatorId);
    }

    if (data.driverId === data.conductorId) {
      throw new Error("Driver and conductor must be different staff members");
    }
  }
}
