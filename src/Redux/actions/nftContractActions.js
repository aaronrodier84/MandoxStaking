export const SUBMIT_NFT_CONTRACT = 'SUBMIT_NFT_CONTRACT';

// The function, user, is an 'action creator'
// The return value is an 'action'
export function submitNftContract(input) {
  return {
    type: SUBMIT_NFT_CONTRACT,
    payload: {
      nftContract: input
    }
  }
}
