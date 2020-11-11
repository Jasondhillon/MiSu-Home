const INITIAL_STATE = {
  temp_access: []
 }
 
 
 export const modifyAccessReducer =  (state = INITIAL_STATE, action) => {
     
     switch (action.type) {
       case 'MODIFY_ACCESSTATE':
         const current =state.temp_access
          const found =  current.findIndex( te => te.title == action.payload.title )
         
          if(found == -1) {
            
            return { temp_access:[ ...state.temp_access,action.payload]};
          }else {
            
            current.splice(found,1)
            
            return{ temp_access: [...current,action.payload] }
          }
 
         
         default:
           return  state
     }
 }
    