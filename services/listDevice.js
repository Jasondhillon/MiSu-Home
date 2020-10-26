
export const getListofSharedDevices = async (hasNextToken = null,idToken) => {
    const response =  await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getshareddevices', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + idToken
          }
      })
   return response.json()   
  }


export const getDevices = async (idToken) => {
 
    const response  =await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
        method: 'GET',
        headers: 
        {
            Authorization: 'Bearer ' + idToken
        }
    })

    return response.json()
  }


export  const  getListofSharedAccounts = async (hasNextToken = null, idToken) => {
     const response  = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getdevicesyouresharing', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + idToken
          }
      })
      return response.json()
      
  }


export const   getValueForSharedDeviceProperty = async (account, device, property) => {
 const response =  await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues', {
    method: 'POST',
    headers: 
    {
        Authorization: 'Bearer ' + this.props.appData.idToken
    },
    body: JSON.stringify({
      account: account.login_credentials_id,
      device: device.shared_device_properties_id,
      property: property.shared_property_id
    })
})

return response.json()
}