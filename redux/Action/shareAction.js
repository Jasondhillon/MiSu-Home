import { checkUserExists, createADevice, createProperty, createSharedUser } from '../../services/creationService'
import { deleteADevice, deleteAProperty } from '../../services/deleteService'
import { getSharedAccountsAction } from '../Action/getSharedAccountsAction'
import { getSharedDevicesAction } from '../Action/getSharedDevicesAction'
import { showToast } from '../../utils/toast';

export const  shareStart =(payload) =>({
    type: 'SHARING' ,
    payload
})

export const  shareSucess = (payload) =>({
    type: 'SHARING' ,
    payload
})


export const  shareFailed = (payload) =>({
    type: 'SHARING' ,
    payload
})



export const shareAction = (idToken, email,device, accounts, properties, options) => { 
    return async (dispatch) => {


        if(properties == null)
        {
            return;   
        }

        dispatch(shareStart({ loading: true}))

        //check  if email exist 

        const { message} = await checkUserExists(idToken,email)

        if (message == 1) {
            const  account = accounts.find( account => account.guest_email == email)
                
            if(!account){
                const data = await createSharedUser(idToken,email)
                
                const account = {
                    "login_credentials_id": data.message,
                    "devices" : []
                }

                const des = await createADevice(account,idToken,{ title: device.title, description: device.description})

                device.id = des.message;

                await Promise.all(properties.map(async prop => 
                    await createProperty(idToken,account.login_credentials_id,device.id,prop,options)
                ))
                
                showToast("Sent share request");
                dispatch(getSharedAccountsAction(idToken))
                dispatch(getSharedDevicesAction(idToken))
                dispatch(shareSucess({ loading: false ,success: true}))
            }
            else 
            {
                var preexisting = 0;
                for (var device2 in account.devices)
                {
                    if (device.title === account.devices[device2].name && device.description === account.devices[device2].description)
                    {

                        device.id = account.devices[device2].shared_device_properties_id;
                        preexisting = 1;
                    }
                }
                // Check if all properties are set to allow 0
                if(properties.every(x => x.access == 0 || x.access == null))
                {
                    // then delete the device
                    if(preexisting == 1)
                    {
                        const des = await deleteADevice(account.login_credentials_id, device.id,idToken)
                        showToast("Removed device");
                    }
                    else
                        showToast("No properties selected");
                    dispatch(getSharedAccountsAction(idToken))
                    dispatch(getSharedDevicesAction(idToken))
                    dispatch(shareSucess({ loading: false ,success: true}))
                    return;
                }

                // If the device has not been previously shared, create a new entry
                if (preexisting === 0)
                {
                    const des = await createADevice(account,idToken,{ title: device.title, description: device.description})
                    device.id = des.message;
                }

                await Promise.all(properties.map(async prop => 
                {
                    // check if the property exist 
                    // Check if the device is already shared to the user
                    for(var dvc = 0; dvc < account.devices.length; dvc++) 
                    {
                        for(var p = 0; p < account.devices[dvc].properties.length; p++) 
                        {
                            if(account.devices[dvc].properties[p].name == prop.title)
                            {
                                try {
                                    await deleteAProperty(account,idToken,device.id,account.devices[dvc].properties[p])
                                } catch (error) {

                                    console.log('********errror*****')
                                    console.log('error deleting property')
                                }
                                
                            }
                        }
                    }
                    await createProperty(idToken,account.login_credentials_id,device.id,prop,options)
                }))

                if(preexisting == 0)
                    showToast("Shared device!");
                else
                    showToast("Updated permissions!");
                dispatch(getSharedAccountsAction(idToken))
                dispatch(getSharedDevicesAction(idToken))
                dispatch(shareSucess({ loading: false ,success: true}))
            }
        }
        else {
            showToast("User not found... Cancelling sharing");
            dispatch(shareFailed({ loading: false, success : false}))
        }
    }
}