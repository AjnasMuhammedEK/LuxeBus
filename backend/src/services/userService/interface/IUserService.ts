
import { IUserMappedData } from "../../../types/user";

export interface IUserService {
  getProfile(userId: string): Promise<IUserMappedData>;

  updateProfile(
    userId: string,
    data: { name: string; phone: string }
  ): Promise<IUserMappedData>;

  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void>;
}
