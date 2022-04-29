export const SUBMIT_WALLET = 'SUBMIT_WALLET';

// The function, user, is an 'action creator'
// The return value is an 'action'
export function submitWallet(input) {
  return {
    type: SUBMIT_WALLET,
    payload: {
      wallet: input
    }
  }
}
