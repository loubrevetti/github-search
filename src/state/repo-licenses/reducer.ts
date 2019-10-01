import { Reducer } from "redux";
import { IRepoLicensesState, IRepoLicensesActions } from "./types";
import { RepoLicensesActionTypes } from "./constants";
import { IErrorFailAction } from "../error/types";
import { ErrorActionTypes } from "../error/constants";
// Type-safe initialState!
type IActionTypes = IRepoLicensesActions & IErrorFailAction;

// Unfortunately, typing of the "action" parameter seems to be broken at the moment.
// This should be fixed in Redux 4.x, but for now, just augment your types.

const reducer: Reducer<IRepoLicensesState> = (state: IRepoLicensesState | null = null, action) => {
  // We'll augment the action type on the switch case to make sure we have
  // all the cases handled.
  switch ((action as IActionTypes).type) {
    case RepoLicensesActionTypes.SUCCESS_ACTION:
      return { ...action.payload };
    case ErrorActionTypes.ERROR_FAILED_ACTION:
      if (action.payload.instance === RepoLicensesActionTypes.FAILED_ACTION) return { error: { ...action.payload } };
    default:
      return state;
  }
};

export default reducer;
