
const INITIAL_STATE = {
   
    hub_email: null
  }
  
  export const updateInvitationReducer = (state = INITIAL_STATE, action) => {
    
      switch (action.type) {
        case 'UPDATE_INVITATION':
        
          return { ...state,...action.payload};
          default:
             return state
      }
  }
      