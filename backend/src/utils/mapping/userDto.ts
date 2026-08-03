import { UserDocument } from "../../models/User";
import { IUserMappedData } from "../../types/user";

export const userDataMapping = (user:UserDocument) : IUserMappedData => {
    return{
        id:user._id.toString(),
        name:user.name,
        email:user.email,
        phone:user.phone,
        role:user.role,
        isBlocked:user.isBlocked,
        isVerified:user.isVerified
    }
}