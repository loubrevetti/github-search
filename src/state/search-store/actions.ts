import { SearchStoreActionTypes } from "./constants";
import {
  ISearchStoreFetchAction,
  ISearchStoreSuccessAction,
  ISearchStoreState,
  ISearchStoreFetchParams,
  ISearchStoreFailAction,
} from "./types";
import { IAppFailState } from "../types";

// Type these action creators with ": ActionCreator<ActionTypeYouWantToPass>"".
// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly.

export const searchStoreFetchAction = (searchStoreInput: ISearchStoreFetchParams): ISearchStoreFetchAction => {
  return {
    payload: {
      ...searchStoreInput,
    },
    type: SearchStoreActionTypes.FETCH_ACTION,
  };
};

export const searchStoreSuccessAction = (searchStoreResponse: ISearchStoreState): ISearchStoreSuccessAction => {
  return {
    payload: {
      ...searchStoreResponse,
    },
    type: SearchStoreActionTypes.SUCCESS_ACTION,
  };
};

export const searchStoreFailureAction = (searchStoreFailMessage: IAppFailState): ISearchStoreFailAction => {
  return {
    payload: {
      ...searchStoreFailMessage,
    },
    type: SearchStoreActionTypes.FAILED_ACTION,
  };
};
