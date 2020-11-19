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
   
    return (
        <TouchableOpacity style={[appStyle.row, {flex:1, marginTop:5} ]} onPress={() => {props.selected(props.device)}}>
                <View style={appStyle.rowLeft}>
                    <Image style={{width:35, height:35}} source={require('../../assets/device.png')} />
                    <AppText style={{marginTop:5, marginLeft:10}}> {props.device.name}</AppText>
                </View>
                <View style={appStyle.rowRight}>
                    <Image style={{width:30, height:30, marginTop:3}} source={require('../../assets/right.png')} />
                </View>
            <View style={[(appStyle.lineSeperatorAlt), {marginTop:5}]}/>
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
                                <View key={index} style={{height:50}}>
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