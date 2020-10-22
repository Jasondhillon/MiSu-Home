
export const  deleteADevice = async (idToken,account, device) => {
    const response = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
        method: 'DELETE',
        headers: 
        {
            Authorization: 'Bearer ' + idToken,
        },
        body: JSON.stringify({
          account: account.login_credentials_id,
          device: device.shared_device_properties_id
          })
      })

      return response.json()
}

export const   deleteASharedAccount = async (id, guest_email, devices) => {
 const response =    await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser', {
        method: 'DELETE',
        headers: 
        {
            Authorization: 'Bearer ' + this.props.appData.idToken,
        },
        body: JSON.stringify({
          id: id,
        })
      })

      return response.json()
}


export const  deleteAProperty = async (account, device, property) => {
    const response = await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property', {
        method: 'DELETE',
        headers: 
        {
            Authorization: 'Bearer ' + this.props.appData.idToken,
        },
        body: JSON.stringify({
          account: account.login_credentials_id,
          device: device.shared_device_properties_id,
          property: property.shared_property_id
          })
      })

      return response.json()
}