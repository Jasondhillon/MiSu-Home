import { deleteADevice, deleteASharedAccount } from '../../services/deleteService'

const  stopSharingStart =(payload) =>({
    type: 'STOP_SHARING' ,
    payload
})

const  stopSharingSucess = (payload) =>({
    type: 'STOP_SHARING' ,
    payload
})


const  stopSharingFailed = (payload) =>({
    type: 'STOP_SHARING' ,
    payload
})



export const stopSharingAction = ( login_id ,devices ,idToken) => { 
    return async (dispatch) => {

        try {
            dispatch(stopSharingStart())
            //delete the array of devices
            //const data =  await Promise.allSettled( devices.map(
            //    device => deleteADevice( login_id,device ,idToken)
            //))
            //wipe out account if all devices are deleted
            const dt = await deleteASharedAccount(login_id, idToken)
            console.log('******* stop Sharing Hub**********')
         
            console.log({dt})
            console.log('******* stop Sharing Hub')
 

            dispatch(stopSharingSucess())
            
        } catch (error) {
            dispatch(stopSharingFailed())
        }

    }
}