
import { ISeatLayout } from "../../../types/seatLayout";
import { SeatLayoutDocument } from "../../../models/SeatLayoutModel";

export interface ISeatLayoutRepository {
  createLayout(data: Partial<ISeatLayout>): Promise<SeatLayoutDocument>;

  findActiveLayouts(): Promise<SeatLayoutDocument[]>;

  findLayoutById(id: string): Promise<SeatLayoutDocument | null>;

  findLayoutBySlug(slug: string): Promise<SeatLayoutDocument | null>;
}
