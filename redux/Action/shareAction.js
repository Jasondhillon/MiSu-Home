import { checkUserExists, createADevice, createProperty, createSharedUser } from '../../services/creationService'
import { deleteAProperty } from '../../services/deleteService'

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



export const shareAction = (idToken, email,device, accounts, properties) => { 
    return async (dispatch) => {
        if(properties == null)
        {
            console.log('Not Property Changes ********');
            return;   
        }
        console.log('**********device********')
        //console.log({device})
        console.log('**********device********')

        console.log('**********accounts********')
        //console.log({accounts})
        console.log('**********accounts********')

        console.log('*******properties*****')
        //console.log({properties})
        console.log('*******properties*****')
        try {

           
            console.log('*******start*****')

            dispatch(shareStart())

            //check  if email exist 

            console.log('*******email exists for ' + email + '*****')
            const { message} = await checkUserExists(idToken,email)

           if (message == 1) {
              
                const  account = accounts.find( account => account.guest_email == email)

                console.log('*******account found*****')
                    
                if(!account){
                    const data = await createSharedUser(idToken,email)
                    
                    console.log('***********creates shared user**********')
                    console.log(data)
                    console.log('***********creates shared user**********')

                    const account = {
                      "login_credentials_id": data.message,
                      "devices" : []
                    }

                    const des = await createADevice(account,idToken,{ title: device.title, description: device.description})
                    console.log('***************create device***')
                    console.log(des)

                    const ret = await Promise.all(properties.map(prop => createProperty(idToken,account.login_credentials_id,device.id,prop)))
                    console.log('***************ret device***')
                    console.log(ret)
                }
                else 
                {
                    // check if the device exist 
                    // Check if the device is already shared to the user
                    var preexisting = 0;
                    for (var device2 in account.devices)
                    {
                        if (device.title === account.devices[device2].name && device.description === account.devices[device2].description)
                        {

                            device.id = account.devices[device2].shared_device_properties_id;
                            preexisting = 1;
                        }
                    }
                    // If the device has not been previously shared, create a new entry
                    if (preexisting === 0)
                    {
                        const des = await createADevice(account,idToken,{ title: device.title, description: device.description})
                        device.id = des.message;
                        console.log('* Creating new device');
                        console.log('------------------------------------------------------------');
                    }

                    console.log('---')
                    console.log(properties);
                    console.log('---')
    
                    //if !exist create a property
                    const ret = await Promise.all(properties.map(async prop => 
                    {
                        // check if the property exist 
                        // Check if the device is already shared to the user
                        for(var dvc = 0; dvc < account.devices.length; dvc++) 
                        {
                            console.log(' -- checking device');
                            const foundDev = 0;
                            for(var p = 0; p < account.devices[dvc].properties.length; p++) 
                            {
                                console.log("checking " + account.devices[dvc].properties[p].name + ", " + prop.title);
                                if(account.devices[dvc].properties[p].name == prop.title)
                                {
                                    const responseDel = await deleteAProperty(account,idToken,device.id,account.devices[dvc].properties[p])
                                    console.log('* Deleting existing property');
                                    foundDev = 1;
                                    console.log('------------------------------------------------------------');
                                    break;
                                }
                            }
                            if(foundDev)
                                break;
                        }
                        
                        const responseProps = await createProperty(idToken,account.login_credentials_id,device.id,prop)
                        console.log('* Creating new property');
                        console.log(prop);
                        console.log('------------------------------------------------------------');
                    }))
                    //property
                }
            }
            else {
              //failed
                console.log('*****share failed cleanly')
            }

            dispatch(shareSucess())
            
        } catch (error) {
            console.log('*****share failed')
            console.log({error })
            dispatch(shareFailed())
        }
    }
}