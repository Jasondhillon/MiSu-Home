
import { deleteASharedAccount } from '../../services/deleteService'



const setExitStatus =(type , data,success) => ({
    type,
    payload:{...data,success}
})


export const  exitHubAction =  (id, idToken) => {

    return async (dispatch) =>{
        try {
            console.log("exiting hub...." + id + ", " + idToken);
            const data =   await deleteASharedAccount(id, idToken)
            console.log({data});
            dispatch(setExitStatus('EXIT_HUB',data,true))  
        } 
        catch (error) {
            dispatch(setExitStatus('EXIT_HUB', null,false))
        }
}
}
