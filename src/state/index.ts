import { createStore, applyMiddleware, combineReducers, Reducer, Store } from "redux";
import logger from "redux-logger";
import { createEpicMiddleware, combineEpics, Epic } from "redux-observable";
// Import your state types, reducers and epics here.
import { IAppState } from "./types";
import searchStoreReducer from "./search-store/reducer";
import repoLicensesReducer from "./repo-licenses/reducer";
// DO NOT TOUCH REDUCERS COMMENT
import searchStoreEpic from "./search-store/epic";
import repoLicensesEpic from "./repo-licenses/epic";
// DO NOT TOUCH EPICS COMMENT
// root level to apply our reducers to for adaptibility across our state in app
const reducers: Reducer<IAppState> = combineReducers<IAppState>({
  repoLicense: repoLicensesReducer,
  searchStore: searchStoreReducer, // DO NOT TOUCH HOOK REDUCER
});

// root level to apply our epics for RxJs comparable to Saga for React-Saga, this is the good stuff
const rootEpic: Epic = combineEpics(searchStoreEpic, repoLicensesEpic); // DO NOT TOUCH HOOK EPIC;

// setup and instaniation of our middleware which is RxJs Observables
// creation of our global state
const epicMiddleware = createEpicMiddleware();
// running configureStore
function configureStore(initialState?: IAppState): Store<IAppState> {
  // configure middlewares
  const middlewares = [epicMiddleware, logger];
  // compose enhancers
  const enhancer = applyMiddleware(...middlewares);

  // create store
  return createStore(reducers, initialState, enhancer);
}
const appStore = configureStore();

epicMiddleware.run(rootEpic);
export default appStore;
