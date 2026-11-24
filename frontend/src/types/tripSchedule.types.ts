/* Operating Days */

export type OperatingDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAYS = [
  { value: 0, label: "Sunday", short: "Sun" },
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
] satisfies {
  value: OperatingDay;
  label: string;
  short: string;
}[];

export interface IScheduleRouteRef {
  _id?: string;
  routeName?: string;
  name?: string;
  origin?: { name: string } | string;
  destination?: { name: string } | string;
}
export interface IScheduleBusRef {
  registrationNumber: string;
  manufacturer: string;
  model: string;
}

export interface IScheduleStaffRef {
  _id?: string;
  fullName?: string;
  name?: string;
}

export const asObject = <T>(value: unknown): T | null => {
  return typeof value === "object" && value !== null ? (value as T) : null;
};

export interface ITripSchedule {
  _id: string;
  operatorId: string;

  routeId: string | IScheduleRouteRef;
  busId: string | IScheduleBusRef;
  driverId: string | IScheduleStaffRef;
  conductorId: string | IScheduleStaffRef;

  departureTime: string;

  startDate: string;
  endDate: string;

  operatingDays: OperatingDay[];

  ticketPrice: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateTripScheduleDTO {
  routeId: string;
  busId: string;
  driverId: string;
  conductorId: string;

  departureTime: string;

  startDate: string;
  endDate: string;

  operatingDays: OperatingDay[];

  ticketPrice: number;
}

export type IUpdateTripScheduleDTO = Partial<ICreateTripScheduleDTO>;
