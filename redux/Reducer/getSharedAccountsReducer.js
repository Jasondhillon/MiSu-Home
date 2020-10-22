
const INITIAL_STATE = {
    sharedAccounts : null,
  
  }
  
  export const getSharedAccountsReducer  = (state = INITIAL_STATE, action) => {
    
      switch (action.type) {
        case 'SET_SHARED_ACCOUNTS':
          return { ...state,...action.payload};
          default:
             return state
      }
  }
      