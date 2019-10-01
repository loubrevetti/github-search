import { ISearchStoreState } from "./search-store/types";
import { IRepoLicensesState } from "./repo-licenses/types";
export interface IAppState {
  repoLicense: IRepoLicensesState;
  searchStore: ISearchStoreState;
}
export interface IAppFailState {
  error: string;
  message: string | string[];
}
