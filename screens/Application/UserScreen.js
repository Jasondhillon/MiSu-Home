import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import AppTitleText from '../../components/app/AppTitleText';
import UserCard from '../../components/cards/UserCard';
import ShareModal from '../../components/modals/ShareModal';
import SmallIcon from '../../components/SmallIcon';
import { stopSharingAction } from '../../redux/Action/stopSharing';
import appStyle from '../../styles/AppStyle';

const DeviceItem = (props) => {
  
    return (
        <TouchableOpacity onPress={() => {props.selected(props.device)}}>
        <View style={styles.item}>
            <SmallIcon img={require('../../assets/wifi.png')} />
    <Text> {props.device.name}</Text>
            <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={"#f5dd4b"}
                    ios_backgroundColor="#3e3e3e"
                    value={true}
      />
            <SmallIcon img={require('../../assets/right.png')} />
        </View>
        </TouchableOpacity>
    )
}


const Header = (props) => {
    return (
        <View style={styles.header}>
            <Text> Shared Devices </Text>
            <TouchableOpacity onPress={()=> props.open()}>
            <SmallIcon img={require('../../assets/add.png')} />
            </TouchableOpacity>
        </View>
    )
}

const Footer = (props) => {
    return(
        <TouchableOpacity onPress={() => props.endSharing()}>
            <View style={styles.enbtn}>
                <Text style={{ color:'white'}}>End All Sharing</Text>
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


    openModal () {
        this.setState({selectedDevice: null});
        this.ModalRef.current.snapTo(0);
    }

    selectDevice(device){
        this.setState({selectedDevice: device});
        this.ModalRef.current.snapTo(0);
    }



    render () {
        const { navigation } = this.props;
        const devices =  navigation.getParam('devices',[])
        const email =  navigation.getParam('email',[])
    return (
        <View style={{flex:1}}>
            <View style={appStyle.container}>
                <View style={[appStyle.card, {paddingHorizontal:20}]}>
                    <Header open={this.openModal.bind(this)} />

                    <View >
                        {devices.map((device,index)=> <DeviceItem key={index} device={device} navigation={navigation} selected={this.selectDevice.bind(this)} />)}
                    </View>

                    <Footer endSharing={()=> this.props.stopSharing(email,devices,this.props.sessionData.idToken)}/>
                </View>
            </View>
            <View style={{ elevation:5, flex:1 }}>
                <ShareModal ModalRef={this.ModalRef} canEditUser={false} user={{guest_email : email}}  selectedDevice={this.state.selectedDevice}  />
            </View>
        </View>
    )
}
}

const styles  = StyleSheet.create({
    container: {
        flex:1,
   },
   cardcont:{ 
    margin: 10,
    padding: 40 
   }, 
   header : {
       flexDirection:'row',
       justifyContent: 'space-between'
   },
   item :{
       flexDirection: 'row',
       justifyContent: 'space-between',
        marginBottom: 10 , 
        marginTop:10
   },
   enbtn: {
        padding:5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:"center"
   },
  
})

const mapStateToProps = (state) => {
    const { hubInfoData ,sessionData ,sharedAccountsData } = state
    return { hubInfoData  ,sessionData ,sharedAccountsData ,}
  };

  const mapDispatchToProps = dispatch =>  {
    return {
        stopSharing : (account ,devices ,idToken) => {dispatch(stopSharingAction(account ,devices ,idToken))}
   }
}


 export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)