import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import AppHeaderText from '../../components/app/AppHeaderText';
import AppText from '../../components/app/AppText';
import ShareModal from '../../components/modals/ShareModal';
import SmallIcon from '../../components/SmallIcon';
import { stopSharingAction } from '../../redux/Action/stopSharing';
import appStyle from '../../styles/AppStyle';


const DeviceItem = (props) => {
   
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
    var desc = "";
    props.device.properties.forEach(x => desc += x.name + ", ");
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
                if(dayCut == "Thu")
                {
                    firstPropTimeRangeReoccuringStr += "R, ";
                }
                // Check if the time range is sunday for special case of using U to signify it
                else if(dayCut == "Sun")
                {
                    firstPropTimeRangeReoccuringStr += "U, ";
                }
                else
                    firstPropTimeRangeReoccuringStr += dayCut[0] + ", ";
            }
            tempCount++;
        }
    }
    firstPropTimeRangeReoccuringStr = firstPropTimeRangeReoccuringStr.substring(0, firstPropTimeRangeReoccuringStr.length - 2);
    return (
        <TouchableOpacity style={[{flex:1, marginTop:5} ]} onPress={() => {props.selected(props.device)}}>
            {/* Display first row detailing the name, properties, and selection button*/ }
            <View style={appStyle.row}>
                <View style={appStyle.rowLeft}>
                    <Image style={{width:35, height:35}} source={require('../../assets/device.png')} />
                    <View style={appStyle.column}>
                        <AppText style={{marginTop:0, marginLeft:10}}>{deviceName}</AppText>
                    </View>
                </View>
                <View style={appStyle.rowRight}>
                    <AppText style={{paddingBottom:12, marginRight:10, fontSize:14}}> {desc}</AppText>
                    <Image style={{width:30, height:30, marginTop:3}} source={require('../../assets/right.png')} />
                </View>
                <View style={[(appStyle.lineSeperatorAlt), {marginTop:5}]}/>
            </View>
            {/* Display second row detailing the access*/ }
            <View style={appStyle.row}>
                {
                    firstProp.unrestricted == 1 && 
                        <View>
                            <AppText style={{fontSize:14, marginTop:-4}}>* Unrestricted Access</AppText>
                        </View>
                }
                {
                    firstProp.time_range == 1 && 
                        <View style={appStyle.row}>
                            <AppText style={{fontSize:14, marginTop:-4}}>{formatDate(firstProp.time_range_start)} {firstProp.time_range_start_date}</AppText>
                            <AppText style={{fontSize:14, marginTop:-4}}>  -  {formatDate(firstProp.time_range_end)} {firstProp.time_range_end_date}</AppText>
                            <AppText style={{fontSize:14, marginTop:-4}}>,  {firstPropTimeRangeReoccuringStr}</AppText>
                        </View>
                }
                {
                    firstProp.temporary == 1 && 
                        <View>
                            <AppText style={{fontSize:14, marginTop:-4}}>{(firstProp.temp_date)}, {formatDate(firstProp.temp_time_range_end)}</AppText>
                        </View>
                }
            </View>
        </TouchableOpacity>
    )
}


const Header = (props) => {
    return (
        <View style={appStyle.column}>
            <View style={appStyle.row}>
                <View style={appStyle.rowLeft}>
                    <AppHeaderText style={{paddingTop:0, fontWeight:'bold'}}>Shared Devices</AppHeaderText>
                </View>
                <View style={[(appStyle.rowRight), { marginTop: -5, marginRight: -5 }]}>
                    <TouchableOpacity onPress={()=> props.open()}>
                    <SmallIcon img={require('../../assets/deviceAdd.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
            )
}

const Footer = (props) => {
    
    var createTwoButtonAlert = (user) =>
    Alert.alert(
      "End sharing with " + props.name,
      "Are you sure? You will need to invite " + props.name + " again.",
      [
        {
          text: "Cancel",
        },
        { text: "End", onPress: () => props.endSharing()}
      ],
      { cancelable: false }
    )

    return(
        <TouchableOpacity onPress={() => createTwoButtonAlert()}>
            <View style={appStyle.redButton}>
                <AppText style={{color:'white'}}>End All Sharing</AppText>
            </View>
        </TouchableOpacity>
   )
}


class UserScreen extends React.Component  {

    static navigationOptions = ({ navigate, navigation }) => ({
        headerTitle: navigation.getParam('sharedAccount').sharedAccount.name,
        headerLeft: () => (
            <View>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => navigation.navigate("Home")}>
                    <Icon name="arrow-back" size={35} style={{ marginLeft:16, marginBottom:10 }}/>
                </TouchableOpacity>
            </View>
        ),
        headerRight: () => (
            <View>
            </View>
        )
    });
    
    constructor(props){
        super(props)

        this.state  = {
            loading: false,
            refresh: false,
            devices: [],
            email: '',
            name: '',
            sharedAccount: {}
        }
        this.ModalRef = React.createRef();
    }  


    UNSAFE_componentWillMount(){
        const { navigation } = this.props
        const sharedAcc = navigation.getParam('sharedAccount').sharedAccount;
        const devices = sharedAcc.devices
        const guest_email = sharedAcc.guest_email
        const name = sharedAcc.name
        if(sharedAcc != null)
        {
            this.setState({
                email: guest_email,
                name: name,
                sharedAccount: sharedAcc
            }) 
        }
        if(devices != null)
        {
            this.setState({
                devices: devices,
            })
        }

    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            refresh: !this.state.refresh
        })

        if(!this.state.loading && props.StopShareState.loading){
            this.setState({
                loading: true
            })
            this.props.screenProps.setLoadingTrue()
        }

        if(this.state.loading && !props.StopShareState.loading){
            this.setState({
                loading: false
            })
            this.props.screenProps.setLoadingFalse()
            this.props.navigation.navigate("Home")
        }
        
        if(props.sharedAccountsData != null) {

            this.getSharedAccountDevicesFromRedux(this.state.email, props.sharedAccountsData.sharedAccounts)
        }
    }

    async openModal ( ) {
        await this.setState({selecteddevice: null});
        this.ModalRef.current.snapTo(0);
    }
    
    async selectDevice(device){
        // You have to map the devices into another layout for the ShareModal to read it
        await Object.keys(this.props.devicesData.devices).map(async (item,index) => {
            if(this.props.devicesData.devices[item].title == device.name)
            {
                await this.setState({selecteddevice: this.props.devicesData.devices[item]});
            }
        })
        this.ModalRef.current.snapTo(0);
    }

    endAllSharing(login_id,devices,idToken){
        //console.log(login_id);
        this.props.stopSharing(login_id,devices,idToken);
    }


     getSharedAccountDevicesFromRedux (email ,sharedAccounts) {
        const Account =  sharedAccounts.find(faccount => faccount.guest_email == email)
        if(Account != null && Account.devices != null){
            this.setState({
                devices: Account.devices
            })
        }
     }  


    render () {
        return (
            <View style={{flex:1}}>
                <View style={appStyle.container}>
                    <View style={[appStyle.card, {paddingHorizontal:20}]}>
                        <Header open={this.openModal.bind(this)} guest_email={this.state.email} />

                        <View style={[appStyle.lineSeperatorFullAlt, {marginTop:5}]}/>

                        <View style={appStyle.column}>
                            { this.state.devices != null && this.state.devices.map((device,index)=> 
                                <View key={index} style={{height:65}}>
                                    <DeviceItem key={index} device={device} navigation={this.props.navigation} selected={this.selectDevice.bind(this)} />
                                    <View style={[appStyle.lineSeperatorAlt]}/>
                                </View>
                            )}
                        </View>
                        <Footer name={this.state.name} endSharing={()=> this.endAllSharing(this.state.sharedAccount.login_credentials_id,this.state.devices,this.props.sessionData.idToken)}/>
                    </View>
                </View>
                <View style={{ elevation:5, flex:1 }}>
                    <ShareModal ModalRef={this.ModalRef} canEditUser={false} selecteduser={this.state.sharedAccount}  selecteddevice={this.state.selecteddevice}  />
                </View>
            </View>
        )
    }
}

const styles  = StyleSheet.create({
    container: {
        flex:1,
   },
   header : {
       flexDirection:'row',
       justifyContent: 'space-between'
   },
  
})

const mapStateToProps = (state) => {
    const { devicesData, hubInfoData, sessionData, sharedAccountsData ,StopShareState} = state
    return {devicesData, hubInfoData, sessionData, sharedAccountsData ,StopShareState}
  };

  const mapDispatchToProps = dispatch =>  {
    return {
        stopSharing : ( login_id ,devices ,idToken) => {dispatch(stopSharingAction( login_id ,devices ,idToken))}
   }
}


 export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)