import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface OperatorState {
  operator: any | null;
  token: string | null;
}

const initialState: OperatorState = {
  operator: JSON.parse(localStorage.getItem("operator") || "null"),
  token: localStorage.getItem("operatorToken"),
};

const operatorAuthSlice = createSlice({
  name: "operatorAuth",
  initialState,
  reducers: {
    setOperator: (
      state,
      action: PayloadAction<{
        operator: any;
        token: string;
      }>
    ) => {
      state.operator = action.payload.operator;
      state.token = action.payload.token;

      localStorage.setItem(
        "operator",
        JSON.stringify(action.payload.operator)
      )

      localStorage.setItem(
        "operatorToken",
        action.payload.token
      )
    },

    clearOperator: (state) => {
      state.operator = null;
      state.token = null;
      localStorage.removeItem("operator")
      localStorage.removeItem("operatorToken")
    },
  },
});

export const {setOperator,clearOperator,} = operatorAuthSlice.actions;

export default operatorAuthSlice.reducer;