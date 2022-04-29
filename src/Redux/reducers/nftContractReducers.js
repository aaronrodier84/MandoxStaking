import {SUBMIT_NFT_CONTRACT} from '../actions/nftContractActions';

// null is set as the default value here for state, because Redux will complain if state is undefined. 
// You can set initial state here, but it is recommended on the Redux documentation to preload the state within the redux store. 
// https://redux.js.org/recipes/structuring-reducers/initializing-state
export default function nftContractReducer(state = null, action) {
  switch (action.type) {
    case SUBMIT_NFT_CONTRACT:
      return action.payload.nftContract;
    default:
      return state;
  }
}
