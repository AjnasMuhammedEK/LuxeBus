import type { IStaff } from "@/types/staff.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SatffState {
    staff : IStaff | null,
    accessToken : string | null,
    isAuthenticated: boolean;
}

interface StaffLoginPayload {
    staff : IStaff,
    accessToken : string
}

const initialState : SatffState = {
    staff : null ,
    accessToken : null ,
    isAuthenticated: false
}


const staffAuthSlice = createSlice ({
    name : 'staffAuth',
    initialState ,
    reducers : {
        LoginStaff : (state , action:PayloadAction<StaffLoginPayload>) => {
            state.staff = action.payload.staff
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
        },

        LogoutStaff : (state) => {
            state.staff = null;
            state.accessToken = null;
            state.isAuthenticated = false
        },

        setStaffAccessToken : (state , action : PayloadAction<string>) => {
            state.accessToken = action.payload
        }
    }
})

export const {LoginStaff , LogoutStaff , setStaffAccessToken} = staffAuthSlice.actions

export default staffAuthSlice.reducer