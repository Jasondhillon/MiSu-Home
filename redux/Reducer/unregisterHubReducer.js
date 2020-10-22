

const INITIAL_STATE = {
    loading: false,
    success: false
  
}
export const unregisterHubReducer = (state = INITIAL_STATE, action) => {
 
    switch (action.type) {
        case 'UNREGISTER_HUB':
           return { ...state,...action.payload};
        default:
        return state;

    }
}
    