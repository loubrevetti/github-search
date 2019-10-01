import { Action } from "redux";
export interface IErrorState {
  status: number;
  message: string;
  instance: string;
  count?: number;
}

// Declare our action types using our interface. For a better debugging experience,
// I use the @@context/ACTION_TYPE convention for naming action types.
export interface IErrorFailAction extends Action {
  type: string;
  payload: IErrorState;
}

// Down here, we'll create a discriminated union type of all actions which will be used for our reducer.
export type IErrorActions = IErrorFailAction;
