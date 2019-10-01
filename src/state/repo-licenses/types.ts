import { Action } from "redux";
import { IAppFailState } from "../types";
export interface IRepoLicensesState {
  licenses: ILicense[];
}
export interface ILicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

// Declare our action types using our interface. For a better debugging experience,
// I use the @@context/ACTION_TYPE convention for naming action types.
export interface IRepoLicensesFetchAction extends Action {
  type: string;
}

export interface IRepoLicensesSuccessAction extends Action {
  type: string;
  payload: IRepoLicensesState;
}

export interface IRepoLicensesFailAction extends Action {
  type: string;
  payload: IAppFailState;
}

// Down here, we'll create a discriminated union type of all actions which will be used for our reducer.
export type IRepoLicensesActions = IRepoLicensesFetchAction | IRepoLicensesSuccessAction | IRepoLicensesFailAction;
