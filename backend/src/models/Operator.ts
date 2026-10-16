import mongoose , {Schema , HydratedDocument }from "mongoose"
import {IOperator} from '../types/operator'

const operatorSchema = new Schema(
  {
    ownerName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role:{
      type:String,
      default:'operator'
    },

    password: {
      type: String,
      required: true,
    },

    legalEntityName: {
      type: String,
      required: true,
    },

    gstNumber: {
      type: String,
      required: true,
    },

    yearOfIncorporation: {
      type: String,
      required: true,
    },

    panNumber: {
      type: String,
      required: true,
    },

    authorisedRepresentative: {
      type: String,
      required: true,
    },

    registrationCertificate: {
      type: String,
      required: true,
    },

    taxCertificate: {
      type: String,
      required: true,
    },

    transportLicense: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectReason: {
      type: String,
      default: null,
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
);


export const Operator = mongoose.model<IOperator>("Operator",operatorSchema);
export type OperatorDocument =HydratedDocument<IOperator>;