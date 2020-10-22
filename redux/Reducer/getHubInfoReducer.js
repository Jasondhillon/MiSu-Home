
const INITIAL_STATE = {
  hub_url : null,
  hub_email: null
}

export const getHubInfoReducer = (state = INITIAL_STATE, action) => {
  
    switch (action.type) {
      case 'SET_HUB_INFO':
      
        return { ...state,...action.payload};
        default:
           return state
    }
}
    