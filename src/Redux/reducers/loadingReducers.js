import {SUBMIT_LOADING} from '../actions/loadingActions';

// null is set as the default value here for state, because Redux will complain if state is undefined. 
// You can set initial state here, but it is recommended on the Redux documentation to preload the state within the redux store. 
// https://redux.js.org/recipes/structuring-reducers/initializing-state
export default function loadingReducer(state = null, action) {
  switch (action.type) {
    case SUBMIT_LOADING:
      return action.payload.loading;
    default:
      return state;
  }
}
