

const INITIAL_STATE = {
    loading: false,
    success: false
  
}
export const stopSharingReducer = (state = INITIAL_STATE, action) => {
 
    switch (action.type) {
        case 'STOP_SHARING':
           return { ...state,...action.payload};
        default:
        return state;

    }
}
    