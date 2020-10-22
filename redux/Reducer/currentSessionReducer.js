

const INITIAL_STATE = {
   id : null,
   idToken : null,
   accessToken : null,
   email : null,
   name :null
}


export const currentSessionReducer = (state = INITIAL_STATE, action) => {
    
    switch (action.type) {
      case 'SET_SESSION':
       
       return { ...state,...action.payload};

        default:
          return  state
    }
}
    