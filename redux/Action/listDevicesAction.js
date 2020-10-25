
import { getDevices } from '../../services/listDevice'


const setDevices =  (type, data, success) => ({
    type,
    payload: { ...data ,success}
})


export const listDevicesAction = (idToken) => { 
  return async (dispatch) => {
        try {   
            const data  = await getDevices(idToken)
            
            console.log('**********Devices List***********')
            console.log({data})
           dispatch( setDevices('SET_DEVICES',{devices: data},true))
    
        } catch (error) {
            //console.log('**********Devices Error ***********')
            //console.log({data})
            dispatch( setDevices('UNSET_DEVICES',null,false))
        }
    }  
}