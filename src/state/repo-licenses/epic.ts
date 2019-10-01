import { ofType, Epic, ActionsObservable } from "redux-observable";
import { Observable, of } from "rxjs";
import { ajax, AjaxError } from "rxjs/ajax";
import { catchError, flatMap, map } from "rxjs/operators";
import { IRepoLicensesState, IRepoLicensesFetchAction, IRepoLicensesSuccessAction, ILicense } from "./types";
import { RepoLicensesActionTypes } from "./constants";
import { repoLicensessuccessAction } from "./actions";
import { errorFailureAction } from "../error/actions";
import { IErrorFailAction } from "../error/types";

const fetchRepoLicenses: Epic<IRepoLicensesFetchAction, any, IRepoLicensesState> = (
  action$: ActionsObservable<IRepoLicensesFetchAction>,
): Observable<IRepoLicensesSuccessAction | IErrorFailAction> =>
  action$.pipe(
    ofType<IRepoLicensesFetchAction>(RepoLicensesActionTypes.FETCH_ACTION),
    flatMap<IRepoLicensesFetchAction, Observable<IRepoLicensesSuccessAction | IErrorFailAction>>(() =>
      ajax.getJSON<ILicense[]>(`${process.env.REACT_APP_GIT_API_DOMAIN}${process.env.REACT_APP_GIT_API_LICENSES}`).pipe(
        map<ILicense[], IRepoLicensesState>(response => ({ licenses: response })),
        map<IRepoLicensesState, IRepoLicensesSuccessAction>(response => repoLicensessuccessAction(response)),
        catchError<IRepoLicensesSuccessAction, Observable<IErrorFailAction>>((err: AjaxError) =>
          of(
            errorFailureAction({
              instance: RepoLicensesActionTypes.FAILED_ACTION,
              message: `Retreiving License API had an error: ${err.message}`,
              status: err.status,
            }),
          ),
        ),
      ),
    ),
  );
export default fetchRepoLicenses;
