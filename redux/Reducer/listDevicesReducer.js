
const INITIAL_STATE = {
    devices : []
}
export const listDevicesReducer = (state = INITIAL_STATE, action) => {
   // const tempState = state;
    switch (action.type) {
        case 'SET_DEVICES':
           return { ...state,...action.payload};
        default:
        return state;

    }
}
    