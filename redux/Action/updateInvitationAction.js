import { updateInvitation } from '../../services/invitationService'
import { getSharedAccountsAction } from '../Action/getSharedAccountsAction'
import { getSharedDevicesAction } from '../Action/getSharedDevicesAction'

const UpdateInvitation = (type,data,success) => ({
    type,
    payload:{...data, success}
})

export const updateInvitationAction =  (account, value ,idToken) => {
    return async (dispatch) =>{
        try {
            dispatch(UpdateInvitation('UPDATE_INVITATION',{ loading: true},true))
            const data = await updateInvitation(account, value ,idToken)
            
            dispatch(getSharedDevicesAction(idToken))
            dispatch(getSharedAccountsAction(idToken))
            dispatch(UpdateInvitation('UPDATE_INVITATION',{...data ,loading: false},true))
           
            
        } catch (error) {
            dispatch(UpdateInvitation('UPDATE_INVITATION',{loading: false},false))
        }

    }
  

}