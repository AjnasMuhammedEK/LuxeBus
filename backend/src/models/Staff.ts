import mongoose , {Schema , HydratedDocument} from "mongoose";
import { IStaff } from "../types/staff";


const staffSchema = new Schema (
    {

        operatorId : {
            type : Schema.Types.ObjectId ,
            ref : 'Operator',
            required : true
        },

        fullName : {
            type : String ,
            required : true
        },

        email : {
            type :String,
            required:true
        },

        phone :{
            type : String ,
            required : true
        },

        role : {
            type : String,
            enum: ["driver", "conductor"],
            required : true
        },

        joiningDate : {
            type : String ,
            required : true
        },

        password : {
            type : String ,
            required : true
        },

        idProof : {
            type : String ,
            required : true            
        },

        commercialLicense :{
            type : String ,
            required : true
        },

        status : {
            type : String ,
            enum: ["on-duty", "off-duty"],
            default: "off-duty",
            required : true            
        },

        isBlocked : {
            type : Boolean,
            default : false,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

export const Staff = mongoose.model<IStaff>('Staff',staffSchema)
export type StaffDocument = HydratedDocument<IStaff>