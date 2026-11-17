
import { injectable } from "inversify";

import { BaseRepositary } from "../../BaseRepository";

import { ISeatLayout } from "../../../types/seatLayout";

import {
  SeatLayout,
  SeatLayoutDocument,
} from "../../../models/SeatLayoutModel";

import { ISeatLayoutRepository } from "../interfaces/ISeatLayoutRepository";

@injectable()
export class SeatLayoutRepository
  extends BaseRepositary<ISeatLayout>
  implements ISeatLayoutRepository
{
  constructor() {
    super(SeatLayout);
  }

  async createLayout(
    data: Partial<ISeatLayout>
  ): Promise<SeatLayoutDocument> {
    return await this.create(data);
  }

  async findActiveLayouts(): Promise<SeatLayoutDocument[]> {
    return await this.findAll({ isActive: true });
  }

  async findLayoutById(
    id: string
  ): Promise<SeatLayoutDocument | null> {
    return await this.findById(id);
  }

  async findLayoutBySlug(
    slug: string
  ): Promise<SeatLayoutDocument | null> {
    return await this.findOne({ slug });
  }
}
