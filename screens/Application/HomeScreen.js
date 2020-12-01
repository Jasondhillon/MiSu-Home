import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AppHeaderText from '../../components/app/AppHeaderText';
import AppText from '../../components/app/AppText';
import HomeCard from '../../components/cards/HomeCard';
import HubCard from '../../components/cards/HubCard';
import LogCard from '../../components/cards/LogCard';
import ShareModal from '../../components/modals/ShareModal';
import appStyle from '../../styles/AppStyle';

// AWS Config
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1"});

// Logging config
// 0 for no logs, 1 for basic logs, 2 for verbose
const debug = 0;


class HomeScreen extends React.Component {

    static navigationOptions = ({ navigate, navigation }) => ({
      headerTitle: 'Home',
      headerRight: () => (
          <View>
              <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => navigation.navigate("Account") }>
                  <Icon name="menu" size={35} style={{ marginRight:16, marginBottom:0, bottom:-10 }}/>
                  <Text style={{fontSize:22, top:-22, right:50, fontWeight: 'bold'}}>{ navigation.getParam('name') != null ? navigation.getParam('name') : "..."}</Text>
              </TouchableOpacity>
          </View>
      ),
      headerLeft: () => ( 
        <View>
          <Image
            style={[{marginBottom:-5, marginLeft:10, width:64, height:64}]}
            source={require('../../assets/MISU.png')}
          />
        </View> )
    });

    constructor(props){
      super(props)

      this.state = {
        error: null,
        message: null,
        selectedProperties: 0,
        refreshing: false,
        loading: false,
        ref: false,
        refresh: false,
        usageLogs: [],
        accessLogs: []
      }
      this.ModalRef = React.createRef();
    }
  
    // Called when when the screen is about to load, grabs all the info to display
    componentDidMount() {
      if(this.props.sessionData != null)
        this.props.navigation.setParams({
          name: this.props.sessionData.name
        })
      this.onRefresh();
    }

    // Retrieves all the information on pull down/refresh of the app
    onRefresh = async () => {
      await this.setState({loading: true});
      await this.setState({refreshingUsers: true});
      const { idToken} = this.props.sessionData 
      this.props.getHub(idToken)
      this.props.getDevices(idToken)
      await this.props.getAccounts(idToken)
      this.props.getSharedDevices(idToken)
      this.getUsageLogs()
      this.getAccessLogs()
      await this.setState({loading: false});
      await this.setState({refreshingUsers: false});
    }


      
    UNSAFE_componentWillReceiveProps (props){
      this.setState({
        refresh: !this.state.refresh
      })


      if((!this.state.loading && props.updateInviteState.loading)|| (!this.state.loading && props.exitHubData.loading)||(!this.state.loading &&  props.shareState.loading) || (!this.state.loading && props.exitHubData.loading)){
        this.setState({
              loading: true
             })
            this.props.screenProps.setLoadingTrue()
      }

      if(this.state.loading &&  !props.shareState.loading && !props.exitHubData.loading && !props.updateInviteState.loading){
        this.setState({
          loading: false
         })
        this.props.screenProps.setLoadingFalse()
      }
    }

    openModal () {
      this.ModalRef.current.snapTo(0)
    }

    // This is where all the components are rendered on the screen
    render() 
    {
      // Display this message if there is no hub registered to you and you have no hubs you're added to.
      let newUserScreen = null;
      let noLogs = null;
      if((this.props.hubInfoData.hub_email == null || this.props.hubInfoData.hub_email == '') && this.state.loading == false && (this.props.sharedDevicesData == null || this.props.sharedDevicesData.devices == null || this.props.sharedDevicesData.devices.length <= 0))
      {
        newUserScreen = (
          <View style={appStyle.container}>
            <View style={ {width:240, alignItems: "center"} }>
                <AppHeaderText style={ { marginTop:20} }>Own a Hub?</AppHeaderText>
                
                <TouchableOpacity style={ appStyle.regularButton} onPress={() => this.props.navigation.navigate("Account") }>
                  <AppText>Register my Hub</AppText>
                </TouchableOpacity>

                <AppText style= { {marginTop:20, fontSize:16} }>If you own a hub, register above.</AppText>
                <AppText style= { {marginTop:5, fontSize:15}} >Otherwise, ask a Hub owner to give you access using your User ID,</AppText>

            </View>
                <AppText style= { {marginTop:5, fontSize:15}}><AppText style = {{fontWeight: "bold"}}> { this.props.sessionData.email} </AppText> </AppText>
          </View>
        );

        
      }
      else {
        if (this.state.usageLogs.length <= 0 && this.state.accessLogs.length <= 0)
        {
          noLogs = (
            <View style={appStyle.card}>
                    <View style={[appStyle.container, {paddingBottom: 0, flex: 1}]}>
                      <View style={appStyle.rowLeft}>
                          <Image style={{width:30, height:30, marginRight:20}} source={require('../../assets/log.png')} />
                          <AppHeaderText>No Logs Yet...</AppHeaderText>
                      </View>
                    </View>
                  </View>
          )
        }
      }

      
     


      return (
        <View style={{flex:1}}>
        <ScrollView style={{flex:1}}
          refreshControl={
          <RefreshControl refreshing={this.state.refreshing}  onRefresh={this.onRefresh}/>
        }>
         
          {this.state.refreshing == false && 
            <View style={[appStyle.container, {flex: 1}]}>
              {/* Display owner hub */}
              {
                (this.props.hubInfoData.hub_email != null && this.props.hubInfoData.hub_email != '') &&
                <HubCard  
                  name={this.props.sessionData.name} 
                  sharedAccounts={this.props.sharedAccountsData.sharedAccounts} 
                  loading={this.state.refreshingUsers}
                  OpenModal={this.openModal.bind(this)}
                  navigation={this.props.navigation}/>
              }
              {/* Display shared accounts*/}
              {
                this.props.sharedDevicesData.devices && Array.isArray(this.props.sharedDevicesData.devices)?
                this.props.sharedDevicesData.devices.map((device,index) => { 
                  return  <HomeCard 
                    key={index} 
                    loading={this.props.exitHubData.loading || this.props.updateInviteState.loading}
                    sharedDevice={device} 
                    navigation={this.props.navigation}
                    exitHub={this.props.exitHub}
                    updateInvite={this.props.updateInvite}
                    IdToken={this.props.sessionData.idToken} /> 
                })
              : null}
              {/* Display Log*/}
              {noLogs}
              
              {this.state.usageLogs.length > 0 ? 
                <View style={[appStyle.container, {padding: 0, flex: 1, alignSelf: 'stretch'}]}>
                  <TouchableOpacity style={{alignSelf: "stretch"}} onPress={() => this.props.navigation.navigate("Log")}>
                    <LogCard type="Usage" logs={this.state.usageLogs.slice(0,5)}/>
                  </TouchableOpacity>
                </View>
              : null}
              {this.state.accessLogs.length > 0 ? 
                <View style={[appStyle.container, {padding: 0, flex: 1, alignSelf: 'stretch'}]}>
                  <TouchableOpacity style={{alignSelf: "stretch"}} onPress={() => this.props.navigation.navigate("Log")}>
                    <LogCard type="Access" logs={this.state.accessLogs.slice(0,5)}/>
                  </TouchableOpacity>
                </View>
              : null}
            </View>
          }
          {/* Screen to show when the screen is empty */}
          { newUserScreen }

          {/* UI Messages */}
          {this.state.error && <Text style={{color: 'red', alignSelf: 'center'}}>{this.state.error}</Text>}
          {this.state.message && <Text style={{color:'black', alignSelf: 'center'}}>{this.state.message}</Text>}

          
        </ScrollView> 
        <ShareModal 
        onRefresh={this.onRefresh}
        ModalRef={this.ModalRef}
        setLoadingTrue={this.props.screenProps.setLoadingTrue}
        setLoadingFalse={this.props.screenProps.setLoadingFalse}
         canEditUser={true}
         />
        </View> );
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
}

  
export default HomeScreen