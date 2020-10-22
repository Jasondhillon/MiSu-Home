import * as React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import appStyle from '../../styles/AppStyle';
//import HubCardSharedUsersListEntry from './ListEntries/HubCardSharedUsersListEntry';
import HomeCardDeviceEntry from './ListEntries/HomeCardDeviceEntry';

const btnwidth =  Dimensions.get('screen').width/2 -30

const HomeCard = props => {
    
    console.log({p: props.sharedDevice})
   
    return (
        <View style={[appStyle.card, { paddingBottom:0 }]}>
        <View style={[appStyle.container, {paddingBottom:-20}]}>
            <View style={{ flex:1, flexDirection: 'row'}}>
                <Text>{`${props.sharedDevice.sharer_name}'s Home`}</Text>
                
            </View>
            
            <View style={{ flexDirection: 'row' }}>
                {props.sharedDevice.devices.map((device,index) => {
                    return  <HomeCardDeviceEntry  key={index} device={device}/>
                })}
            </View>

            <View style={{ flexDirection: 'row'
            }}>
                <TouchableOpacity onPress={()=> props.updateInvite(props.sharedDevice.login_credentials_id,1,props.IdToken)}>
                    <View style={{ marginBottom:5 ,marginTop:5, padding:10, backgroundColor:'green' , width: btnwidth , borderRadius: 10}}>
                        <Text style={{ color: 'white' ,textAlign:"center"}}> Accept</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> props.updateInvite(props.sharedDevice.login_credentials_id,0,props.IdToken)}>
                    <View style={{  marginBottom:5 ,marginTop:5, padding:10, backgroundColor:'red', width: btnwidth ,borderRadius: 10}}> 
                        <Text style={{ color: 'white',textAlign:"center"}}> Decline</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    )
}

const style = StyleSheet.create({
    
 });


export default HomeCard