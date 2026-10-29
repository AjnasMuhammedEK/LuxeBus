import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IOperator } from "@/types/operator.types";

interface OperatorState {
  operator: IOperator | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

interface OperatorLoginPayload {
  operator: IOperator;
  accessToken: string;
}


const initialState: OperatorState = {
  operator: null,
  accessToken: null,
  isAuthenticated: false,
};


const operatorAuthSlice = createSlice({
  name : 'operatorAuth',
  initialState , 

  reducers : {
    loginOperator : (state , action: PayloadAction<OperatorLoginPayload> ) => {
      state.operator = action.payload.operator;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true; 
    },


    setOperatorAccessToken: (state,action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },


    logoutOperator: (state) => {
      state.operator = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },    


    updateOperatorStatus: (
  state,
  action: PayloadAction<IOperator["status"]>
) => {
  if (state.operator) {
    state.operator.status = action.payload;

    if (action.payload === "pending") {
      state.operator.rejectReason = null;
    }
  }
},
  }
});

export const {loginOperator,setOperatorAccessToken,logoutOperator,updateOperatorStatus} = operatorAuthSlice.actions;

export default operatorAuthSlice.reducer;