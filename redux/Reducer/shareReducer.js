

const INITIAL_STATE = {
    loading: false,
    success: false
  
}
export const shareReducer = (state = INITIAL_STATE, action) => {
 
    switch (action.type) {
        case 'SHARING':
           return { ...state,...action.payload};
        default:
        return state;

    }
}
    