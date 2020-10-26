import { checkUserExists, createADevice, createProperty, createSharedUser } from '../../services/creationService'

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
        console.log('**********device********')
        console.log({device})
        console.log('**********device********')

        console.log('**********accounts********')
        console.log({accounts})
        console.log('**********accounts********')

        console.log('*******properties*****')
        console.log({properties})
        console.log('*******properties*****')

        try {

           
            console.log('*******start*****')

            dispatch(shareStart())

            //check  if email exist 

            console.log('*******email exists for*****')
            console.log({idToken})
            console.log({email})
            console.log('*******email exists for*****')
            const { message} = await checkUserExists(idToken,email)

           
            console.log('*******email exists??*****')
            console.log({message})
            console.log('*******email exists??*****')

           if (message == 1) {
              
                const  account = accounts.find( account => account.guest_email == email)

                console.log('*******account found*****')
                console.log({account})
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
                            device = account.devices[device2].shared_device_properties_id;
                            preexisting = 1;
                        }
                    }
                    // If the device has not been previously shared, create a new entry
                    if (preexisting === 0)
                    {
                        const des = await createADevice(account,idToken,{ title: device.title, description: device.description})
                        console.log('***************create device***')
                        console.log(des)
                        console.log('***************create device***')
                        device.id = des.message;
                    }


                    //if !exist create a device 
                    const ret = await Promise.all(properties.map(prop => createProperty(idToken,account.login_credentials_id,device.id,prop)))
                    console.log('***************ret device***')
                    console.log(ret)
                    console.log('***************ret device***')
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