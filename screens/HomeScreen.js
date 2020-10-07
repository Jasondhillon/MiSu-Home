import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator, RefreshControl} from 'react-native';
import CheckBox from '@react-native-community/checkbox'; 
import { Auth } from 'aws-amplify';
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});
// 0 for no logs, 1 for basic logs, 2 for verbose
const debug = 0;

export default class HomeScreen extends React.Component {

    // Holds all of our global variables
    state = 
    {
      id: null,
      name: null,
      email: null,
      error: null,
      message: null,
      idToken: null,
      accessToken: null,
      hub_url: null,
      hub_email: null,
      devices: null,
      sharedDevices: null,
      sharedAccounts: null,
      selectedProperties: 0,
      refreshing: false
    }
    // This creates little popups on the screen for Android phones
    showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.LONG);
    };

    // Called when when the screen is about to load, grabs all the info to display
    componentDidMount() {
      Auth.currentSession().
      then(data1 => {
        this.setState({
            id: data1.getIdToken().payload.sub,
            idToken: data1.getIdToken().getJwtToken(),
            accessToken: data1.getAccessToken().getJwtToken(),
            email: data1.getIdToken().payload.email,
            name: data1.getIdToken().payload.name
        });
      })
      .then(() => {
        if (debug > 0)
          console.log("=====================================================\n");
        if (debug == 2)
          console.log(this.state.idToken);
        this.getHubInfo();
      }).then(()=> {
        this.getListofSharedAccounts();
        this.getListofSharedDevices();
      });
    }

    // Supposed to refresh the AWS token if it expires, no idea if it actually does
    refreshToken() {
      Auth.currentSession().
      then(data1 => {
          this.setState({
              id: data1.getIdToken().payload.sub,
              idToken: data1.getIdToken().getJwtToken(),
              accessToken: data1.getAccessToken().getJwtToken(),
              email: data1.getIdToken().payload.email,
              name: data1.getIdToken().payload.name
          });
      });
    }

    // Gets user's hub information from User's table through ID in idToken
    getHubInfo = async () => {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getUserInfo', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken
          }
        })
        .then(response => response.json())
        .then(data => {
          // This is just a way to check if the user has a hub listed at all, if not there's no hub linked to this account and therefore no hub information exists to display
          if(data.hub_url !== undefined && data.hub_url !== null && data.hub_url !== "")
          {
            this.setState({hub_url: data.hub_url, hub_email: data.email, error: null});
            this.getDevices();
          }
        })
        .catch((error) => {
          console.error('getHubInfo error: %j', error);
          this.showToast(error);
          this.setState({error});
        });
    }

    // Sets/updates the user's hub info, probably won't be used in production but useful for debugging, adds the hardcoded hub information to the user
    setHubInfo = async () => {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/updatehubinfo', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
                hub_url: 'cop4934.mozilla-iot.org',
                hub_email: 'test@cop4934test.com',
                hub_password: '1234'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({error: null});
            this.showToast("Info successfully updated!");
            this.getHubInfo();
        })
        .catch((error) => {
            console.error('setHubInfo error: %j', error);
            this.showToast(error);
            this.setState({error});
        });
    }

    // Gets user's hub devices from User's table through ID in idToken
    getDevices = async () => {
      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken
          }
      })
      .then(response => response.json())
      .then(data => {
          let devices = [];
          if(data !== null || data.length > 0)
          {
            data.forEach(function(item) 
            {
              var device = item;
              var properties = [];
              for (var key in item.properties) 
              {
                // This gets the name of the property since we don't know what the property is called
                if (item.properties.hasOwnProperty(key)) 
                {
                  var temp = item.properties[key];
                  // This adds two key/value pairs to each device so we can tell when it is checked for sharing, and also the current state (on or off for example)
                  temp.isChecked = false;
                  temp.value = null;
                  properties.push({"property" : temp});
                }
              }
              // Adds the new, updated key/value pairs to the device
              device.newProps = properties;
              devices.push(device);
            });
            
          this.setState({devices});
          this.showToast("Devices list updated!");
          }
          else
            throw error("Devices empty"); 
      })
      .catch((error) => {
          console.log('getDevices error:', error);
          this.showToast(error);
          this.setState({error});
      });
    }

    // Signs the user out and sends them back to the login screen
    signOut = async () => {
        this.showToast("Signing out!");
        Auth.signOut()
        .then(this.props.navigation.navigate("Auth"));
    }

    // Get list of accounts/devices/properties shared to the user
    getListofSharedDevices = async (hasNextToken = null) => {
      try
      {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getshareddevices', {
            method: 'GET',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken
            }
        })
        .then(response => response.json())
        .then(data => {
          if(data.message.length > 0)
          {
            if (debug === 2)
              console.log("%j", null, data.message);
            // We get the shared information and make a call to get the current values
            this.setState({sharedDevices: data.message}, () => {this.getCurrentValues()});
          }
        });
      }
      catch (error)
      {
        console.log("getListofSharedDevices Error:%j",1,error);
        this.setState({error:error.message});
      }
    }

    // Get list of devices the user is sharing to others
    getListofSharedAccounts = async (hasNextToken = null) => {
      try
      {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getdevicesyouresharing', {
            method: 'GET',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken
            }
        })
        .then(response => response.json())
        .then(data => {
          if(data.message.length > 0)
          {
            if (debug == 2)
              console.log("%j", "Accounts you're sharing sharing", data);
            this.setState({sharedAccounts: data.message});
          }
        });
      }
      catch (error)
      {
        console.log("getListofSharedAccounts error: %j",1,error);
        this.setState({error:error.message});
      }
    }

    // Accepts/declines an invitation sent by a primary user
    updateInvitation = async (account, value) => {
      try
      {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/invitation', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
            },
            body: JSON.stringify({
              account: account,
              accepted: value
            })
        })
        .then(response => response.json())
        .then(data => {
          if(data.statusCode === 200)
          {
            if(value === 0)
            {
              this.showToast("Declined invitation");
              var currSharedDevices = this.state.sharedDevices.filter( el => el.login_credentials_id !== account);
                this.setState({sharedDevices: currSharedDevices});
            }
            else
            {
              this.showToast("Accepted invitation");
            }
            this.onRefresh();
            if (debug == 2)
              console.log("%j", "Updated Invitation", data);
          }
          else 
          {
            if (debug == 2)
              console.log("%j", "Error updating Invitation", data);
            this.setState({error:data.message});
          }
        });
      }
      catch (error)
      {
        console.log("Error updating Invitation: %j",1,error);
        this.setState({error:error.message});
      }
    }

    // Creates a new login for a secondary user on the primary stakeholders hub and a new entry into the SharedAccounts tables
    createASharedAccount = async () => {
      try 
      {
        // Check if at least one property to share has been selected
        if (this.state.selectedProperties > 0)
        {
          // Checks if the user we are sharing to has an account/is signed up already
          var userExists = null;
          await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/checkuserexists', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
            },
            body: JSON.stringify({
              // TODO: Have the email come from user input
              email: "jackson@example.com",
              })
            })
            .then(response => response.json())
            .then(data => {
                userExists = data.message;
            })
            .catch((error) => {
                console.error("CreateASharedAccount error:\n", error);
                this.showToast(error);
                this.setState({error});
            });
          // If the user does exist
          if(userExists == 1)
          {
            var acc, isShared = 0, account;
            for (acc in this.state.sharedAccounts)
            {
              // TODO: Change this to use user input
              // Checks if the primary user has already created a SharedAccount for the person they are sharing to
              if (this.state.sharedAccounts[acc].guest_email === "jackson@example.com")
              {
                account = this.state.sharedAccounts[acc];
                isShared = 1;
              }
            }
            // If a guest account/login_credentials entry does not already exist for the user, create a new entry
            if (isShared === 0)
            {
              await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser', {
              method: 'POST',
              headers: 
              {
                  Authorization: 'Bearer ' + this.state.idToken,
              },
              // TODO: Change this to user input
              body: JSON.stringify({
                email: "jackson@example.com",
                })
              })
              .then(response => response.json())
              .then(data => {
                  if (data.statusCode === 400)
                  {
                   this.setState({error: "A user with that email already exists on the hub, please remove the user from the hub to try again"});
                   this.showToast(this.state.error);
                  }
                  else
                  {
                    if (debug > 0)
                      console.log("%j", null, data);
                    account = 
                    {
                      "login_credentials_id": data.message,
                      "devices" : []
                    }
                    this.setState({error: null});
                    this.showToast("Shared device succesfully!");
                    this.getListofSharedAccounts();
                  }
              })
              //Proceed to add the device/properties to the account
              .then(() => {
                if (debug == 2)
                  console.log("Prexisting credentials exist for the user we are trying to share to, adding the new devices and properties to that account...");
                
                this.createADevice(account);
              })
              .catch((error) => {
                  console.log("CreateASharedAccount error:\n", error + "");
                  this.showToast(error + "");
                  this.setState({error: error + ""});
              });
            }
            // If there already is a sharedAccount for the person we are sharing to, simply add the new device/property to it
            else
            {
              if(account)
                this.createADevice(account);
              else
                console.log("Error acquiring the account id");
            }
          }
          else
          {
            this.setState({error: "User by this email address doesn't exist, please tell them to setup an account first"});
            this.showToast("User by this email address doesn't exist, please tell them to setup an account first");
          }
        }
        else
          this.setState({error: "You need to have at least a single property selected to share!"});
      }
      catch (err)
      {
        console.log("Error adding a shared account%j",2,err);
        // this.setState({error:err.message});
      }
    }

    // Creates a new entry to the devices table 
    createADevice = async (account) => {
      try 
      {
        if (debug > 0)
          console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - -");
        // Search through the devices to find which have been selected
        var deviceSelected;
        for (deviceSelected in this.state.devices)
        {
          var properties = [];
          var property;
          // Check which device has been selected
          for (property in this.state.devices[deviceSelected].newProps)
          {
            // Check which properties have been selected
            if (this.state.devices[deviceSelected].newProps[property].property.isChecked)
              properties.push(this.state.devices[deviceSelected].newProps[property]);
          }
          // Create device that has properties selected to share
          if (properties.length !== 0)
          {
            // Check if the device is already shared to the user
            var preexistingDevice, preexisting = 0;
            for (var device2 in account.devices)
            {
              if (this.state.devices[deviceSelected].title === account.devices[device2].name && this.state.devices[deviceSelected].description === account.devices[device2].description)
              {
                preexistingDevice = account.devices[device2].shared_device_properties_id;
                preexisting = 1;
              }
            }
            // If the device has not been previously shared, create a new entry
            if (preexisting === 0)
            {
              await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
                method: 'POST',
                headers: 
                {
                  Authorization: 'Bearer ' + this.state.idToken,
                },
                body: JSON.stringify({
                  account: account.login_credentials_id,
                  name: this.state.devices[deviceSelected].title,
                  description: this.state.devices[deviceSelected].description
                })
              })
              .then(response => response.json())
              .then(data => {
                if (debug > 0)
                {
                  console.log("%j", null, data);
                }
                if(data.statusCode === 200)
                  this.createAProperty(account.login_credentials_id, data.message, properties);
                else if (data.statusCode === 400)
                {
                  this.setState({error: data.message});
                  this.showToast(data.message);
                }
              })
              .catch((error) => {
                  console.error("CreateASharedDevice error:\n", error);
                  this.showToast(error);
                  this.setState({error});
              });
            }
            // If the device already has been shared to the user, move onto creating the properties
            else if (preexisting == 1)
            {
              this.createAProperty(account.login_credentials_id, preexistingDevice, properties);
            }
          }
        } 
      }
      catch (err)
      {
        console.log("Error adding a device");
        console.log("%j", 2, err);
        this.setState({error:err.message});
        this.refreshToken();
      }
    }

    // Creates a new entry to the properties table
    createAProperty = async (accountId, deviceId, properties) => {
      try {
        if (properties)
        {
          var property;
          for (property in properties)
          {
            if (debug === 2)
              console.log("Creating a property...");
            await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
            },
            body: JSON.stringify({
              account: accountId,
              device: deviceId,
              name: properties[property].property.title + "",
              type: properties[property].property.type + "",
              path: properties[property].property.links[0].href + "",
              read_only: properties[property].property.readOnly ? 1:0,
              unrestricted: 1,
              time_range_start: null,
              time_range_end: null,
              time_range_reoccuring: null,
              gps_location: null,
              gps_location_distance: null
              })
            })
            .then(response => response.json())
            .then(data => {
              if (debug > 0)
              {
                console.log("%j", null, data);
              }
              if(data.statusCode === 200)
                this.createAProperty(data.message, properties);
              else if (statusCode === 400)
                this.setState({error: data.message});
                this.showToast(data.message);
            })
            .catch((error) => {
                console.error("createAProperty error:\n", error);
                this.showToast(error);
                this.setState({error});
            });
          }
        }
      }
      catch (err)
      {
        console.log("Error adding a property: %j", null, err);
        this.setState({error:err.message});
        this.refreshToken();
      }
      finally {
        this.getListofSharedAccounts();
      }
    }

    // Removes a device and all properties associated with this shared device from the secondary user
    deleteADevice = async (account, device) => {
      try {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/device', {
          method: 'DELETE',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken,
          },
          body: JSON.stringify({
            account: account.login_credentials_id,
            device: device.shared_device_properties_id
            })
        })
        .then(response => response.json())
        .then(data => {
          if (debug > 0)
          {
            console.log("%j", null, data);
          }
          // if(data.statusCode === 200)
          else if (data.statusCode === 400)
            this.setState({error: data.message});
            this.showToast(data.message);
        })
        .catch((error) => {
            console.error("deleteADevice error:\n", error);
            this.showToast(error);
            this.setState({error});
        });

        var currSharedAccounts = this.state.sharedAccounts;
        var acc = currSharedAccounts[currSharedAccounts.indexOf(account)];
        var dev = acc.devices.filter(el => el.shared_device_properties_id !== device.shared_device_properties_id);
        currSharedAccounts[currSharedAccounts.indexOf(account)].devices = dev;
        this.setState({sharedAccounts: currSharedAccounts});

      }
      catch (err)
      {
        console.log("Error deleting a device %j",2, err);
        this.setState({error:err.message});
        this.refreshToken();
      }
    }

    // Removes the sharedAccount entry and removes the login created for the secondary user from the primary user's hub, alsd deletes all the devices and propertys associated with the account
    deleteASharedAccount = async (id, guest_email, devices) => {
      try {
        if (debug > 0)
        {
          console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - -");
          console.log("Deleting account " + id +"...");
        }
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser', {
            method: 'DELETE',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
            },
            body: JSON.stringify({
              id: id,
            })
          })
          .then(response => response.json())
          .then(data => {
              this.setState({error: null});
              if (debug > 0)
                console.log("%j", null, data);
              if (data.statusCode === 200)
              {
                this.showToast("Removed user from your hub successfully!");
                  // Removes the account from the list displayed on the client-side
                var currSharedAccounts = this.state.sharedAccounts.filter( el => el.login_credentials_id !== id);
                this.setState({sharedAccounts: currSharedAccounts});
              }
              else if (data.statusCode === 400)
              {
                this.showToast(data.message);
                this.setState({error: data.message});
              }
          })
          .catch((error) => {
              console.error("deleteASharedAccount error:\n", error);
              this.showToast(error);
              this.setState({error});
          });

      }
      catch (err)
      {
        console.log("Error deleting login_credentials: " + err);
        this.setState({error:err.message});
        this.refreshToken();
      }
    }

    // Deletes a property from the properties table
    deleteAProperty = async (account, device, property) => {
      if (debug > 0)
      {
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - -");
      }
      try {
        // console.log("Deleting property " + id + "...");
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/property', {
          method: 'DELETE',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken,
          },
          body: JSON.stringify({
            account: account.login_credentials_id,
            device: device.shared_device_properties_id,
            property: property.shared_property_id
            })
        })
        .then(response => response.json())
        .then(data => {
          if (debug > 0)
          {
            console.log("%j", null, data);
          }
          if(data.statusCode === 200)
          {
            var currProperties = this.state.sharedAccounts;
            var acc = currProperties[currProperties.indexOf(account)];
            var dev = acc.devices[acc.devices.indexOf(device)];
            var props = dev.properties.filter( el => el.shared_property_id !== property.shared_property_id);
            currProperties[currProperties.indexOf(account)].devices[acc.devices.indexOf(device)].properties = props;
            this.setState({sharedAccounts: currProperties});
          }
          else if (statusCode === 400)
            this.setState({error: data.message});
            this.showToast(data.message);
        })
        .catch((error) => {
            console.error("deleteAProperty error:\n", error);
            this.showToast(error);
            this.setState({error});
        });

      }
      catch (err)
      {
        console.log("Error deleting a property%j",2, err);
        this.setState({error:err.message});
        this.refreshToken();
      }
    }

    // Adds a device/property to share
    toggleCheckbox = (device, property) => {
      // Find the device and the property checked and set the value accordingly
      var list = this.state.devices;
      var temp = list[list.indexOf(device)].newProps;
      temp = temp[temp.indexOf(property)];
      temp.property.isChecked = !temp.property.isChecked;
      this.setState({devices: list});

      // Keep track of the number of properties selected
      if(temp.property.isChecked)
        this.setState({selectedProperties: this.state.selectedProperties+1});
      else
        this.setState({selectedProperties: this.state.selectedProperties-1});
    }

    // Gets the current state for a property from the hub
    getValueForSharedDeviceProperty = async (account, device, property) => {
      // console.log("\n\n%j", 2, property);
      if (debug == 2)
        console.log("getting values for:", account, device, property);
      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues', {
          method: 'POST',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken
          },
          body: JSON.stringify({
            account: account.login_credentials_id,
            device: device.shared_device_properties_id,
            property: property.shared_property_id
          })
      })
      .then(response => response.json())
      .then(data => {
          if(data.message !== null)
          {
            // accounts[x].devices.items[x].properties.items[x]
            var list = this.state.sharedDevices;
            var temp = list[list.indexOf(account)].devices;
            temp = temp[temp.indexOf(device)].properties
            temp = temp[temp.indexOf(property)];

            // Sets the value to the appropriate propertys
            for (var key in data.message) 
            {
              if (data.message.hasOwnProperty(key)) 
              {
                // console.log("Changing " + temp.name + " to " + data[key]);
                temp.value = data.message[key];
              }
            }

            this.setState({sharedDevices: list});
          }
          else
            throw error("Values empty"); 
      })
      .catch((error) => {
          console.error('getValueForSharedDeviceProperty error:', error);
          this.showToast(error);
          this.setState({error});
      });

    }

    // Goes through all the devices and properties and gets the current state
    getCurrentValues = async () => {
      this.state.sharedDevices.map((account) => {
        account.devices.map((device) => {
          device.properties.map((property) => {
            property.value = this.getValueForSharedDeviceProperty(account, device, property);
          });
        });
      });
    }

    // Sends a command to a hub
    useSharedDevice = async (account, device, property) => {
      // console.log(JSON.stringify(property, null, 2));
      // console.log("Turning " + property.name + " " + !property.value);
      var list = this.state.sharedDevices;
      var temp = list[list.indexOf(account)].devices;
      temp = temp[temp.indexOf(device)].properties
      temp = temp[temp.indexOf(property)];
      // Removes the UI button while the action is being done by setting it to read only
      temp.read_only = true;
      this.setState({sharedDevices: list});

      if (property.type == "boolean")
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken
            },
            body: JSON.stringify({
              account: account.login_credentials_id,
              device: device.shared_device_properties_id,
              property: property.shared_property_id,
              value: !property.value
            })
        })
        .then(response => response.json())
        .then(data => {
          temp.value = !temp.value;
          // Retoggles the button on the UI allowing the device to be toggled again
          temp.read_only = false;
          this.setState({sharedDevices: list});
          this.getValueForSharedDeviceProperty(account, device, property);
        })
        .catch((error) => {
            console.error('useSharedDevice error:', error);
            this.showToast(error);
            this.setState({error});
        });
    }

    // Retrieves all the information on pull down/refresh of the app
    onRefresh = () => {
      if (!this.state.refreshing)
      {
        this.setState({refreshing: true, error: null});
        this.refreshToken();
        if (debug > 0)
          console.log("========================================================\n");
        if (this.state.devices !== null)
          this.getDevices();
        this.getListofSharedAccounts();
        this.getListofSharedDevices();
        this.setState({refreshing: false});
      }
    }
      
    // This is where all the components are rendered on the screen
    render() 
    {
      return (
        <ScrollView style={styles.container}
          refreshControl={
          <RefreshControl refreshing={this.state.refreshing}  onRefresh={this.onRefresh}/>
        }>
          {/* UI Messages */}
          {this.state.error && <Text style={{color: 'red', alignSelf: 'center'}}>{this.state.error}</Text>}
          {this.state.message && <Text style={{color:'black', alignSelf: 'center'}}>{this.state.message}</Text>}

          {/* Cognito information */}
          {/* <Text style={styles.greeting}>(Cognito Info)</Text>
          {this.state.name && <Text style={{alignSelf: 'center'}}>Hello {this.state.name}!</Text>}
          {this.state.id && <Text style={{alignSelf: 'center'}}>UID: {this.state.id}</Text>}
          {this.state.email && <Text style={{alignSelf: 'center'}}>Email: {this.state.email}</Text>} */}

            {/* Buttons */}
            {/* {this.state.hub_url === null && <TouchableOpacity style={styles.getUserInfoButton} onPress={this.getHubInfo}>
              <Text style={{color: '#FFF', fontWeight: '500'}}>Get User Information</Text>
            </TouchableOpacity>} */}
            {/* {this.state.hub_url === null && <TouchableOpacity style={styles.setUserInfoButton} onPress={this.setHubInfo}>
              <Text style={{color: '#FFF', fontWeight: '500'}}>Update Hub Information(Hard Coded)</Text>
            </TouchableOpacity>} */}

            {/* User DB information */}
            {/* {this.state.hub_url !== null && <Text style={styles.greeting}>(Secured Account Info)</Text>}
            {this.state.hub_url !== null && <Text style={{alignSelf: 'center'}}>Add your hub information!</Text>}
            {this.state.hub_url && <Text style={{alignSelf: 'center'}}>Hub URL: {this.state.hub_url}</Text>}
            {this.state.hub_url && <Text style={{alignSelf: 'center'}}>Hub Email: {this.state.hub_email}</Text>} */}

            {/* Devices on hub information */}
            {this.state.hub_url !== null && <Text style={styles.greeting}>(Devices on Hub)</Text>}
            {this.state.devices == null && this.state.hub_url !== null && <ActivityIndicator size="large"/>}
            {
            this.state.devices && 
            <ScrollView style={{alignSelf: 'center'}}>
              {
                this.state.devices.map((device, index) => (
                  <View key={index}>
                    <Text style={styles.devices}>{device.title}</Text>
                    <View>
                    {
                      device.newProps.map((property, index2) => (
                        <View key={index2} style={{flexDirection: 'row', alignSelf:'flex-start'}} >
                          <CheckBox 
                          value={this.state.devices[index].newProps[index2].property.isChecked} 
                          onChange={() => {this.toggleCheckbox(device, property)}}
                          />
                          <View>
                            <Text style={styles.devices}>{property.property.title}</Text>
                            {
                              property.property.value == null && <Text style={styles.devices}>   {property.property.type}</Text>
                            }
                            {/* {
                              property.property.value !== null && property.property.type === "boolean" &&
                              <Text style={styles.devices}> 
                              {
                                property.property.value ? "True" : "False"
                              }</Text>
                            }
                            {
                              property.property.value !== null && property.property.type !== "boolean" &&
                              <Text style={styles.devices}>
                              {property.property.value}
                              </Text>
                            } */}
                          </View>
                          {
                            !property.property.readOnly && property.property.value !== null &&
                            <TouchableOpacity style={styles.button5} onPress={() => this.useDevice(device, property)}> 
                              <Text style={{fontSize:15, color: '#FFF'}}>o</Text>
                            </TouchableOpacity>
                          }

                        </View>
                      ))
                    }
                    </View>
                  </View>
                ))
              }
            </ScrollView>
            }
            {this.state.hub_url !== null && <TouchableOpacity style={styles.setUserInfoButton} onPress={this.createASharedAccount}>
              <Text style={{color: '#FFF', fontWeight: '500'}}>Share Devices to Jackson@example.com</Text>
            </TouchableOpacity>
            }

            {/* Accounts Shared to You */}
            {this.state.sharedDevices !== null && this.state.sharedDevices.length > 0 && <Text style={styles.greeting}>Accounts Shared to You</Text>}
            {
              this.state.sharedDevices &&
              this.state.sharedDevices.map((account, index) => (
                account.login_credentials_id !== null &&
                <View key={index}>
                  <View style={{flexDirection: 'row', alignSelf:'flex-start', marginLeft: 20}}>
                    {/* <TouchableOpacity style={styles.button4} onPress={this.deleteASharedAccount.bind(this, account.id)}> 
                      <Text style={{fontSize:20}}>X</Text>
                    </TouchableOpacity> */}
                    {
                      account.accepted !== 0 &&
                      <Text style={styles.devices}>{account.sharer_name}'s House</Text>
                    }
                  </View>
                  {
                    account.devices !== undefined && account.accepted === 1 &&
                    account.devices.map((device, index) => (
                      <View key={index}>
                        <View style={{flexDirection: 'row', marginLeft: 40}}>
                          {/* <TouchableOpacity style={styles.button4} onPress={this.deleteADevice.bind(this, device.id)}> 
                            <Text style={{fontSize:20}}>X</Text>
                          </TouchableOpacity> */}
                          <Text style={styles.devices}>{device.name} ({device.description})</Text>
                        </View>
                        {
                          device.properties !== undefined &&
                          device.properties.map((property, index) => (
                            <View key={property.shared_property_id} style={{flexDirection: 'row', marginLeft: 60}}>
                              {/* <TouchableOpacity id={property.id} style={styles.button4} onPress={this.deleteAProperty.bind(this, property.id)}> 
                                <Text style={{fontSize:10}}>X</Text>
                              </TouchableOpacity> */}
                              <Text key={property.id} style={styles.devices}>{property.name}(
                                {(() => {
                                  if (property.unrestricted) {
                                   return "unrestricted";
                                  }
                                  else if (property.time_range_start !== undefined)
                                  {
                                    return property.time_range_start + "-" + property.time_range_end;
                                  }
                                  else
                                    return property.gps_location;
                                })()})
                              </Text>
                              <View style={{flexDirection: 'row', marginLeft: 100}}>
                                {
                                  (property.value == null || property.value instanceof Promise) && <ActivityIndicator size="small"/>
                                }
                                {
                                  property.value !== null && property.type === "boolean" &&
                                  <Text style={styles.devices}> 
                                  {
                                    property.value ? "On" : "Off"
                                  }</Text>
                                }
                                {
                                  (property.value == null || !(property.value instanceof Promise)) && property.value !== "boolean" &&
                                  <Text style={styles.devices}>
                                  {property.value}
                                  </Text>
                                }
                              </View>
                              {
                                !property.read_only && property.value !== null &&
                                <TouchableOpacity style={styles.button5} onPress={() => this.useSharedDevice(account, device, property)}> 
                                  <Text style={{fontSize:15, color: '#FFF'}}>o</Text>
                                </TouchableOpacity>
                              }
                            </View>
                          ))
                        }
                      </View>
                    ))
                  }
                  {
                    account.accepted === 0 &&
                    <View style={{flexDirection: 'row', alignSelf:'flex-start', marginLeft: 20}}>
                      <Text style={styles.devices}>{account.sharer_name} has invited you to access: </Text>
                    </View>
                  }
                  {
                    account.accepted === 0 && account.devices.map((device, index) => (
                    <View key={index}>
                      <View style={{flexDirection: 'row', marginLeft: 40}}>
                        <Text style={styles.devices}>{device.name} ({device.description})</Text>
                      </View>
                    </View>
                    ))
                  }
                  {
                      account.accepted === 0 && 
                      <View style={{flexDirection: 'row', alignSelf:'flex-start', marginLeft: 20}}>
                        <TouchableOpacity style={styles.button5} onPress={this.updateInvitation.bind(this, account.login_credentials_id, 1)}> 
                          <Text style={{fontSize:20, color: 'white'}}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button4} onPress={this.updateInvitation.bind(this, account.login_credentials_id, 0)}> 
                          <Text style={{fontSize:20, color: 'white'}}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                  }
                </View>

              ))
            }

            {/* Accounts You're Sharing */}
            {this.state.sharedAccounts !== null && <Text style={styles.greeting}>Accounts You're Sharing </Text>}
            {
              this.state.sharedAccounts &&
              this.state.sharedAccounts.map((account, index) => (
                account.id !== null &&
                <View key={index}>
                  <View style={{flexDirection: 'row', alignSelf:'flex-start'}}>
                    <TouchableOpacity style={styles.button4} onPress={this.deleteASharedAccount.bind(this, account.login_credentials_id, account.devices)}> 
                      <Text style={{fontSize:20}}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.devices}>{account.name}</Text>
                  </View>
                  {
                    account.devices !== undefined && account.accepted === 1 &&
                    account.devices.map((device, index) => (
                      <View key={index}>
                        <View style={{flexDirection: 'row', marginLeft: 30}}>
                          <TouchableOpacity style={styles.button4} onPress={this.deleteADevice.bind(this, account, device, device.properties)}> 
                            <Text style={{fontSize:20}}>X</Text>
                          </TouchableOpacity>
                          <Text style={styles.devices}>{device.name} ({device.description})</Text>
                        </View>
                        {
                          device.properties !== undefined &&
                          device.properties.map((property, index) => (
                            <View key={property.shared_property_id} style={{flexDirection: 'row', marginLeft: 100}}>
                              <TouchableOpacity key={property.id} style={styles.button4} onPress={this.deleteAProperty.bind(this, account, device, property)}> 
                                <Text style={{fontSize:10}}>X</Text>
                              </TouchableOpacity>
                              <Text key={property.id} style={styles.devices}>{property.name} (
                                {(() => {
                                  if (property.unrestricted) {
                                   return "unrestricted";
                                  }
                                  else if (property.time_range_start !== undefined)
                                  {
                                    return property.time_range_start + "-" + property.time_range_end;
                                  }
                                  else
                                    return property.gps_location;
                                })()})
                              </Text>
                              {/* <View style={{flexDirection: 'row', marginLeft: 100}}>
                                {
                                  property.value == null && <ActivityIndicator size="small"/>
                                }
                                {
                                  property.value !== null && property.type === "boolean" &&
                                  <Text style={styles.devices}> 
                                  {
                                    property.value ? "On" : "Off"
                                  }</Text>
                                }
                                {
                                  property.value !== null && property.type !== "boolean" &&
                                  <Text style={styles.devices}>
                                  {property.value}
                                  </Text>
                                }
                              </View> */}
                              {/* {
                                !property.read_only && property.value !== null &&
                                <TouchableOpacity style={styles.button5} onPress={() => this.useSharedDevice(account, device, property)}> 
                                  <Text style={{fontSize:15, color: '#FFF'}}>o</Text>
                                </TouchableOpacity>
                              } */}
                            </View>
                            
                          ))
                        }
                      </View>
                    ))
                  }
                  {
                    account.accepted === 0 &&
                    <View style={{flexDirection: 'row', alignSelf:'flex-start', marginLeft: 40}}>
                      <Text style={styles.devices}>Invitation status: </Text>
                      <Text style={{color: 'green'}}>Pending</Text>
                    </View>
                  }
                  {
                    account.accepted === 0 &&
                    account.devices.map((device, index) => (
                    <View key={index}>
                      <View style={{flexDirection: 'row', marginLeft: 40}}>
                        <Text style={styles.devices}>{device.name} ({device.description})</Text>
                      </View>
                    </View>
                    ))
                  }
                </View>
              ))
            }

            <TouchableOpacity style={styles.signOutButton} onPress={this.signOut}>
              <Text style={{color: '#FFF', fontWeight: '500'}}>Sign Out</Text>
            </TouchableOpacity>
  
        </ScrollView> 
      );
    }
  }
  
  // CSS
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center'
    },
    devices: {
      fontSize: 15,
      fontWeight: '400',
      justifyContent: 'center'
  },
    signOutButton: {
      marginTop: 30,
      marginBottom: 30,
      marginHorizontal: 30,
      backgroundColor: '#E9446A',
      borderRadius: 4,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center'
    },
    getUserInfoButton: {
      marginTop: 30,
      marginHorizontal: 30,
      backgroundColor: '#00BFA5',
      borderRadius: 4,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center'
    },
    setUserInfoButton: {
      marginTop: 30,
      marginHorizontal: 30,
      backgroundColor: '#00B0FF',
      borderRadius: 4,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center'
    },
    button4: {
      marginHorizontal: 10,
      backgroundColor: '#E9446A',
      borderRadius: 4,
      paddingHorizontal: 15,
      justifyContent: 'center'
    },  
    button5: {
      marginHorizontal: 10,
      backgroundColor: '#00B0FF',
      borderRadius: 4,
      paddingHorizontal: 10,
      justifyContent: 'center'
    }, 
    errorMessage: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 30
    },
    error: {
      color: '#E9446A',
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center'
    },
    input: {
      borderBottomColor: '#8A8F9E',
      borderBottomWidth: 1,
      height: 40,
      fontSize: 15,
      color: '#161F3D'
    },
    inputTitle: {
      marginTop: 10,
      color: '#8A8F9E',
      fontSize: 10,
      textTransform: 'uppercase'
    },
    form: {
      marginBottom: 48,
      marginHorizontal: 30
    }
  });