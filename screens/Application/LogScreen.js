import { Auth } from 'aws-amplify';
import React from 'react';
import { TouchableOpacity, View, ScrollView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
import appStyle from '../../styles/AppStyle';
import LogCard from '../../components/cards/LogCard'

class LogScreen extends React.Component {
    static navigationOptions = ({ navigate, navigation }) => ({
        headerTitle: navigation.getParam('device','').name,
        headerLeft: () => (
            <View>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => navigation.navigate("Home")}>
                    <Icon name="arrow-back" size={35} style={{ marginLeft:16, marginBottom:10 }}/>
                </TouchableOpacity>
            </View>
        ),
        headerRight: () => ( <View></View>)
    });


    state = {
        usageLogs: [],
        accessLogs: []
    }

    componentDidMount(){
        this.getUsageLogs()
        this.getAccessLogs()
    }
   
    // Gets the logs for the devices the user has shared
    getUsageLogs = async () => {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getusagelogs', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + this.props.sessionData.idToken
          }
        })
        .then(response => response.json())
        .then(data => {
            //console.log("%j", "Usage Logs", data.message);
            if (data.message.length > 0)
            {
              var sortedLogs = data.message.sort((a,b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time < b.time) ? 1 : -1) : -1);
              this.setState({usageLogs: sortedLogs});
            }
        })
        .catch((error) => {
          //console.error('getUsageLogs error:', error);
          this.showToast(error);
          this.setState({error});
        });
      }
  
      // Gets the logs for the access which may have been granted or revoked to the user
      getAccessLogs = async () => {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getaccesslogs', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + this.props.sessionData.idToken
          }
        })
        .then(response => response.json())
        .then(data => {
          //console.log("%j", "Access Logs", data.message);
          if (data.message.length > 0)
          {
            var sortedLogs = data.message.sort((a,b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time < b.time) ? 1 : -1) : -1);
            this.setState({accessLogs: sortedLogs});
          }
        })
        .catch((error) => {
            //console.error('getAccessLogs error:', error);      
            this.showToast(error);
            this.setState({error});
        });
      }
   
    render()
    {
        return(
            <View style={appStyle.container}>
                <ScrollView style={appStyle.scrollView}>

                    {this.state.usageLogs.length > 0 ? <LogCard logs={this.state.usageLogs}/> : null}
                    {this.state.accessLogs.length > 0 ? <LogCard logs={this.state.accessLogs}/> : null}

                    {/* Usage Logs
                    {this.state.usageLogs !== null ? <Text>{"\n"}</Text> : null}
                    {this.state.usageLogs !== null ? <View style={{borderBottomColor: 'black', borderBottomWidth: 3}}/> : null}
                    {this.state.usageLogs !== null && <Text>Usage Logs</Text>}
                    <Text>{"\n"}</Text>
                    {
                    this.state.usageLogs !== null && this.state.usageLogs.map((log, index) => (
                    <View key={index}>
                        <Text style={{marginLeft: 20, fontSize: 18,}}>{log.date} - {log.time}</Text>
                        <Text >&rarr;User: {log.secondary_user}</Text>
                        <Text >&rarr;Device: {log.device_name} ({log.device_description})</Text>
                        <Text >&rarr;Property: {log.property_name}</Text>
                        <Text >&rarr;Value: {log.value ? "On" : "Off"}</Text>
                        <Text>{"\n"}</Text>
                    </View>
                    ))
                    }
                     */}

                    {/* Access Logs
                    {this.state.accessLogs !== null ? <Text>{"\n"}</Text> : null}
                    {this.state.accessLogs !== null ? <View style={{borderBottomColor: 'black', borderBottomWidth: 3}}/> : null}
                    {this.state.accessLogs !== null && <Text>Access Logs</Text>}
                    <Text>{"\n"}</Text>
                    {
                    this.state.accessLogs !== null && this.state.accessLogs.map((log, index) => (
                        <View key={index}>
                            <Text style={{marginLeft: 20, fontSize: 18,}}>{log.date} - {log.time}</Text>
                            <Text >&rarr;Homeowner: {log.primary_user}</Text>
                            <Text >&rarr;Operation: 
                            {(() => {
                            if (log.operation === "Create")
                                return " Gave you access";
                            else if (log.operation === "Delete")
                                return " Revoked your access";
                            else if (log.operation === "Ended sharing early")
                                return " You ended sharing early";
                            else 
                                return " You accepted access";
                            })()}</Text>
                            <Text>{"\n"}</Text>
                        </View>
                    ))
                    } 
                     */}
                    
                </ScrollView>  
            </View>   
        );
    }
}

const mapStateToProps = (state) => {
    const { hubInfoData ,sessionData ,sharedAccountsData  ,registerData} = state
    return { hubInfoData  ,sessionData ,sharedAccountsData ,registerData}
  };

const mapDispatchToProps = dispatch =>  {
    return {
        register : (data,idToken) => dispatch(registerHubAction(data,idToken)),
        getHub : (idToken) => dispatch(getHubInfoAction(idToken)),
   }
}

export default  connect(mapStateToProps,mapDispatchToProps)(LogScreen)