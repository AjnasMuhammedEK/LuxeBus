import mongoose , {Schema , HydratedDocument }from "mongoose"
import { IUser } from "../types/user"

const userSchema = new Schema<IUser>(
    {
        name : {
            type : String,
            required : true,
            trim:true
        },

        email :{
            type : String,
            required : true,
            unique : true,
            lowercase:true,
            trim:true
        },
        phone : {
            type :String,
            default:'',
            trim:true
        },

        password :{
            type:String,
            default:''

        },

        googleId: {
            type: String,
            default: "",
        },

        role :{
            type :String,
            enum : ['user' , 'admin'],
            default : 'user'
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps:true
    }
)

export const User = mongoose.model<IUser>('User',userSchema)
export type UserDocument = HydratedDocument<IUser>