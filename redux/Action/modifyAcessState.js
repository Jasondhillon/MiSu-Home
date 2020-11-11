
const modifyAccessProperties =(type , mod) => ({
    type,
    payload: mod
})



export const ModifyAccessStateAction = (title,value) => {
  
   return (dispatch) => {
       dispatch(modifyAccessProperties('MODIFY_ACCESSTATE', {title, value}))
   }
}