import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import AppHeaderText from '../../components/app/AppHeaderText';
import AppText from '../../components/app/AppText';
import AppTitleText from '../../components/app/AppTitleText';
import ShareModal from '../../components/modals/ShareModal';
import SmallIcon from '../../components/SmallIcon';
import { stopSharingAction } from '../../redux/Action/stopSharing';
import appStyle from '../../styles/AppStyle';


const DeviceItem = (props) => {
   
    return (
        <TouchableOpacity style={[appStyle.row, {flex:1, marginTop:5} ]} onPress={() => {props.selected(props.device)}}>
                <View style={appStyle.rowLeft}>
                    <Image style={{width:35, height:35}} source={require('../../assets/icons/nest_icon.png')} />
                    <AppText style={{marginTop:5, marginLeft:10}}> {props.device.name}</AppText>
                </View>
                <View style={appStyle.rowRight}>
                {/**  <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={"#f5dd4b"}
                            ios_backgroundColor="#3e3e3e"
                            value={true}
            />*/} 
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
                    <AppHeaderText style={{paddingTop:0, fontWeight:'bold'}}> Shared Devices </AppHeaderText>
                </View>
                <View style={[(appStyle.rowRight), {marginTop:-5, marginRight:-5}]}>
                    <TouchableOpacity onPress={()=> props.open(props.guest_email)}>
                    <SmallIcon img={require('../../assets/add.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
            )
}

const Footer = (props) => {
    return(
        <TouchableOpacity onPress={() => props.endSharing()}>
            <View style={appStyle.redButton}>
                <AppText style={{color:'white'}}>End All Sharing</AppText>
            </View>
        </TouchableOpacity>
   )
}


class UserScreen extends React.Component  {

    static navigationOptions = ({ navigate, navigation }) => ({
        headerTitle: '',
        headerLeft: () => (
            <View>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => navigation.navigate("Home")}>
                    <Icon name="arrow-back" size={35} style={{ marginLeft:16, marginBottom:10 }}/>
                </TouchableOpacity>
            </View>
        ),
        headerRight: () => (
            <View>
                <AppTitleText style={{fontWeight: '600', marginRight: 40}}>{navigation.getParam('name')}</AppTitleText>
            </View>
        )
    });
    
    constructor(props){
        super(props)

        this.state  = {

        }
        this.ModalRef = React.createRef();
    }  


    async openModal ( name) {
      await  this.setState({selectedDevice: null ,selecteduser: name});
       
        this.ModalRef.current.snapTo(0);

    }

    selectDevice(device){
        this.setState({selectedDevice: device});
        this.ModalRef.current.snapTo(0);
    }

    endAllSharing(login_id,devices,idToken){
        this.props.navigation.navigate("Home");
        this.props.stopSharing(login_id,devices,idToken);
    }

    render () {
        const { navigation } = this.props;
        const devices =  navigation.getParam('devices',[])
        const login_id=  navigation.getParam('login_credentials_id','')
        const guest_email=  navigation.getParam('guest_email','')

    return (
        <View style={{flex:1}}>
            <View style={appStyle.container}>
                <View style={[appStyle.card, {paddingHorizontal:20}]}>
                    <Header open={this.openModal.bind(this)} guest_email={guest_email} />

                    <View style={[appStyle.lineSeperatorFullAlt, {marginTop:5}]}/>

                    <View style={appStyle.column}>
                        {devices.map((device,index)=>
                        <View key={index} style={{height:50}}>
                            
                            <DeviceItem key={index} device={device} navigation={navigation} selected={this.selectDevice.bind(this)} />
                        <View style={[appStyle.lineSeperatorAlt]}/>
                        </View>)}
                    </View>
                    <Footer endSharing={()=> this.endAllSharing(login_id,devices,this.props.sessionData.idToken)}/>
                </View>
            </View>
            <View style={{ elevation:5, flex:1 }}>
                <ShareModal ModalRef={this.ModalRef} canEditUser={false} user={{guest_email}}  selectedDevice={this.state.selectedDevice}  />
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
    const { hubInfoData ,sessionData ,sharedAccountsData } = state
    return { hubInfoData  ,sessionData ,sharedAccountsData ,}
  };

  const mapDispatchToProps = dispatch =>  {
    return {
        stopSharing : ( login_id ,devices ,idToken) => {dispatch(stopSharingAction( login_id ,devices ,idToken))}
   }
}


 export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)