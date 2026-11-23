
import { User, UserDocument } from "../../../models/User";
import { IUser } from "../../../types/user";
import { BaseRepositary } from "../../BaseRepository";
import { IUserRepository } from "../interface/IUserRepository";

export class UserRepository
  extends BaseRepositary<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findUserById(userId: string): Promise<UserDocument | null> {
    return await this.findById(userId);
  }

  async updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<UserDocument | null> {
    return await this.updateOne(
      {
        _id: userId,
        role: "user",
      },
      {
        $set: userData,
      }
    );
  }

  async updateUserPassword(
    userId: string,
    password: string
  ): Promise<UserDocument | null> {
    return await this.updateOne(
      {
        _id: userId,
        role: "user",
      },
      {
        $set: {
          password,
        },
      }
    );
  }
}
