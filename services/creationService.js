
export const  createADevice = async (account, idToken,{ title , description}) => {
  const response  =  await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
        method: 'POST',
        headers: 
        {
          Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify({
          account: account.login_credentials_id,
          name: title,
          description: description
        })
      })

      return response.json()
}



export const checkUserExists = async (idToken, email) => {
const response =   await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/checkuserexists', {
        method: 'POST',
        headers: 
        {
            Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify({
          // TODO: Have the email come from user input
          email:  email,
          })
        })
        return response.json()
}

export const createSharedUser = async (idToken,email) =>  {
  const response = await  await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser', {
    method: 'POST',
    headers: 
    {
        Authorization: 'Bearer ' + idToken,
    },
    // TODO: Change this to user input
    body: JSON.stringify({
      email: email
      })
    })

    return response.json()
}




export const createHub = async ({ 
  hub_url,
  hub_email,
  hub_password
},idToken) => {
  const response = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/updatehubinfo', {
    method: 'POST',
    headers: 
    {
        Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      hub_url: hub_url,
      hub_email: hub_email,
      hub_password: hub_password
  })
})
  return  response.json()
}



// Sends a command to a hub
export const useSharedDevice = async (account, device, property) => {
    const response  = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
          method: 'POST',
          headers: 
          {
              Authorization: 'Bearer ' + this.props.appData.idToken
          },
          body: JSON.stringify({
            account: account.login_credentials_id,
            device: device.shared_device_properties_id,
            property: property.shared_property_id,
            value: !property.value
          })
      })
     return response.json()
  
}


export const createProperty = async (idToken,accountId,deviceId, property) => {
  console.log('*******propertyyy*****')
  console.log({property})
  const response = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property', {
    method: 'POST',
    headers: 
    {
        Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      account: accountId,
      device: deviceId,
      name: property.title + "",
      type: property.type + "",
      path:property.links[0].href + "",
      read_only: property.access ? 1:0,
      unrestricted: 0,
      time_range_start: null,
      time_range_end: null,
      time_range_reoccuring: null,
      gps_location: null,
      gps_location_distance: null
      })
    })

    return response.json()
}