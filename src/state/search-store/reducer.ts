import { Reducer } from "redux";
import { ISearchStoreState, ISearchStoreActions } from "./types";
import { SearchStoreActionTypes } from "./constants";
import { ErrorActionTypes } from "../error/constants";
import { IErrorFailAction } from "../error/types";
// Type-safe initialState!
type IActionTypes = ISearchStoreActions & IErrorFailAction;
// Unfortunately, typing of the "action" parameter seems to be broken at the moment.
// This should be fixed in Redux 4.x, but for now, just augment your types.

const reducer: Reducer<ISearchStoreState> = (state: ISearchStoreState | null = null, action) => {
  // We'll augment the action type on the switch case to make sure we have
  // all the cases handled.
  switch ((action as IActionTypes).type) {
    case SearchStoreActionTypes.SUCCESS_ACTION:
      return { ...action.payload };
    case ErrorActionTypes.ERROR_FAILED_ACTION:
      if (action.payload.instance === SearchStoreActionTypes.FAILED_ACTION) return { error: { ...action.payload } };
    default:
      return state;
  }
};

export default reducer;
