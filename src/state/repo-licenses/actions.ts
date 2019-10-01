import { RepoLicensesActionTypes } from "./constants";
import {
  IRepoLicensesFetchAction,
  IRepoLicensesSuccessAction,
  IRepoLicensesState,
  IRepoLicensesFailAction,
} from "./types";
import { IAppFailState } from "../types";

// Type these action creators with ": ActionCreator<ActionTypeYouWantToPass>"".
// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly.

export const repoLicensesFetchAction = (): IRepoLicensesFetchAction => {
  return {
    type: RepoLicensesActionTypes.FETCH_ACTION,
  };
};

export const repoLicensessuccessAction = (repoLicensesResponse: IRepoLicensesState): IRepoLicensesSuccessAction => {
  return {
    payload: {
      ...repoLicensesResponse,
    },
    type: RepoLicensesActionTypes.SUCCESS_ACTION,
  };
};

export const repoLicensesFailureAction = (repoLicensesFailMessage: IAppFailState): IRepoLicensesFailAction => {
  return {
    payload: {
      ...repoLicensesFailMessage,
    },
    type: RepoLicensesActionTypes.FAILED_ACTION,
  };
};
