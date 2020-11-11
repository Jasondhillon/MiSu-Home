import { createHub } from '../../services/creationService'

const  unregisterHubStart =(payload) =>({
    type: 'UNREGISTER_HUB' ,
    payload
})

const  unregisterHubSucess = (payload) =>({
    type: 'UNREGISTER_HUB' ,
    payload
})


const  unregisterHubFailed = (payload) =>({
    type: 'UNREGISTER_HUB' ,
    payload
})



export const unregisterHubAction = ({ 
    hub_url,
    hub_email,
    hub_password
  },idToken) => { 
    return async (dispatch) => {

        try {
            dispatch(unregisterHubStart())

           const data =  await createHub({ 
            hub_url,
            hub_email,
            hub_password
          },idToken)

            dispatch(unregisterHubSucess())
            
        } catch (error) {
            dispatch(unregisterHubFailed())
        }

    }
}