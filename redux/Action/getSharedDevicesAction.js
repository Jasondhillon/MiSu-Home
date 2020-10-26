import { getListofSharedDevices } from '../../services/listDevice'



const setDevices = (type,data,success) =>({
    type,
    payload: {...data,success}
})


export  const getSharedDevicesAction = (idToken) => {
    return  async (dispatch) =>{
        try {
            const data  = await getListofSharedDevices(null,idToken )

            //console.log('********** Shared Devices ***********');
            //console.log(data.message);
            dispatch(setDevices("SET_SHARED_DEVICES",{devices: data.message}, true))
            
        } catch (error) {
            dispatch(setDevices("SET_SHARED_DEVICES",null, false))
        }
    }
}