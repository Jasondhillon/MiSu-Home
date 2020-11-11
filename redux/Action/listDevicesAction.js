
import { getDevices } from '../../services/listDevice'


const setDevices =  (type, data, success) => ({
    type,
    payload: { ...data ,success}
})


export const listDevicesAction = (idToken) => { 
  return async (dispatch) => {
        try {   
            const data  = await getDevices(idToken)
            dispatch( setDevices('SET_DEVICES',{devices: data},true))
        } catch (error) {
            dispatch( setDevices('UNSET_DEVICES',null,false))
        }
    }  
}