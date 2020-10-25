

const INITIAL_STATE = {
    loading: false,
    success: false
  
}
export const registerHubReducer = (state = INITIAL_STATE, action) => {
 
    switch (action.type) {
        case 'REGISTER_HUB':
           return { ...state,...action.payload};
        default:
        return state;

    }
}
    