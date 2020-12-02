
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
    let devices = [];
    await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
        method: 'GET',
        headers: 
        {
            Authorization: 'Bearer ' + idToken
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data !== null || data.length > 0)
        {
            data.forEach(function(item) 
            {
                var device = item;
                var properties = {};
                for (var key in item.properties) 
                {
                    // This gets the name of the property since we don't know what the property is called
                    if (item.properties.hasOwnProperty(key)) 
                    {
                    var temp = item.properties[key];
                    // This adds two key/value pairs to each device so we can tell when it is checked for sharing, and also the current state (on or off for example)
                    temp.isChecked = false;
                    temp.value = null;
                    // properties.push({"property" : temp});
                    properties[key] = temp;
                    }
                }
                for (key in item.actions) 
                {
                    // This gets the name of the action since we don't know what the property is called
                    if (item.actions.hasOwnProperty(key)) 
                    {
                    temp = item.actions[key];
                    // This adds two key/value pairs to each device so we can tell when it is checked for sharing, and also the current state (on or off for example)
                    temp.type = "action";
                    temp.isChecked = false;
                    temp.value = null;
                    // properties.push({"property" : temp});
                    
                    properties[key] = temp;
                    }
                }
                // Adds the new, updated key/value pairs to the device
                console.log("%j", "original props", device.properties);
                console.log("%j", "new props", properties);
                device.properties = properties;
                devices.push(device);
            });
        }
    });
    // console.log("%j", null, devices);
    return devices;
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