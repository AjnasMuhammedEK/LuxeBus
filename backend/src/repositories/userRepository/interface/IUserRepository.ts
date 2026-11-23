
import { UserDocument } from "../../../models/User";
import { IUser } from "../../../types/user";

export interface IUserRepository {
  findUserById(userId: string): Promise<UserDocument | null>;

  updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<UserDocument | null>;

  updateUserPassword(
    userId: string,
    password: string
  ): Promise<UserDocument | null>;
}
