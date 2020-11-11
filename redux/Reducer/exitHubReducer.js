
const INITIAL_STATE = {
    loading : false,
    success: null
  }
  
  export const exitHubReducer = (state = INITIAL_STATE, action) => {
    
      switch (action.type) {
        case 'EXIT_HUB':
        
          return { ...state,...action.payload};
          default:
             return state
      }
  }
      