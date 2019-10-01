import { AnyAction } from "redux";
import {
  ISearchStoreFetchAction,
  ISearchStoreFetchParams,
  ISearchStoreState,
  ISearchStoreSuccessAction,
} from "../../state/search-store/types";

export interface ISearchResultsDispatchProps extends AnyAction {
  searchStoreFetchAction: (inputs: ISearchStoreFetchParams) => ISearchStoreFetchAction;
  searchStoreSuccessAction: (object: ISearchStoreState) => ISearchStoreSuccessAction;
}
