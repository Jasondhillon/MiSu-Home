import * as React from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
//import HubCardSharedUsersListEntry from './ListEntries/HubCardSharedUsersListEntry';
import HomeCardDeviceEntry from './ListEntries/HomeCardDeviceEntry';

class HomeCard extends React.Component {
    constructor(props){
        super(props)
        this.state ={
        }
    }

    createTwoButtonAlert = (user) =>
    Alert.alert(
      "Leave " + user + "'s House?",
      "Are you sure? " + user + " will need to invite you again for access.",
      [
        {
          text: "Cancel",
        },
        { text: "Leave", onPress: () => this.props.exitHub(this.props.sharedDevice.login_credentials_id,this.props.IdToken)}
      ],
      { cancelable: false }
    );

    render()
    {
        // split devices into two columns to be used for rendering
        const col1 = [],col2 = [];

        if(this.props.sharedDevice != null && this.props.sharedDevice.devices != null)
        {
            this.props.sharedDevice.devices.forEach((element, index) => {
                if(element.properties != null && element.properties.length > 0)
                {
                    if(index % 2 == 1)
                        col1.push(element);
                    else
                        col2.push(element);
                }
            });
        };

        return (
            <View style={[appStyle.card, { paddingBottom:0 }]}>
                <View style={[appStyle.container]}>
                    <View style={[appStyle.row, {marginLeft:10, marginTop:-10, marginBottom:5}]}>
                        <View style={appStyle.rowLeft}>
                            <Image style={{width:30, height:30, marginRight:20}} source={require('../../assets/home.png')} />
                            <AppHeaderText>{`${this.props.sharedDevice.sharer_name}'s House`}</AppHeaderText>    
                        </View>
                        <View style={appStyle.rowRight}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity onPress={()=> this.createTwoButtonAlert(this.props.sharedDevice.sharer_name)}>
                                    <Image style={{width:30, height:30}} source={require('../../assets/x.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    <View style={[appStyle.lineSeperatorAlt, {marginHorizontal:-9}]}/>

                        { this.props.sharedDevice.accepted == 1 ?(
                            <View style={[appStyle.row, {marginLeft:-5}]}>
                                {/* Left Column */ }
                                <View style={appStyle.columnLeft}>
                                    {col2.map((device,index) => {
                                        return  (
                                            <HomeCardDeviceEntry navigation={this.props.navigation}  key={index} device={device} owner={this.props.sharedDevice.sharer_name}/>
                                    )})}
                                </View>
                                {/* Right Column */ }
                                <View style={appStyle.columnRight}>
                                    {col1.map((device,index) => {
                                        return  (
                                            <HomeCardDeviceEntry navigation={this.props.navigation} key={index} device={device} owner={this.props.sharedDevice.sharer_name}/>
                                    )})}
                                </View>
                            </View>
                        ): null}
                   
                        { this.props.sharedDevice.accepted == 0 ?(
                            <View>
                                <View style={{paddingTop:10, paddingHorizontal:5, paddingBottom:5}}>
                                    <AppText>You've been given access to devices in this home.</AppText>
                                </View>

                                <View style={appStyle.row}>
                                    <View style={{flex:1, marginRight:5}}>
                                        <TouchableOpacity style={appStyle.greenButton} onPress={()=> this.props.updateInvite(this.props.sharedDevice.login_credentials_id,1,this.props.IdToken)}>
                                                <Text style={{ color: 'white' ,textAlign:"center"}}> Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginLeft:5, flex:1 }}>
                                        <TouchableOpacity style={appStyle.redButton} onPress={()=> this.props.updateInvite(this.props.sharedDevice.login_credentials_id,0,this.props.IdToken)}>
                                                <Text style={{ color: 'white',textAlign:"center"}}> Decline</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ): null}
                </View>
            </View>
        )
    }
}

export default HomeCard