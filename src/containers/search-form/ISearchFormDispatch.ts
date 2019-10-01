import { AnyAction } from "redux";
import { ISearchStoreFetchAction, ISearchStoreFetchParams } from "../../state/search-store/types";
import { IRepoLicensesFetchAction } from "../../state/repo-licenses/types";

export interface ISearchFormDispatchProps extends AnyAction {
  searchStoreFetchAction: (inputs: ISearchStoreFetchParams) => ISearchStoreFetchAction;
  repoLicensesFetchAction(): IRepoLicensesFetchAction;
}
