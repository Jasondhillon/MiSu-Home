import { checkUserExists, createADevice, createProperty, createSharedUser } from '../../services/creationService'

const  shareStart =(payload) =>({
    type: 'SHARING' ,
    payload
})

const  shareSucess = (payload) =>({
    type: 'SHARING' ,
    payload
})


const  shareFailed = (payload) =>({
    type: 'SHARING' ,
    payload
})



export const shareAction = (idToken, email,device, accounts, properties) => { 
    return async (dispatch) => {
        console.log('**********device********')
        //console.log({device})
        console.log('**********accounnts********')
        console.log(properties)
        console.log('*******properties*****')

        try {

           

            dispatch(shareStart())

            //check  if email exist 
            const { message} = await checkUserExists(idToken,email)

           

           if (message ==1 ) {
              
                const  account = accounts.find( account => account.guest_email == email)

                console.log({account})
                    
                if(!account){
                    const data = await createSharedUser(idToken,email)
                    
                    console.log('***********creates user**********')
                    //console.log(data)

                    const account = {
                      "login_credentials_id": data.message,
                      "devices" : []
                    }

                    const des = await createADevice(account,idToken,{ title: device.title, description: device.description})
                    console.log('***************create device***')
                   // console.log(des)

                    const ret = await Promise.all(properties.map(prop => createProperty(idToken,account.login_credentials_id,device.id,prop)))
                    console.log('***************ret device***')
                    console.log(ret)
                }
                else {
                    //check if the device exist 

                    //if !exist create a device 
                    const ret = await Promise.all(properties.map(prop => createProperty(idToken,account.login_credentials_id,device.id,prop)))
                    console.log('***************ret device***')
                    console.log(ret)
                    //property
                }
            }
            else if( message ==0) {
              //failed
            }
            else{
                //failed
            }

            dispatch(shareSucess())
            
        } catch (error) {
            console.log('*****share failed')
            console.log({error })
            dispatch(shareFailed())
        }

    }
}