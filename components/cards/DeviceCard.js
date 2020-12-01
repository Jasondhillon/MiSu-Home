import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Switch,
  Slider,
} from "react-native";
import AppHeaderText from "../app/AppHeaderText";
import AppText from "../app/AppText";
import appStyle from "../../styles/AppStyle";

class DeviceCard extends Component {
  state = {
    owned: true,
    switchVals: [],
    minVal: 0,
    maxVal: 100,
    device: null,
    slider: 0,
  };

  getValueForSharedDeviceProperty = async (account, device, property) => {
    // console.log("\n\n%j", 2, property);

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
          var list = this.props.device;
          var temp = list.properties[list.properties.indexOf(property)]; 

          for (var key in data.message) {
            if (data.message.hasOwnProperty(key)) {
            //   console.log("Changing " + temp.name + " to " + data.message[key]);
              temp.value = data.message[key];

              if (temp.type === "boolean")
                this.state.switchVals.push(temp.value);
            }
          }

          this.setState({ device: list });
        } else throw error("Values empty");
      })
      .catch((error) => {
        console.error("getValueForSharedDeviceProperty error:", error);
      });
  };

  getCurrentValues = async () => {
    this.props.device.properties.map((property) => {
      if (property.type !== "action")
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
                  }
                  else
                  {
                    console.log("Can't use this device on this day");
                  }
                }
              }
              else
              {
                //this.showToast("This device is not available at this time (Too late)");
                console.log("This device is not available at this time (Too late");
              }
            }
            else
            {
              //this.showToast("This device is not available at this time (Too early)");
              console.log("This device is not available at this time (Too early)");
            }
          }
          else
          {
            //this.showToast("Access to this device has expired (Schedule has ended)");
            console.log("Access to this device has expired (Schedule has ended)");
          }
        }
        else
        {
          ////this.showToast("This device is not available at this date (Schedule hasn't started yet)");
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
    }
  }

  render() {
    return (
      <View style={appStyle.card}>
        <View style={appStyle.container}>
          {/* Render the device icon */}
          <Image
            style={[style.icon, { marginBottom: 0 }]}
            source={require("../../assets/device.png")}
          />

          {/* Render the hub name */}
          <AppHeaderText style={style.name}>
            {this.props.device.name}
          </AppHeaderText>

          {this.state.device !== null && this.state.device.properties.map((prop, index) => {
            return (
              <View key={index} style={appStyle.row}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={appStyle.rowLeft}>
                    <AppText> {prop.name} </AppText>
                    {prop.read_only == 1 && <AppText> Read Only</AppText>}
                  </View>

                  <View style={appStyle.rowRight}>
                    {prop.type == "boolean" && prop.read_only == 0 && (
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        <Switch
                          value={this.state.device.properties[index].value}
                          onValueChange={(x) => {
                              this.toggleSwitch(index);
                          }}
                        />
                      </View>
                    )}
                    {(prop.type == "float" || prop.type == "integer") &&
                      prop.read_only == 0 && (
                        <View style={{ flex: 1, flexDirection: "row" }}>
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
                                this.setState({device: temp})
                            }
                            }
                          />
                        </View>
                      )}
                  </View>
                </View>
              </View>
            );
          })}
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
});

export default DeviceCard;
