import { updateInvitation } from '../../services/invitationService'

const UpdateInvitation = (type,data,success) => ({
    type,
    payload:{...data, success}
})

export const updateInvitationAction =  (account, value ,idToken) => {
    return async (dispatch) =>{
        try {
            const data = await updateInvitation(account, value ,idToken)
            console.log('**** Update Invitation ****');
            console.log({account});
            console.log({value});
            console.log({idToken});
            console.log('**** Update Invitation ****');
            console.log({data});
            dispatch(UpdateInvitation('UPDATE_INVITATION',data,true))
            
        } catch (error) {
            dispatch(UpdateInvitation('UPDATE_INVITATION',null,false))
        }

    }
  

}