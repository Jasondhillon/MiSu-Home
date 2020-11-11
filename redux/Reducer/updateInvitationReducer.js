
const INITIAL_STATE = {
    loading: false
  }
  
  export const updateInvitationReducer = (state = INITIAL_STATE, action) => {
    
      switch (action.type) {
        case 'UPDATE_INVITATION':
        
          return { ...state,...action.payload};
          default:
             return state
      }
  }
      