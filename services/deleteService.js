
export const  deleteADevice = async ( login_id, device,idToken) => {
    const response = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
        method: 'DELETE',
        headers: 
        {
            Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify({
          account:  login_id,
          device: device
          })
      })
      const val = response.json();
      return val;
}

export const  deleteASharedAccount = async (id, idToken) => {
 const response =    await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser', {
        method: 'DELETE',
        headers: 
        {
            Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify({
          id: id,
        })
      })
      const val = response.json();
      return val;
}


export const  deleteAProperty = async (account, idToken, device, property) => {
    const response = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property', {
        method: 'DELETE',
        headers: 
        {
            Authorization: 'Bearer ' +  idToken,
        },
        body: JSON.stringify({
          account: account.login_credentials_id,
          device: device,
          property: property.shared_property_id
          })
      })
      const val = response.json();
      return val
}

export const endSharingSecondary = async (id ,idToken) => {

    return await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/endsharing', {
    method: 'DELETE',
    headers: 
    {
        Authorization: 'Bearer ' + idToken,
    },
    body: JSON.stringify({
      id: id,
    })
  })
}