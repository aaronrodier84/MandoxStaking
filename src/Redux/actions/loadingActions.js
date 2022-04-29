export const SUBMIT_LOADING = 'SUBMIT_LOADING';

// The function, user, is an 'action creator'
// The return value is an 'action'
export function submitLoading(input) {
  return {
    type: SUBMIT_LOADING,
    payload: {
      loading: input
    }
  }
}
