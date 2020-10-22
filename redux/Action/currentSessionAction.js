
import { currentSessionService } from '../../services/currentSession'



const setCurrentSession =(type , data,success) => ({
    type,
    payload:{...data,success}
})


export const  currentSessionAction =  () => {

    return async (dispatch) =>{
        try {
        const data =   await currentSessionService()
        dispatch(setCurrentSession('SET_SESSION',data,true))  
            
        } catch (error) {
        dispatch( setCurrentSession('UNSET_SESSION', null,false))
        }
}
}
