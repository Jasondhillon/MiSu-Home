import React, { Component } from "react";
import getDeviceIcon from '../app/DeviceIcons';
import {
  View,
  Image,
  StyleSheet,
  Switch,
  Slider,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from "react-native";
import AppHeaderText from "../app/AppHeaderText";
import AppText from "../app/AppText";
import appStyle from "../../styles/AppStyle";

const Example = (props) => {
    function formatDate(time) {
      // Check correct time format and split into components
      time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }
      return time.join (''); // return adjusted time or original string
    }
    console.log("Hi " + props);

    var desc = "";
    return null;
    //props.prop.properties.forEach(x => desc += x.name + ", ");
    desc = desc.substring(0, desc.length - 2);
    desc = desc.substring(0, 15) + (desc.length > 15 ? '...' : '');

    var deviceName = props.device.name;
    deviceName = deviceName.substring(0, 10) + (deviceName.length > 15 ? '...' : '');

    const firstProp = props.device.properties[0];
    var firstPropTimeRangeReoccuringStr = "";
    if(firstProp.time_range_reoccuring == "" || firstProp.time_range_reoccuring == null)
        firstPropTimeRangeReoccuringStr = "Everyday  ";
    else
    {
      var tempCount = 0;
      for (var i = 0; i < firstProp.time_range_reoccuring.length + 1; i++) {
        // Skip to every three letters to support the MonThuSat example
        if(tempCount >= 3 && i <= firstProp.time_range_reoccuring.length)
        {
            tempCount = 0;
            var dayCut = firstProp.time_range_reoccuring.substring(i - 3, i);
            // Check if the time range is thursday for special case of using R to signify it
            // if(dayCut == "Thu")
            // {
            //     firstPropTimeRangeReoccuringStr += "R, ";
            // }
            // // Check if the time range is sunday for special case of using U to signify it
            // else if(dayCut == "Sun")
            // {
            //     firstPropTimeRangeReoccuringStr += "U, ";
            // }
            // else
            //     firstPropTimeRangeReoccuringStr += dayCut[0] + ", ";
            firstPropTimeRangeReoccuringStr += dayCut + ", ";
        }
        tempCount++;
      }
    }
    firstPropTimeRangeReoccuringStr = firstPropTimeRangeReoccuringStr.substring(0, firstPropTimeRangeReoccuringStr.length - 2);
}

class DeviceCard extends Component {
  state = {
    owned: true,
    switchVals: [],
    minVal: 0,
    maxVal: 100,
    device: null,
    slider: 0,
  };

  showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.LONG);
  };

  getValueForSharedDeviceProperty = async (account, device, property) => {
    // console.log("\n\n%j", 2, property);
    var list = this.props.device;
    var temp = list.properties[list.properties.indexOf(property)]; 
    if (property.type !== "action")
    {
      await fetch(
        "https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getvalues",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + this.props.IdToken,
          },
          body: JSON.stringify({
            account: account,
            device: device.shared_device_properties_id,
            property: property.shared_property_id,
          }),
        }
      )
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== null) {
          for (var key in data.message) {
            if (data.message.hasOwnProperty(key)) {
            //   console.log("Changing " + temp.name + " to " + data.message[key]);
              temp.value = data.message[key];

              if (temp.type === "boolean")
                this.state.switchVals.push(temp.value);
            }
          }
        } else throw error("Values empty");
      })
      .catch((error) => {
        console.error("getValueForSharedDeviceProperty error:", error);
      });
    }
    this.setState({ device: list });
  };

  getCurrentValues = async () => {
    this.props.device.properties.map((property) => {
      this.getValueForSharedDeviceProperty(
        this.props.device.login_credentials_id,
        this.props.device,
        property
      );
    });

  };

  toggleSwitch = (switchProp) => {
    var switchV = this.state.device;
    this.useSharedDevice(this.props.device.login_credentials_id, this.state.device, switchV.properties[switchProp]);
    switchV.properties[switchProp].value = !switchV.properties[switchProp].value;
    this.setState({
      device: switchV,
    });
  };

  // Sends a command to a hub
  useSharedDevice = async (account, device, property) => {
    // var list = this.state.device;
    var temp = property;
    // console.log(account);

    var dateTime = new Date();
    var localTime = dateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'});
    // MM/DD/YY
    var date = dateTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit',timeZone: 'America/New_York'});
    // Not sure why but dateTime.toLocaleDateString('en-US', {weekday:'short'}); kept returning the full date and not the day, so switch statement is the work around
    var day = dateTime.getDay();
    switch (day)
    {
      case 0: 
        day = 'Sun';
        break;
      case 1:
        day = 'Mon';
        break;
      case 2:
        day = 'Tue';
        break;
      case 3:
        day = 'Wed';
        break;
      case 4:
        day = 'Thu';
        break;
      case 5:
        day = 'Fri';
        break;
      case 6:
        day = 'Sat';
        break;
    }
    // Check for rules
    if (!temp.unrestricted)
    {
      // Temporary Rules
      if (temp.temporary)
      {
        // Check if it is still the same day
        if (date !== temp.temp_date)
        {
          ////this.showToast("Temporary access for this device has expired");
        }
        // Check if within the time rules
        else
        {   
          if (localTime < temp.temp_time_range_start)
          {
            ////this.showToast("This device is not available at this time (Too early)");
          }
          else if (localTime > temp.temp_time_range_end)
          {
            //this.showToast("The time window for this device has expired (Too late)");
          }
          else
          {
            
            if (property.type == "boolean")
              await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
                  method: 'POST',
                  headers: 
                  {
                      Authorization: 'Bearer ' + this.props.IdToken
                  },
                  body: JSON.stringify({
                    account: account,
                    device: device.shared_device_properties_id,
                    property: property.shared_property_id,
                    value: property.value
                  })
              })
              .then(response => response.json())
              .then(data => {
                temp.value = !temp.value;
                  if(data.statusCode === 400)
                    console.log("%j", data.message);
                  
                  this.getValueForSharedDeviceProperty(account, device, property);
              })
              .catch((error) => {
                  console.error('useSharedDevice error:', error);
              });
            else if (property.type === "action")
            {
              await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
                  method: 'POST',
                  headers: 
                  {
                      Authorization: 'Bearer ' + this.props.IdToken
                  },
                  body: JSON.stringify({
                    account: account,
                    device: device.shared_device_properties_id,
                    property: property.shared_property_id,
                    value: property.name
                  })
              })
              .then(response => response.json())
              .then(data => {
                  if(data.statusCode === 400)
                  {
                    console.log("%j","error, ",  data.message);
                  }
              })
              .catch((error) => {
                  console.error('useSharedDevice error:', error);
              });
            }
          else if (property.type == "integer")
            {
              await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
                  method: 'POST',
                  headers: 
                  {
                      Authorization: 'Bearer ' + this.props.IdToken
                  },
                  body: JSON.stringify({
                    account: account,
                    device: device.shared_device_properties_id,
                    property: property.shared_property_id,
                    value: property.value
                  })
              })
              .then(response => response.json())

              .then(data => {
                  temp.value = !temp.value;
                  console.log(temp);
                  if(data.statusCode === 400)
                    console.log("%j", data.message);

                  // this.getValueForSharedDeviceProperty(account, device, property);
              })
              .catch((error) => {
                  console.error('useSharedDevice error:', error);
              });
            }
          }
        }
      }
      // Schedule based rules
      else if (temp.time_range)
      {
        // Check if within the schedule start date
        if (date >= temp.time_range_start_date)
        {   
          // Check if within the schedule end date
          if (date <= temp.time_range_end_date)
          {
            // Check if we are within the time range window
            if (localTime >= temp.time_range_start)
            {
              if (localTime <= temp.time_range_end)
              {
                // Check if this rule is operating on the correct day(s)
                if (temp.time_range_reoccuring !== null)
                {
                  var withinTimeFrame = 0;
                  var daysReoccuring = temp.time_range_reoccuring.match(/.{1,3}/g);
                  for (var i = 0; i < daysReoccuring.length; i++)
                  {
                    if (day === daysReoccuring[i])
                    {
                      withinTimeFrame = 1;
                    }
                  }
                  
                  if (withinTimeFrame)
                  {
                    if (property.type == "boolean")
                      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
                          method: 'POST',
                          headers: 
                          {
                              Authorization: 'Bearer ' + this.props.IdToken
                          },
                          body: JSON.stringify({
                            account: account,
                            device: device.shared_device_properties_id,
                            property: property.shared_property_id,
                            value: !property.value
                          })
                      })
                      .then(response => response.json())
                      .then(data => {
                          if(data.statusCode === 400)
                            console.log("%j", data.message);

                          this.getValueForSharedDeviceProperty(account, device, property);
                      })
                      .catch((error) => {
                          console.error('useSharedDevice error:', error);
                      });
                    else if (property.type === "action")
                    {
                      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
                          method: 'POST',
                          headers: 
                          {
                              Authorization: 'Bearer ' + this.props.IdToken
                          },
                          body: JSON.stringify({
                            account: account,
                            device: device.shared_device_properties_id,
                            property: property.shared_property_id,
                            value: property.name
                          })
                      })
                      .then(response => response.json())
                      .then(data => {
                        if(data.statusCode === 400)
                          console.log("%j","error, ",  data.message);
                      })
                      .catch((error) => {
                          console.error('useSharedDevice error:', error);
                      });
                    }
                    else if (property.type == "integer")
                    {
                      await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
                          method: 'POST',
                          headers: 
                          {
                              Authorization: 'Bearer ' + this.props.IdToken
                          },
                          body: JSON.stringify({
                            account: account,
                            device: device.shared_device_properties_id,
                            property: property.shared_property_id,
                            value: property.value
                          })
                      })
                      .then(response => response.json())

                      .then(data => {
                          temp.value = !temp.value;
                          console.log(temp);
                          if(data.statusCode === 400)
                            console.log("%j", data.message);

                          // this.getValueForSharedDeviceProperty(account, device, property);
                      })
                      .catch((error) => {
                          console.error('useSharedDevice error:', error);
                      });
                    }
                  }
                  else
                  {
                    this.showToast("Can't use this device on this day");
                    console.log("Can't use this device on this day");
                  }
                }
              }
              else
              {
                this.showToast("This device is not available at this time (Too late)");
                console.log("This device is not available at this time (Too late");
              }
            }
            else
            {
              this.showToast("This device is not available at this time (Too early)");
              console.log("This device is not available at this time (Too early)");
            }
          }
          else
          {
            this.showToast("Access to this device has expired (Schedule has ended)");
            console.log("Access to this device has expired (Schedule has ended)");
          }
        }
        else
        {
          this.showToast("This device is not available at this date (Schedule hasn't started yet)");
          console.log("This device is not available at this date (Schedule hasn't started yet)");
        }
      }
      else
      {
        if (property.type == "boolean")
          await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
              method: 'POST',
              headers: 
              {
                  Authorization: 'Bearer ' + this.props.IdToken
              },
              body: JSON.stringify({
                account: account,
                device: device.shared_device_properties_id,
                property: property.shared_property_id,
                value: !property.value
              })
          })
          .then(response => response.json())
          .then(data => {
              if(data.statusCode === 400)
                console.log("%j", data.message);
              
              this.getValueForSharedDeviceProperty(account, device, property);
          })
          .catch((error) => {
              console.error('useSharedDevice error:', error);
          });
        else if (property.type === "action")
        {
          await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
              method: 'POST',
              headers: 
              {
                  Authorization: 'Bearer ' + this.props.IdToken
              },
              body: JSON.stringify({
                account: account,
                device: device.shared_device_properties_id,
                property: property.shared_property_id,
                value: property.name
              })
          })
          .then(response => response.json())
          .then(data => {
              if(data.statusCode === 400)
                console.log("%j", data.message);
          })
          .catch((error) => {
              console.error('useSharedDevice error:', error);
          });
        }
        else if (property.type == "integer")
        {
          await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
              method: 'POST',
              headers: 
              {
                  Authorization: 'Bearer ' + this.props.IdToken
              },
              body: JSON.stringify({
                account: account,
                device: device.shared_device_properties_id,
                property: property.shared_property_id,
                value: property.value
              })
          })
          .then(response => response.json())

          .then(data => {
              temp.value = !temp.value;
              console.log(temp);
              if(data.statusCode === 400)
                console.log("%j", data.message);

              // this.getValueForSharedDeviceProperty(account, device, property);
          })
          .catch((error) => {
              console.error('useSharedDevice error:', error);
          });
        }
      }
    }
    else
    {
      if (property.type == "boolean")
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.props.IdToken
            },
            body: JSON.stringify({
              account: account,
              device: device.shared_device_properties_id,
              property: property.shared_property_id,
              value: !property.value
            })
        })
        .then(response => response.json())

        .then(data => {
            temp.value = !temp.value;
            console.log(temp);
            if(data.statusCode === 400)
              console.log("%j", data.message);

            this.getValueForSharedDeviceProperty(account, device, property);
        })
        .catch((error) => {
            console.error('useSharedDevice error:', error);
        });
      else if (property.type === "action")
      {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.props.IdToken
            },
            body: JSON.stringify({
              account: account,
              device: device.shared_device_properties_id,
              property: property.shared_property_id,
              value: property.name
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.statusCode === 400)
              console.log("%j", data.message);
        })
        .catch((error) => {
            console.error('useSharedDevice error:', error);
        });
      }
      else if (property.type == "integer")
      {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/usedevice', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.props.IdToken
            },
            body: JSON.stringify({
              account: account,
              device: device.shared_device_properties_id,
              property: property.shared_property_id,
              value: property.value
            })
        })
        .then(response => response.json())

        .then(data => {
            temp.value = !temp.value;
            console.log(temp);
            if(data.statusCode === 400)
              console.log("%j", data.message);

            this.getValueForSharedDeviceProperty(account, device, property);
        })
        .catch((error) => {
            console.error('useSharedDevice error:', error);
        });
      }
    }
  }

  render() {
    return (
      <View style={appStyle.card}>
        <View style={appStyle.container}>
          {/* Render the device icon */}
          <Image
            style={[style.icon, { marginBottom: 0 }]}
            source={getDeviceIcon(this.props.device.description)}
            
          />

          {/* Render the device name */}
          <AppHeaderText style={[style.name], {marginBottom:20}}>
            {this.props.device.name}
          </AppHeaderText>

          {/* Render each property */}
          {this.state.device !== null && this.state.device.properties.map((prop, index) => {
                return (
                  <View key={index} style={appStyle.container}>
                    <View style={appStyle.row}>
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        
                        {/* Render Property Left Side  */}
                        <View style={appStyle.rowLeft}>
                          {/* Render Property Name */}
                          <AppText> {prop.name} </AppText>
                        </View>
                        
                        {/* Render Property Right Side */}
                        <View style={appStyle.rowRight}>
                          {/* Render Switch for Boolean */}
                          {prop.type == "boolean" && prop.read_only == 0 && (
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                              <Switch
                                value={this.state.device.properties[index].value}
                                onValueChange={(x) => {
                                    this.toggleSwitch(index);
                                }}
                              />
                            </View>
                          )}
                          {/* Render Slider for float and integers */}
                          {(prop.type == "float" || prop.type == "integer") &&
                            prop.read_only == 0 && (
                                <View>
                                  <Slider
                                    style={{ width: 200 }}
                                    step={1}
                                    minimumValue={0}
                                    maximumValue={100}
                                    value={prop.value}
                                    onSlidingComplete={(currentVal) =>
                                      {
                                          var temp = this.state.device;
                                          var temp2 = temp.properties[temp.properties.indexOf(prop)];
                                          temp2.value = currentVal;
                                          this.useSharedDevice(this.props.device.login_credentials_id, this.state.device, temp2);
                                          this.setState({device: temp})
                                      }
                                    }
                                  />
                                </View>
                            )}
                          {/* Render Buttons for actions */}
                          {prop.type == "action" &&
                            <View style={[appStyle.container, {marginRight:20}]}>
                              <TouchableOpacity onPress={() => this.useSharedDevice(this.props.device.login_credentials_id, this.state.device, prop)}> 
                                <Text style={{fontSize: 20}}>&#9899;</Text>
                              </TouchableOpacity>
                            </View>
                          }
                        </View>
                      </View>
                    </View>
                    <View style = {style.lineContainer} />
                    
                    <View style={appStyle.row}>

                      <Example curVal={this.prop}/>
                      {/* Render Property Readonly */}
                      {prop.read_only == 1 && 
                        <AppText style={{flexDirection: 'row', justifyContent:'flex-start', flex:1, alignSelf:'stretch', fontSize:14}}> Read Only</AppText>
                      }
                      
                      {/* Render Property Access Info */}
                      {
                      <Text>
                      {(() => {
                        if (prop.unrestricted) {
                          return <Text style={{fontStyle: "italic"}}>Unrestricted</Text>;
                        }
                        else if (prop.temporary)
                        {
                          return prop.temp_time_range_start + "-" + prop.temp_time_range_end + " " + prop.temp_date;
                        }
                        else if (prop.time_range)
                        {
                          return prop.time_range_start + "-" + prop.time_range_end + " " + prop.time_range_reoccuring;
                        }
                        })()}
                      </Text>
                      }
                    </View>
                  </View>
                );})}
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.getCurrentValues();
  }
}

const style = StyleSheet.create({
  name: {
    fontSize: 24,
    height: 30,
  },
  icon: {
    marginTop: 10,
    height: 100,
    width: 100,
  },
  lineContainer: {
    flex:1,
    backgroundColor:'#333333',
    height:2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'stretch',
    position:'absolute',
    left:0,
    right:0,
    top:40,
  },
});

export default DeviceCard;
