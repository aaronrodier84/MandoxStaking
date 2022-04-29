export const SUBMIT_CONTRACT = 'SUBMIT_CONTRACT';

// The function, user, is an 'action creator'
// The return value is an 'action'
export function submitContract(input) {
  return {
    type: SUBMIT_CONTRACT,
    payload: {
      contract: input
    }
  }
}
