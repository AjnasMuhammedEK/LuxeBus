export type UserRole = "user" | "admin";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  googleId? :string,
  role: UserRole;
  isBlocked: boolean;
  isVerified: boolean;
}

export interface IUserMappedData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isBlocked: boolean;
    isVerified: boolean;

}