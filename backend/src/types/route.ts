import { Types } from "mongoose";

export interface IRouteLocation {
  name: string;
  address: string;
  placeId: string;
  latitude: number;
  longitude: number;
}

export interface IRouteStop extends IRouteLocation {
  order: number;
  isBoardingPoint: boolean;
  isDroppingPoint: boolean;
}

export interface IRoute {
  _id?: Types.ObjectId;
  operatorId: Types.ObjectId;

  routeName: string;

  origin: IRouteLocation;
  destination: IRouteLocation;

  stops: IRouteStop[];

  distanceInMeters: number;
  estimatedDurationInSeconds: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}