import { createHub } from '../../services/creationService'

const  registerHubStart =(payload) =>({
    type: 'REGISTER_HUB' ,
    payload
})

const  registerHubSucess = (payload) =>({
    type: 'REGISTER_HUB' ,
    payload
})


const  registerHubFailed = (payload) =>({
    type: 'REGISTER_HUB' ,
    payload
})



export const registerHubAction = ({ 
    hub_url,
    hub_email,
    hub_password
  },idToken) => { 
    return async (dispatch) => {

        try {
            dispatch(registerHubStart({ loading: true , success: null, error: null}))
            hub_url = hub_url + '.mozilla-iot.org';
            const hubDat = { 
                hub_url,
                hub_email,
                hub_password
              };
            const data =  await createHub(hubDat,idToken)

            dispatch(registerHubSucess({ loading: false ,  success: true, error: null}))
            
        } catch (error) {
            dispatch(registerHubFailed({loading: false , success: false, error: 'your error message'}))
        }

    }
}