import { deleteASharedAccount } from '../../services/deleteService'
import { getSharedAccountsAction } from '../Action/getSharedAccountsAction'
import { getSharedDevicesAction } from '../Action/getSharedDevicesAction'

const  stopSharingStart =(payload) =>({
    type: 'STOP_SHARING' ,
    payload
})




export const stopSharingAction = ( login_id ,devices ,idToken) => { 
    return async (dispatch) => {

        try {
            dispatch(stopSharingStart({ loading: true}))
          
            const dt = await deleteASharedAccount(login_id, idToken)
           

            dispatch(stopSharingStart({loading: false}))
            dispatch(getSharedAccountsAction(idToken))
            dispatch(getSharedDevicesAction(idToken))
           
            
        } catch (error) {
            dispatch(stopSharingStart({loading: false}))
        }

    }
}