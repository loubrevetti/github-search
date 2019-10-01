import { ofType, Epic, ActionsObservable } from "redux-observable";
import { Observable, of } from "rxjs";

import { catchError, map, flatMap } from "rxjs/operators";
import { ISearchStoreState, ISearchStoreFetchAction, ISearchStoreSuccessAction, IRequestPayload } from "./types";
import { SearchStoreActionTypes } from "./constants";
import { searchStoreSuccessAction } from "./actions";
import { ajax, AjaxError } from "rxjs/ajax";
import { IErrorFailAction } from "../error/types";
import { errorFailureAction } from "../error/actions";

const fetchSearchStore: Epic<ISearchStoreFetchAction, any, ISearchStoreState> = (
  action$: ActionsObservable<ISearchStoreFetchAction>,
): Observable<ISearchStoreSuccessAction | IErrorFailAction> =>
  action$.pipe(
    ofType<ISearchStoreFetchAction>(SearchStoreActionTypes.FETCH_ACTION),
    flatMap<ISearchStoreFetchAction, Observable<ISearchStoreSuccessAction | IErrorFailAction>>(action => {
      const qs = Object.values(action.payload)
        .map(searchParam => searchParam)
        .join()
        .replace(/\,/g, "+");
      return ajax
        .getJSON<IRequestPayload>(
          `${process.env.REACT_APP_GIT_API_DOMAIN}${process.env.REACT_APP_GIT_API_SEARCH}?${qs}`,
        )
        .pipe(
          map<IRequestPayload, ISearchStoreState>(response => ({ repos: response.items })),
          map<ISearchStoreState, ISearchStoreSuccessAction>(response => searchStoreSuccessAction(response)),
          catchError<ISearchStoreSuccessAction, Observable<IErrorFailAction>>((err: AjaxError) =>
            of(
              errorFailureAction({
                instance: SearchStoreActionTypes.FAILED_ACTION,
                message: `Retreiving License API had an error: ${err.message}`,
                status: err.status,
              }),
            ),
          ),
        );
    }),
  );
export default fetchSearchStore;
