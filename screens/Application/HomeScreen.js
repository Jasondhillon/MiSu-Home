import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AppHeaderText from '../../components/app/AppHeaderText';
import AppText from '../../components/app/AppText';
import HomeCard from '../../components/cards/HomeCard';
import HubCard from '../../components/cards/HubCard';
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
                  <Icon name="menu" size={35} style={{ marginRight:16, marginBottom:10 }}/>
              </TouchableOpacity>
          </View>
      ),
      headerLeft: () => ( <View></View> )
    });

    constructor(props){
      super(props)

      this.state = {
        error: null,
        message: null,
        selectedProperties: 0,
        refreshing: false,
        ref: false
      }
      this.ModalRef = React.createRef();
    }

  
    // Adds a device/property to share
  toggleCheckbox = (device, property) => {
    // Find the device and the property checked and set the value accordingly
    var list = []  //this.props.appData.devices;
    var temp = list[list.indexOf(device)].newProps;
    temp = temp[temp.indexOf(property)];
    temp.property.isChecked = !temp.property.isChecked;
    this.props.setDevices(list);

    // Keep track of the number of properties selected
    if(temp.property.isChecked)
      this.setState({selectedProperties: this.state.selectedProperties+1});
    else
      this.setState({selectedProperties: this.state.selectedProperties-1});
  }


  // Goes through all the devices and properties and gets the current state
  getCurrentValues = async () => {
    this.props.appData.sharedDevices.map((account) => {
      account.devices.map((device) => {
        device.properties.map((property) => {
          property.value = this.getValueForSharedDeviceProperty(account, device, property);
        });
      });
    });
  }

   

    // Called when when the screen is about to load, grabs all the info to display
    componentDidMount() {
      this.onRefresh();
    }

    // Retrieves all the information on pull down/refresh of the app
    onRefresh = async () => {
      const { idToken} = this.props.sessionData 
      this.props.getHub(idToken)
      this.props.getDevices(idToken)
      this.props.getAccounts(idToken)
      this.props.getSharedDevices(idToken)
     
    }
      
    UNSAFE_componentWillReceiveProps (){
      this.setState({
        ref: !this.state.ref
      })
    }


    openModal () {
      this.ModalRef.current.snapTo(0)
    }

    // This is where all the components are rendered on the screen
    render() 
    {
      // Display this message if there is no hub registered to you and you have no hubs you're added to.
      let newUserScreen = null;
     // if((this.props.appData.hub_email == '' || this.props.appData.hub_email == null) && this.props.appData.devices == null && this.state.refreshing == false && this.props.appData.name != null && this.props.appData.name != '')
     if((this.props.hubInfoData.hub_email == null || this.props.hubInfoData.hub_email == '') && this.props.sharedDevicesData == null)
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


      return (
        <View style={{flex:1}}>
        <ScrollView style={{flex:1}}
          refreshControl={
          <RefreshControl refreshing={this.state.refreshing}  onRefresh={this.onRefresh}/>
        }>
         
          {this.state.refreshing == false && 
            <View style={appStyle.container}>
              {/* Display owner hub */}
              {
                (this.props.hubInfoData.hub_email != null && this.props.hubInfoData.hub_email != '') &&
                <HubCard  
                name={this.props.sessionData.name} 
                sharedAccounts={this.props.sharedAccountsData.sharedAccounts} 
                OpenModal={this.openModal.bind(this)}
                navigation={this.props.navigation}/>
              }
              {/* Display shared accounts*/}
              {
                this.props.sharedDevicesData.devices?
                this.props.sharedDevicesData.devices.map((device,index) => { 
                  return  <HomeCard key={index} sharedDevice={device} updateInvite={this.props.updateInvite} /> 
                })
          : null}
            </View>
          }



          {/* Screen to show when the screen is empty */}
          { newUserScreen }

          {/* UI Messages */}
          {this.state.error && <Text style={{color: 'red', alignSelf: 'center'}}>{this.state.error}</Text>}
          {this.state.message && <Text style={{color:'black', alignSelf: 'center'}}>{this.state.message}</Text>}

          
        </ScrollView> 
        <ShareModal ModalRef={this.ModalRef} canEditUser={true}/>
        </View> );
    }

  
  
}
  
export default HomeScreen