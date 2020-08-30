import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ToastAndroid, ActivityIndicator, RefreshControl} from 'react-native';
import CheckBox from '@react-native-community/checkbox'; 
import { Auth, API,  graphqlOperation} from 'aws-amplify';
import * as queries from '../src/graphql/queries'
import * as mutations from  '../src/graphql/mutations'

const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

export default class HomeScreen extends React.Component {

      state = {
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

    showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.LONG);
    };
 
    // Gets user's credentials
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
        this.getHubInfo();
      }).then(()=> {
        this.getListofSharedAccounts();
      });

    }

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
      })
    }

    componentWillUnmount() {
      // this.state.onCreateDeviceSub.unsubscribe();
      // // console.log(this.state.onDeleteSub);
      // this.state.onDeleteDeviceSub.unsubscribe();
      // this.state.onCreateSharedAccountSub.unsubscribe();
      // this.state.onDeleteSharedAccountSub.unsubscribe();
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
          if(data.hub_url === undefined)
          {
            this.setState({error: "Please update your hub information!"});
          }
          else
          {
            this.setState({hub_url: data.hub_url, hub_email: data.email, error: null});
            this.showToast("Data fetched from personal DB!");
            this.getDevices();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          this.showToast(error);
          this.setState({error});
        });
    }

    // Sets/updates the user's hub info
    setHubInfo = async () => {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/updatehubinfo', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
                // CANNOT HAVE https:// in front or b0rk
                hub_url: 'cop4934.mozilla-iot.org',
                hub_email: 'test@cop4934test.com',
                hub_password: '1234'
            }
        })
        .then(response => response.json())
        .then(data => {
            // console.log("%j",2,data);
            this.setState({error: null});
            this.showToast("Info successfully updated!");
            this.getHubInfo();
        })
        .catch((error) => {
            console.error('Error:', error);
            this.showToast(error);
            this.setState({error});
        });
    }

    // Gets user's hub devices from User's table through ID in idToken
    getDevices = async () => {
      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getdevices', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken
          }
      })
      .then(response => response.json())
      .then(data => {
          let devices = [];
          // console.log("%j", 2, data);
          if(data !== null)
          {
            data.forEach(function(item) 
            {
              var device = item;
              var properties = [];
              for (var key in item.properties) 
              {
                if (item.properties.hasOwnProperty(key)) 
                {
                  var temp = item.properties[key];
                  temp.isChecked = false;
                  temp.value = null;
                  properties.push({"property" : temp});
                }
              }
              device.newProps = properties;
              devices.push(device);
            });
            
          this.setState({devices});
          this.showToast("Devices list updated!");
          this.getCurrentValues();
          }
          else
            throw error("Devices empty"); 
      })
      .catch((error) => {
          console.error('Error:', error);
          this.showToast(error);
          this.setState({error});
      });
    }

    // setupSubscriptions = async () => {
    //   const onCreateDeviceSub = API.graphql(graphqlOperation(subscriptions.onCreateDevice)).subscribe({
    //     next: (data) => {
    //       console.log("New subscription data: " + data.value.data.onCreateDevice.id);
    //       var currDevices = this.state.sharedDevices;

    //       if(currDevices !== null)
    //       {
    //         if(currDevices.includes(data.value.data.onCreateDevice))
    //         {
    //           return null;
    //         }
    //         else
    //         {
    //           currDevices.push(data.value.data.onCreateDevice)
    //           return this.setState({
    //             sharedDevices: currDevices
    //           });
    //         }
    //       }
    //       else
    //       {
    //         var test = [];
    //         test.push(data.value.data.onCreateDevice);
    //         return this.setState({sharedDevices: test});
    //       }
    //     },
    //     error: error => {
    //       this.setState({error:"error getting live updates for devices"});
    //     }
    //   });

    //   const onCreateSharedAccountSub = API.graphql(graphqlOperation(subscriptions.onCreateSharedAccounts1)).subscribe({
    //     next: (data) => {
    //       console.log("New shared account made");
    //       console.log("New shared account made: " + data.value.data.onCreateSharedAccount.id);
    //       var currSharedAccounts = this.state.sharedAccounts;

    //       if(currSharedAccounts !== null)
    //       {
    //         if(currSharedAccounts.includes(data.value.data.onCreateSharedAccount))
    //         {
    //           console.log("Account already loaded on ui");
    //           return null;
    //         }
    //         else
    //         {
    //           console.log("Adding new account to ui");
    //           currSharedAccounts.push(data.value.data.onCreateSharedAccount)
    //           return this.setState({
    //             sharedDevices: currSharedAccounts
    //           });
    //         }
    //       }
    //       else
    //       {
    //         console.log("Adding new account to ui for the first time");
    //         var test = [];
    //         test.push(data.value.data.onCreateSharedAccount);
    //         return this.setState({sharedDevices: test});
    //       }
    //     },
    //     error: error => {
    //       this.setState({error:"error getting live updates for shared accounts"});
    //       console.log(error);
    //     }
    //   });

    //   const onDeleteSharedAccountSub = API.graphql(graphqlOperation(subscriptions.onDeleteSharedAccounts, {owner: "495565e5-585b-41a4-af30-9bc2c3f05862"})).subscribe({
    //     next: (data) => {
    //       console.log("Removing shared account from ui: " + data.value.data.onDeleteSharedAccounts.id);

    //       if(currSharedAccounts !== null)
    //       {
    //         console.log("Deleting account from ui");
    //         var currSharedAccounts = this.state.sharedAccounts.filter( el => el.id !== data.value.data.onDeleteSharedAccounts.id);
    //         return this.setState({
    //           sharedDevices: currSharedAccounts
    //         });
    //       }
    //     },
    //     error: error => {
    //       this.setState({error:"error getting live updates for onDelete shared accounts"});
    //       console.log(error);
    //     }
    //   });

    //   const onDeleteDeviceSub = API.graphql(graphqlOperation(subscriptions.onDeleteDevice)).subscribe({
    //     next: (data) => {
    //       console.log("New delete subscription data " + data.value.data.onDeleteDevice.id);
    //       var currDevices = [];
    //       if(currDevices !== null)
    //       {
    //         currDevices = this.state.sharedDevices.filter( el => el.id !== data.value.data.onDeleteDevice.id );
    //         return this.setState({
    //           sharedDevices: currDevices
    //         });
    //       }
    //     },
    //     error: error => {
    //       this.setState({error:"error getting live updates for onDelete devices"});
    //     }
    //   });

    //   this.setState({onCreateSharedAccountSub, onCreateDeviceSub, onDeleteDeviceSub, onDeleteSharedAccountSub});
    // }

    signOut = async () => {
        this.showToast("Signing out!");
        Auth.signOut()
        .then(this.props.navigation.navigate("Auth"));
    }

    // Get shared devices
    // getListofSharedDevices = async (hasNextToken = null) => {
    //   try 
    //   {
    //     const getDeviceListResult = await API.graphql(graphqlOperation(listDevices, {nextToken: hasNextToken}));
    //     const newDeviceList = getDeviceListResult.data.listDevices.items;
    //     var currentDeviceList = this.state.sharedDevices;

    //     newDeviceList.map((device) => {
    //       if (currentDeviceList !== null)
    //       {
    //         if(currentDeviceList.includes(device))
    //           return null;
    //         else
    //           currentDeviceList.push(device);
    //       }
    //       else
    //       {
    //         currentDeviceList = [];
    //         currentDeviceList.push(device);
    //       }
    //     });

    //     this.setState({
    //         sharedDevices: currentDeviceList
    //     });

    //   }
    //   catch (error)
    //   {
    //     this.setState({error:error.message});
    //   }
    // }

    // Get shared accounts
    getListofSharedAccounts = async (hasNextToken = null) => {
      try 
      {
        const getAccountsList = await API.graphql(graphqlOperation(queries.listSharedAccountss, {nextToken:hasNextToken}));
        const newAccountsList = getAccountsList.data.listSharedAccountss.items;
        var currentAccountsList = [];
        // console.log("Fetching shared accounts...");
        // console.log("Accounts Fetched: %j", 2, getAccountsList.data.listSharedAccountss.items[0].devices.items[0]);

        newAccountsList.map((acc) => {
          acc.devices.items.map((device) => {
            device.properties.items.map((property) => {
              property.value = null;
              property.value = this.getValueForSharedDeviceProperty(acc, device, property)
            });
          });

          currentAccountsList.unshift(acc);
        });

        this.setState({
          sharedAccounts: currentAccountsList
        });
        // console.log("%j", 2, currentAccountsList);

      }
      catch (error)
      {
        console.log("error:%j",2,error);
        this.setState({error:error.message});
      }
    }

    // checkUserExists = async (email) => {
    //   await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/checkuserexists', {
    //     method: 'POST',
    //     headers: 
    //     {
    //         Authorization: 'Bearer ' + this.state.idToken,
    //     },
    //     body: JSON.stringify({
    //       email: email,
    //       })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("User Check: " + data);
    //         return data;
    //     })
    //     .catch((error) => {
    //         console.error("Error:\n", error);
    //         this.showToast(error);
    //         this.setState({error});
    //     });
    // }

    // createASharedAccount = async () => {
    //   try 
    //   {
    //     if (this.state.selectedProperties > 0)
    //     {
    //       var acc;
    //       var esc = 0;
    //       for (acc in this.state.sharedAccounts)
    //       {
    //         if (this.state.sharedAccounts[acc].sharee_id === "7b135dd7-f7fb-4db7-81d5-dcd6bc456f32")
    //         {
    //           this.showToast("User already exists, run an update command here!");
    //           esc = 1;
    //         }
    //       }
    //       if (esc !== 1)
    //       {  
    //         console.log("Creating a new shared account...");
    //         var date = new Date();
    //         const res = await API.graphql(graphqlOperation(mutations.createSharedAccounts, {input: {
    //           hub_url: "cop4934.mozilla-iot.org",
    //           hub_email: "test@cop4934test.com",
    //           hub_password: "1234",
    //           sharer_id: "doesn't matter",
    //           sharee_id: "7b135dd7-f7fb-4db7-81d5-dcd6bc456f32",
    //           sharer_name: this.state.name,
    //           name: date.getHours()%12 + ":" + date.getMinutes() + " Neighbor 7b135dd7"
    //         }}));
    //         // console.log("RESONSEE %j", 2, res.data.createSharedAccounts.id);
    //         this.createADevice(res.data.createSharedAccounts.id);
    //       }
    //       else
    //       {
    //         this.createADevice("7b135dd7-f7fb-4db7-81d5-dcd6bc456f32");
    //       }

    //     }
    //     else
    //       this.setState({error: "You need to have at least a single property selected to share!"});
    //   }
    //   catch (err)
    //   {
    //     console.log("Error adding a shared account");
    //     console.log("%j",2,err);
    //     // this.setState({error:err.message});
    //     this.refreshToken();
    //   }
    // }

    // Sets/updates the user's hub info
    createASharedAccount = async () => {
      const date = new Date();
      const dateISO = date.toISOString();
      var time;
      if (date > 12)
        time = date.getHours()%12 + ":" + date.getMinutes() +"pm";
      else
        time = date.getHours() + ":" + date.getMinutes() +"am";

      try 
      {
        // Check if at least one property to share has been selected
        if (this.state.selectedProperties > 0)
        {
          var userExists;
          await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/checkuserexists', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
            },
            body: JSON.stringify({
              email: "test@example.com",
              })
            })
            .then(response => response.json())
            .then(data => {
                console.log("User Check: " + data);
                userExists = data;
            })
            .catch((error) => {
                console.error("Error:\n", error);
                this.showToast(error);
                this.setState({error});
            });

          if(userExists == '1')
          {
            // Checks if there is already hub credentials for the person we are sharing to
            var acc, esc = 0, id;
            for (acc in this.state.sharedAccounts)
            {
              // TODO: Change this to use user input
              if (this.state.sharedAccounts[acc].hub_email === "test@example.com")
              {
                id = this.state.sharedAccounts[acc].id;
                esc = 1;
              }
            }
            if (esc !== 1)
            {
              await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser', {
              method: 'POST',
              headers: 
              {
                  Authorization: 'Bearer ' + this.state.idToken,
              },
              body: JSON.stringify({
                hub_url: "cop4934.mozilla-iot.org",
                hub_email: "test@example.com",
                sharee_id: "7b135dd7-f7fb-4db7-81d5-dcd6bc456f32",
                name:  time + " Neighbor",
                createdAt: dateISO,
                updatedAt: dateISO,
                })
              })
              .then(response => response.json())
              .then(data => {
                  if (data === "User already ex")
                  {
                   throw new Error("User already exists");
                  }
                  else
                  {
                    id = data;
                    this.setState({error: null});
                  }
              })
              .then(() => {
                this.createADevice(id);
              })
              .catch((error) => {
                  console.log("Error:\n", error + "");
                  this.showToast(error + "");
                  this.setState({error: error + ""});
              });
            }
            else
            {
              if(id)
                this.createADevice(id);
            }
          }
          else
            this.setState({error: "User doesn't exist, please tell them to setup an account first!"});
        }
        else
          this.setState({error: "You need to have at least a single property selected to share!"});
      }
      catch (err)
      {
        console.log("Error adding a shared account");
        console.log("%j",2,err);
        // this.setState({error:err.message});
        this.refreshToken();
      }
    }

    createADevice = async (id) => {
      try 
      {
        var device;
        for (device in this.state.devices)
        {
          var properties = [];
          var property;
          for (property in this.state.devices[device].newProps)
          {
            // Check which properties were selected from the UI
            if (this.state.devices[device].newProps[property].property.isChecked)
              properties.push(this.state.devices[device].newProps[property]);
          }
          if (properties.length !== 0)
          {
            console.log("Creating a device... for " + id);
            const date = new Date();
            const res = await API.graphql(graphqlOperation(mutations.createDevice, {input: {
              name: this.state.devices[device].title + "",
              description: this.state.devices[device].description + "",
              rule_set:"Mon/Tue/Wed",
              path: this.state.devices[device].href + "",
              deviceSharedAccountIdId: id
            }}));
            // console.log("RESPONSE:", res);
            this.createAProperty(res.data.createDevice.id, properties);
          }
          // else
          //   this.setState({error: "Couldn't find properties so no new device was made"});
          //   this.getListofSharedAccounts();
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

    createAProperty = async (id, properties) => {
      try {
        if (properties)
        {
          var property;
          for (property in properties)
          {
            console.log("Creating a property... for " + id);
            console.log(JSON.stringify(properties[property].property),null,2);
            const res = await API.graphql(graphqlOperation(mutations.createProperty, {input: {
              name: properties[property].property.title + "",
              type: properties[property].property.type + "",
              path: properties[property].property.links[0].href + "",
              read_only: 0,
              devicePropertiesId: id
            }}))
            // console.log("RESPONSE:", res);
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
      finally {
        this.getListofSharedAccounts();
      }
    }

    deleteADevice = async (id) => {
      try {
        console.log("Deleting device " + id + "...");
        await API.graphql(graphqlOperation(mutations.deleteDevice, {input: {
          id: id,
        }}))
        .then(() => {
          this.getListofSharedAccounts();
        });
        // var currSharedAccounts = this.state.sharedAccounts.filter( el => el.id !== id);
        // this.setState({sharedAccounts: currSharedAccounts});

      }
      catch (err)
      {
        console.log("Error deleting a device%j",2, err);
        this.setState({error:err.message});
        this.refreshToken();
      }
    }

    deleteASharedAccount = async (id) => {
      try {
        console.log("Deleting account " + id + "...");
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/createshareduser', {
          method: 'DELETE',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken,
          },
          // TODO: Change this to use user input
          body: JSON.stringify({
            email: "test@example.com",
            })
          })
          .then(response => response.json())
          .then(data => {
              this.setState({error: null});
              API.graphql(graphqlOperation(mutations.deleteSharedAccounts, {input: {
                id: id,
              }}));
              var currSharedAccounts = this.state.sharedAccounts.filter( el => el.id !== id);
              this.setState({sharedAccounts: currSharedAccounts});
          })
          .catch((error) => {
              console.error("Error:\n", error);
              this.showToast(error);
              this.setState({error});
          });

      }
      catch (err)
      {
        console.log("Error deleting a device");
        this.setState({error:err.message});
        this.refreshToken();
      }
    }

    deleteAProperty = async (id) => {
      try {
        console.log("Deleting property " + id + "...");
        await API.graphql(graphqlOperation(mutations.deleteProperty, {input: {
          id: id,
        }}))
        .then(() => {
          this.getListofSharedAccounts();
        });

      }
      catch (err)
      {
        console.log("Error deleting a property%j",2, err);
        this.setState({error:err.message});
        this.refreshToken();
      }
    }

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

    getValueForSharedDeviceProperty = async (account, device, property) => {
      // console.log("\n\n%j", 2, property);
      // console.log("Accessing device " + property.property.links[0].href + "...")
      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues', {
          method: 'POST',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken
          },
          body: JSON.stringify({
            path: property.path
          })
      })
      .then(response => response.json())
      .then(data => {
          // console.log("%j", 2, data);
          if(data !== null)
          {

            // accounts[x].devices.items[x].properties.items[x]
            var list = this.state.sharedAccounts;
            var temp = list[list.indexOf(account)].devices.items;
            temp = temp[temp.indexOf(device)].properties.items
            temp = temp[temp.indexOf(property)];

            for (var key in data) 
            {
              if (data.hasOwnProperty(key)) 
              {
                temp.value = data[key];
              }
            }

            this.setState({sharedAccounts: list});
          }
          else
            throw error("Values empty"); 
      })
      .catch((error) => {
          console.error('Error:', error);
          this.showToast(error);
          this.setState({error});
      });

    }

    getValueForDeviceProperty = async (device, property) => {
      // console.log("\n\n%j", 2, property);
      // console.log("Accessing device " + property.property.links[0].href + "...")
      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues', {
          method: 'POST',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken
          },
          body: JSON.stringify({
            path: property.property.links[0].href
          })
      })
      .then(response => response.json())
      .then(data => {
          // console.log("%j", 2, data);
          if(data !== null)
          {

            var list = this.state.devices;
            var temp = list[list.indexOf(device)].newProps;
            temp = temp[temp.indexOf(property)];

            for (var key in data) 
            {
              if (data.hasOwnProperty(key)) 
              {
                temp.property.value = data[key];
              }
            }

            this.setState({devices: list});
          }
          else
            throw error("Values empty"); 
      })
      .catch((error) => {
          console.error('Error:', error);
          this.showToast(error);
          this.setState({error});
      });

    }

    getCurrentValues = async () => {
      var devices = this.state.devices;
      devices.map((device) => {
        device.newProps.map((property) => {
          property.value = this.getValueForDeviceProperty(device, property);
        });
      });

    }

    useDevice = async (device, property) => {
      // console.log(JSON.stringify(property, null, 2));
      const propertyName = property.property.links[0].href.substring(property.property.links[0].href.lastIndexOf("/") + 1, property.property.links[0].href.length);
      console.log("Turning " + property.property.title + " " + !property.property.value);
      var list = this.state.devices;
      var temp = list[list.indexOf(device)].newProps;
      temp = temp[temp.indexOf(property)];
      temp.property.readOnly = true;
      this.setState({devices: list});
      
      if (property.property.type == "boolean")
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken
            },
            body: JSON.stringify({
              path: property.property.links[0].href,
              name: propertyName,
              value: !property.property.value
            })
        })
        .then(response => response.json())
        .then(data => {
          temp.property.value = !temp.property.value;
          temp.property.readOnly = false;
          this.setState({devices: list});
          this.getValueForDeviceProperty(device, property);
        })
        .catch((error) => {
            console.error('Error:', error);
            this.showToast(error);
            this.setState({error});
        });
    }

    useSharedDevice = async (account, device, property) => {
      // console.log(JSON.stringify(property, null, 2));
      const propertyName = property.path.substring(property.path.lastIndexOf("/") + 1, property.path.length);
      console.log("Turning " + property.name + " " + !property.value);
      var list = this.state.sharedAccounts;
      var temp = list[list.indexOf(account)].devices.items;
      temp = temp[temp.indexOf(device)].properties.items
      temp = temp[temp.indexOf(property)];
      temp.read_only = true;
      this.setState({sharedAccounts: list});

      if (property.type == "boolean")
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken
            },
            body: JSON.stringify({
              path: property.path,
              name: propertyName,
              value: !property.value
            })
        })
        .then(response => response.json())
        .then(data => {
          temp.value = !temp.value;
          temp.read_only = false;
          this.setState({sharedAccounts: list});
          this.getValueForSharedDeviceProperty(account, device, property);
        })
        .catch((error) => {
            console.error('Error:', error);
            this.showToast(error);
            this.setState({error});
        });
    }

    onRefresh = () => {
      if(!this.state.refreshing)
      {
        this.setState({refreshing: true});
        this.getDevices();
        this.getListofSharedAccounts();
        this.setState({refreshing: false});
      }
    }
      
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
            {this.state.hub_url === null && <TouchableOpacity style={styles.getUserInfoButton} onPress={this.getHubInfo}>
              <Text style={{color: '#FFF', fontWeight: '500'}}>Get User Information</Text>
            </TouchableOpacity>}
            {this.state.hub_url === null && <TouchableOpacity style={styles.setUserInfoButton} onPress={this.setHubInfo}>
              <Text style={{color: '#FFF', fontWeight: '500'}}>Update Hub Information(Hard Coded)</Text>
            </TouchableOpacity>}

            {/* User DB information */}
            <Text style={styles.greeting}>(Secured Account Info)</Text>
            {this.state.hub_url === null && <Text style={{alignSelf: 'center'}}>Add your hub information!</Text>}
            {this.state.hub_url && <Text style={{alignSelf: 'center'}}>Hub URL: {this.state.hub_url}</Text>}
            {this.state.hub_url && <Text style={{alignSelf: 'center'}}>Hub Email: {this.state.hub_email}</Text>}

            {/* Devices on hub information */}
            <Text style={styles.greeting}>(Devices on Hub)</Text>
            {!this.state.devices && <ActivityIndicator size="large"/>}
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
                              property.property.value == null && <ActivityIndicator size="small"/>
                            }
                            {
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
                            }
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
            <TouchableOpacity style={styles.setUserInfoButton} onPress={this.createASharedAccount}>
              <Text style={{color: '#FFF', fontWeight: '500'}}> Share Account</Text>
            </TouchableOpacity>

            {/* Accounts Shared to You */}
            <Text style={styles.greeting}>Accounts Shared to You</Text>
            {
              this.state.sharedAccounts &&
              this.state.sharedAccounts.map((account, index) => (
                account.sharee_id === this.state.id &&
                <View key={index}>
                  <View style={{flexDirection: 'row', alignSelf:'flex-start'}}>
                    <TouchableOpacity style={styles.button4} onPress={this.deleteASharedAccount.bind(this, account.id)}> 
                      <Text style={{fontSize:20}}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.devices}>{account.sharer_name}</Text>
                  </View>
                  {
                    account.devices !== undefined &&
                    account.devices.items.map((device, index) => (
                      <View key={index}>
                        <View style={{flexDirection: 'row', marginLeft: 30}}>
                          <TouchableOpacity style={styles.button4} onPress={this.deleteADevice.bind(this, device.id)}> 
                            <Text style={{fontSize:20}}>X</Text>
                          </TouchableOpacity>
                          <Text style={styles.devices}>{device.name} ({device.rule_set})</Text>
                        </View>
                        {
                          device.properties !== undefined &&
                          device.properties.items.map((property, index) => (
                            <View key={property.id} style={{flexDirection: 'row', marginLeft: 100}}>
                              <TouchableOpacity id={property.id} style={styles.button4} onPress={this.deleteAProperty.bind(this, property.id)}> 
                                <Text style={{fontSize:10}}>X</Text>
                              </TouchableOpacity>
                              <Text key={property.id} style={styles.devices}>{property.name}</Text>
                              <View style={{flexDirection: 'row', marginLeft: 100}}>
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
                </View>
              ))
            }

            {/* Accounts You're Sharing */}
            <Text style={styles.greeting}>Accounts You're Sharing </Text>
            {
              this.state.sharedAccounts &&
              this.state.sharedAccounts.map((account, index) => (
                account.sharer_id === this.state.id &&
                <View key={index}>
                  <View style={{flexDirection: 'row', alignSelf:'flex-start'}}>
                    <TouchableOpacity style={styles.button4} onPress={this.deleteASharedAccount.bind(this, account.id)}> 
                      <Text style={{fontSize:20}}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.devices}>{account.name}</Text>
                  </View>
                  {
                    account.devices !== undefined &&
                    account.devices.items.map((device, index) => (
                      <View key={index}>
                        <View style={{flexDirection: 'row', marginLeft: 30}}>
                          <TouchableOpacity style={styles.button4} onPress={this.deleteADevice.bind(this, device.id)}> 
                            <Text style={{fontSize:20}}>X</Text>
                          </TouchableOpacity>
                          <Text style={styles.devices}>{device.name} ({device.rule_set})</Text>
                        </View>
                        {
                          device.properties !== undefined &&
                          device.properties.items.map((property, index) => (
                            <View key={property.id} style={{flexDirection: 'row', marginLeft: 100}}>
                              <TouchableOpacity id={property.id} style={styles.button4} onPress={this.deleteAProperty.bind(this, property.id)}> 
                                <Text style={{fontSize:10}}>X</Text>
                              </TouchableOpacity>
                              <Text key={property.id} style={styles.devices}>{property.name}</Text>
                              <View style={{flexDirection: 'row', marginLeft: 100}}>
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