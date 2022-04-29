import {createStore, combineReducers} from 'redux';
import contractReducer from "./reducers/contractReducers";
import walletReducer from "./reducers/walletReducers";
import nftContractReducer from "./reducers/nftContractReducers";
import loadingReducer from "./reducers/loadingReducers";

// combineReducers takes in multiple reducers, and returns a single reducer to be used in the createStore(...) function.
// combineReducers takes in multiple 'key : value' pairs to combine the reducers.
// The key is the name of variable within state (in the redux store), and the value is the reducer used to change that variable.
const allReducers = combineReducers({
  wallet: walletReducer,
  contract: contractReducer,
  nftContract: nftContractReducer,
  loading: loadingReducer
});

// createStore takes in 3 parameters: 1. Reducer 2. preloadedState 3. Enhancer.
// In this case: 
// 1. Is the allReducer defined above
// 2. Are the intial values of the state within the redux store
// 3. Allows the store to be viewed within the Redux Tools Extension, a recommended tool when working with Redux.
// https://redux.js.org/api/createstore
const store = createStore(
  allReducers,
  {
    wallet: "",
    contract: {},
    nftContract: {},
    loading: false
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
