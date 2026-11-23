
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
  _id: string;
  operatorId: string;
  routeName: string;
  origin: IRouteLocation;
  destination: IRouteLocation;
  stops: IRouteStop[];
  distanceInMeters: number;
  estimatedDurationInSeconds: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateRouteDTO {
  routeName: string;
  origin: IRouteLocation;
  destination: IRouteLocation;
  stops: IRouteStop[];
  distanceInMeters: number;
  estimatedDurationInSeconds: number;
}

export type IUpdateRouteDTO = Partial<ICreateRouteDTO>;

export interface IRouteListQuery {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

export interface IRouteListResponse {
  routes: IRoute[];
  total: number;
  totalPages: number;

}

export interface IRouteStats {
  total: number;
  active: number;
  inactive: number;
}
