import { ErrorActionTypes } from "./constants";
import { IErrorFailAction, IErrorState } from "./types";

// Type these action creators with ": ActionCreator<ActionTypeYouWantToPass>"".
// Remember, you can also pass parameters into an action creator. Make sure to
// type them properly.

export const errorFailureAction = (errorFailMessage: IErrorState): IErrorFailAction => {
  return {
    payload: {
      ...errorFailMessage,
    },
    type: ErrorActionTypes.ERROR_FAILED_ACTION,
  };
};
