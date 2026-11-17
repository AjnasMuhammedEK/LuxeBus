import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";

import { ISeatLayoutRepository } from "../../../repositories/seatLayout/interfaces/ISeatLayoutRepository";
import { ISeatLayoutService } from "../interface/ISeatLayoutService";
import { ISeatLayout } from "../../../types/seatLayout";

@injectable()
export class SeatLayoutService implements ISeatLayoutService {
  constructor(
    @inject(TYPES.SeatLayoutRepository)
    private _seatLayoutRepository: ISeatLayoutRepository,
  ) {}

  async getActiveLayouts(): Promise<ISeatLayout[]> {
    const layouts = await this._seatLayoutRepository.findActiveLayouts();

    return layouts;
  }

  async getLayoutById(id: string): Promise<ISeatLayout> {
    const layout = await this._seatLayoutRepository.findLayoutById(id);

    if (!layout) {
      throw new Error("Seat layout not found");
    }

    if (!layout.isActive) {
      throw new Error("This seat layout is currently unavailable");
    }

    return layout;
  }
}
