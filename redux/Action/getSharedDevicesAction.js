import { getListofSharedDevices } from '../../services/listDevice'



const setDevices = (type,data,success) =>({
    type,
    payload: {...data,success}
})


export  const getSharedDevicesAction = (idToken) => {
    return  async (dispatch) =>{
        try {
            const data  = await getListofSharedDevices(null,idToken )

            
            dispatch(setDevices("SET_SHARED_DEVICES",{devices: data.message}, true))
            
        } catch (error) {
            //update prevent null fails : will show up as empty 
            dispatch(setDevices("SET_SHARED_DEVICES",{devices: []}, false))
        }
    }
}


export const updateDevices = (device, access) =>{

    return  async (dispatch) =>{
        try {
            const data  = await getListofSharedDevices(null,idToken )

            



            dispatch(setDevices("SET_SHARED_DEVICES",{devices: data.message}, true))
            
        } catch (error) {
            dispatch(setDevices("SET_SHARED_DEVICES",null, false))
        }
    }

}