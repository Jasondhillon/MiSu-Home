import { deleteADevice } from '../../services/deleteService'

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



export const stopSharingAction = (account ,devices ,idToken) => { 
    return async (dispatch) => {

        try {
            dispatch(stopSharingStart())
            //delete the array of devices
           const data =  await Promise.all( devices.map(
                device => deleteADevice(account,device ,idToken)
            ))

            console.log('******* stop Sharing Hub**********')
            console.log({account})
            console.log(data)
 

            dispatch(stopSharingSucess())
            
        } catch (error) {
            dispatch(stopSharingFailed())
        }

    }
}