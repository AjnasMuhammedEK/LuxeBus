import { ISeatLayout } from "../../../types/seatLayout";

export interface ISeatLayoutService {
  getActiveLayouts(): Promise<ISeatLayout[]>;

  getLayoutById(id: string): Promise<ISeatLayout>;
}