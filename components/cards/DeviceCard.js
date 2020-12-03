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

// Render each properties access values
const RenderAccess = (props) => {
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

    const firstProp = props.curVal;
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

    return (
      
      <View style={[appStyle.row, {marginLeft:-5, marginTop:2}]}>
      {/* Display second row detailing the access*/}
      {
          firstProp.unrestricted == 1 && 
              <View>
                  <AppText style={{fontSize:14, fontStyle:'italic', marginTop:-4}}>* Unrestricted Access</AppText>
              </View>
      }
      {
          firstProp.time_range == 1 && 
              <View style={[{marginTop:-15, top:0}]}>
                  <View style={[appStyle.rowRight, {right:10, top: 32}]}>
                      <AppText style={{fontSize:12, fontStyle:'italic', marginTop:-4}}>{firstPropTimeRangeReoccuringStr}</AppText>
                  </View>
                  <View style={appStyle.row}>
                      <AppText style={{fontSize:14, fontStyle:'italic', marginTop:-4}}>Scheduled {firstProp.time_range_start_date.slice(0, -3)} @ {formatDate(firstProp.time_range_start)}</AppText>
                      <AppText style={{fontSize:14, fontStyle:'italic', marginTop:-4}}> to {firstProp.time_range_end_date.slice(0, -3)} @ {formatDate(firstProp.time_range_end)}</AppText>
                  </View>
              </View>
      }
      {
          firstProp.temporary == 1 && 
              <View>
                  <AppText style={{fontSize:14, fontStyle:'italic', marginTop:-4}}>Temporary until {(firstProp.temp_date.slice(0, -3))}, {formatDate(firstProp.temp_time_range_end)}</AppText>
              </View>
      }
      </View>
      // <View style={{flex:1}}>
      //   {/* Render Property Access Info */}
      //   {
      //   <Text>
      //     {(() => {
      //       if (firstProp.unrestricted) {
      //         return <Text style={{fontStyle: "italic"}}>Unrestricted</Text>;
      //       }
      //       else if (firstProp.temporary)
      //       {
      //         return firstProp.temp_time_range_start + "-" + firstProp.temp_time_range_end + " " + firstProp.temp_date;
      //       }
      //       else if (firstProp.time_range)
      //       {
      //         return firstProp.time_range_start + "-" + firstProp.time_range_end + " " + firstProp.time_range_reoccuring;
      //       }
      //       })()
      //     }
      //   </Text>
      //   }
      // </View>

    );
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
    if (this.state.switchVals.length !== 0)
      this.setState({switchVals: []});
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
    localTime = localTime.substring(0, localTime.length-3);
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
        console.log(date, temp.temp_date);
        console.log(date <= temp.temp_date);
        // Check if it is still the same day
        if (date > temp.temp_date)
        {
          this.showToast("Temporary access for this device has expired");
        }
        // Check if within the time rules
        else
        {   
          if (localTime < temp.temp_time_range_start)
          {
            this.showToast("This device is not available at this time (Too early)");
          }
          else if (localTime > temp.temp_time_range_end)
          {
            this.showToast("The time window for this device has expired (Too late)");
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
                  if(data.statusCode === 400)
                    console.log("%j", data.message);
                  
                  // this.getValueForSharedDeviceProperty(account, device, property);
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

                          // this.getValueForSharedDeviceProperty(account, device, property);
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
                this.showToast("This device is not available at this time (Too late or wrong day)");
                console.log("This device is not available at this time (Too late or wrong day)");
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
              
              // this.getValueForSharedDeviceProperty(account, device, property);
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

            // this.getValueForSharedDeviceProperty(account, device, property);
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

  render() {
    return (
      <View style={[appStyle.container, {marginLeft:-10, marginRight:-10}]}>
        <View style={[appStyle.card]}>

          {/* Render the owners name */}
          <AppHeaderText style={[style.name], {marginBottom:-10, marginTop:10}}>
            {this.props.owner}'s House
          </AppHeaderText>

          {/* Render the device icon */}
          {this.props.device.name === "Google Home Mini" &&
            <Image
              style={[style.icon, { marginBottom: 0 }]}
              source={getDeviceIcon("Google Home Mini")}
            />
          }

          {this.props.device.name !== "Google Home Mini" &&
          <Image
            style={[style.icon, { marginBottom: 0 }]}
            source={getDeviceIcon(this.props.device.description)}
          />
          }

          {/* Render the device name */}
          <AppHeaderText style={[style.name], {marginBottom:20}}>
            {this.props.device.name}
          </AppHeaderText>
          
          {/* Render loading bar */}
          {this.state.device === null &&
            (<View><AppText>Loading...</AppText></View>)
          }

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
                      
                      {/* Render Property Readonly */}
                      {prop.read_only == 1 && 
                        <AppText style={{ fontStyle: 'italic', fontSize: 16 }}> {prop.value == '' ? 'No Value': prop.value}</AppText>
                      }
    
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
                        <View style={{bottom:5}}>
                          <TouchableOpacity onPress={() => this.useSharedDevice(this.props.device.login_credentials_id, this.state.device, prop)}> 
                            <Text style={{fontSize: 20}}>&#9899;</Text>
                          </TouchableOpacity>
                        </View>
                      }
                    </View>
                  </View>
                </View>
                
                <View style={appStyle.row}>

                  {/* Render Property Info */}
                  <RenderAccess curVal={prop}/>

                </View>
                <View style = {style.lineContainer} />
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
