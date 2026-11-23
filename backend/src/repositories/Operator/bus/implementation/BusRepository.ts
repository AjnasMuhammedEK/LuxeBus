import { injectable } from "inversify";
import { Bus } from "../../../../models/BusModel";
import type {
  BusApprovalStatus,
  IAdminBus,
  IAdminBusListResponse,
  IBus,
  IBusListResponse,
  IBusQueryParams,
} from "../../../../types/bus";
import type { IBusRepository } from "../interfaces/IBusRepository";
import { BaseRepositary } from "../../../BaseRepository";
import { QueryFilter, Types } from "mongoose";

@injectable()
export class BusRepository
  extends BaseRepositary<IBus>
  implements IBusRepository
{
  constructor() {
    super(Bus);
  }

  async createBus(data: IBus): Promise<IBus> {
    return await this.create(data);
  }

  async findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<IBus | null> {
    return await this.findOne({ registrationNumber });
  }

  async getBuses(
    operatorId: string,
    query: IBusQueryParams,
  ): Promise<IBusListResponse> {
    const { page, limit, search, sortBy, sortOrder, approvalStatus } = query;

    const skip = (page - 1) * limit;

    const baseFilter: QueryFilter<IBus> = {
      operatorId,
      isDeleted: { $ne: true },
    };

    const filter: QueryFilter<IBus> = { ...baseFilter };

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        {
          registrationNumber: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          manufacturer: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          model: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    if (approvalStatus) {
      filter.approvalStatus = approvalStatus;
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortDirection,
    };

    // Fetch buses and calculate statistics
    const [buses, totalItems, total, approved, pending, rejected] =
      await Promise.all([
        this.model.find(filter).sort(sort).skip(skip).limit(limit),

        this.model.countDocuments(filter),

        this.model.countDocuments(baseFilter),

        this.model.countDocuments({
          ...baseFilter,
          approvalStatus: "APPROVED",
        }),

        this.model.countDocuments({
          ...baseFilter,
          approvalStatus: "PENDING",
        }),

        this.model.countDocuments({
          ...baseFilter,
          approvalStatus: "REJECTED",
        }),
      ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      buses,
      stats: {
        total,
        approved,
        pending,
        rejected,
      },
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async getAdminBuses(query: IBusQueryParams): Promise<IAdminBusListResponse> {
    const { page, limit, search, sortBy, sortOrder, approvalStatus } = query;

    const skip = (page - 1) * limit;

    const filter: QueryFilter<IBus> = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        {
          registrationNumber: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          manufacturer: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          model: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    if (approvalStatus) {
      filter.approvalStatus = approvalStatus;
    }

    const allowedSortFields = [
      "registrationNumber",
      "manufacturer",
      "model",
      "manufacturingYear",
      "approvalStatus",
      "createdAt",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const sort: Record<string, 1 | -1> = {
      [safeSortBy]: sortDirection,
    };

    const [buses, total, totalBuses, approved, pending, rejected] =
      await Promise.all([
        this.model
          .find(filter)
          .populate("operatorId", "ownerName legalEntityName email phone")
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),

        this.model.countDocuments(filter),

        this.model.countDocuments({}),
        this.model.countDocuments({ approvalStatus: "APPROVED" }),
        this.model.countDocuments({ approvalStatus: "PENDING" }),
        this.model.countDocuments({ approvalStatus: "REJECTED" }),
      ]);

    return {
      buses: buses as unknown as IAdminBus[],

      total,
      stats: {
        total: totalBuses,
        approved,
        pending,
        rejected,
      },
    };
  }

  async findBusById(busId: string): Promise<IBus | null> {
    return await this.model.findById(busId);
  }

  async updateBusStatus(
    busId: string,
    approvalStatus: BusApprovalStatus,
    rejectReason: string | null,
  ): Promise<IBus | null> {
    return await this.model.findByIdAndUpdate(
      busId,
      {
        $set: {
          approvalStatus,
          rejectReason,
        },
      },
      { new: true, runValidators: true },
    );
  }

  async resubmitBus(
    busId: string,
    operatorId: string,
    data: Partial<IBus>,
  ): Promise<IBus | null> {
    return await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(busId),
        operatorId: new Types.ObjectId(operatorId),
        approvalStatus: "REJECTED",
        isActive: true,
        isDeleted: { $ne: true },
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateBusActiveStatus(
    busId: string,
    isActive: boolean,
  ): Promise<IBus | null> {
    return await this.updateById(busId, { isActive });
  }

  async deleteBus(busId: string, operatorId: string): Promise<IBus | null> {
    return await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(busId),
        operatorId: new Types.ObjectId(operatorId),
        isDeleted: { $ne: true },
      },
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}
