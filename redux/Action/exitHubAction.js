import { endSharingSecondary } from '../../services/deleteService'
import { getSharedDevicesAction } from '../Action/getSharedDevicesAction'

const setExitStatus =(type , data,success) => ({
    type,
    payload:{...data,success}
})


export const  exitHubAction =  (id, idToken) => {

    return async (dispatch) =>{
        try {
            dispatch(setExitStatus('EXIT_HUB',{ loading: true},true))  
            //const data =   await deleteASharedAccount(id, idToken)
            const data = await endSharingSecondary(id, idToken)
           
            setTimeout(()=> {
                dispatch(getSharedDevicesAction(idToken))
                dispatch(setExitStatus('EXIT_HUB',{...data , loading:false},true))  
            },400)
           
           
        } 
        catch (error) {
            setTimeout(()=> {
            dispatch(setExitStatus('EXIT_HUB', { loading: false},false))
            },400)
        }
}
}
