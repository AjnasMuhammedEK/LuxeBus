
import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";

import { IUser } from "../../../types/user";
import { IUserService } from "../interface/IUserService";

import { TYPES } from "../../../DI/types";
import { IUserRepository } from "../../../repositories/userRepository/interface/IUserRepository";

import { userDataMapping } from "../../../utils/mapping/userDto";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async getProfile(userId: string) {
    const user = await this._userRepository.findUserById(userId);

    if (!user || user.role !== "user") {
      throw new Error("User Not Found");
    }

    return userDataMapping(user);
  }

  async updateProfile(
    userId: string,
    data: { name: string; phone: string }
  ) {
    const user = await this._userRepository.findUserById(userId);

    if (!user || user.role !== "user") {
      throw new Error("User Not Found");
    }

    const updatedData: Partial<IUser> = {
      name: data.name,
      phone: data.phone,
    };

    const updatedUser = await this._userRepository.updateUser(
      userId,
      updatedData
    );

    if (!updatedUser) {
      throw new Error("Something went wrong while updating profile");
    }

    return userDataMapping(updatedUser);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this._userRepository.findUserById(userId);

    if (!user || user.role !== "user") {
      throw new Error("User Not Found");
    }

     
    if (!user.password) {
      throw new Error(
        "This account does not have a password. Please use the forgot password option."
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Current Password Is Incorrect");
    }

    if (currentPassword === newPassword) {
      throw new Error("New Password Must Be Different");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await this._userRepository.updateUserPassword(
      userId,
      hashedPassword
    );

    if (!updatedUser) {
      throw new Error("Something went wrong while changing password");
    }
  }
}
