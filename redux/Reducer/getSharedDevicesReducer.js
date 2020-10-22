
const INITIAL_STATE = {
  
    sharedDevices: null
  }
  
  export const getSharedDevicesReducer = (state = INITIAL_STATE, action) => {
    
      switch (action.type) {
        case 'SET_SHARED_DEVICES':
        
          return { ...state,...action.payload};
          default:
             return state
      }
  }
      