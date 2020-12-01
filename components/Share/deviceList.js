import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppTitleText from '../app/AppTitleText';
import AppText from '../app/AppText';


export const DeviceList = (props) => {
    const titleString = `${props.selecteduser.guest_email}`
    
    return (
        <View style={appStyle.container}>
            <AppHeaderText style={{textAlign:'center', marginBottom:0, marginTop:-15}}>What device would you like to Share with</AppHeaderText>
            <AppTitleText style={{marginBottom:-10}}>{titleString}</AppTitleText>
            <View style={[{paddingTop:30, marginHorizontal:-20, zIndex:2, elevation:2}]}>
            { props.devices && Array.isArray(props.devices)?props.devices.map( (device ,index) =>{
                    return(
                        <View key={index} style={[appStyle.row, {}]} onTouchStart={() => props.setDevice(device)}>
                            <TouchableOpacity key={index}>
                                <View style={appStyle.row}>
                                    <View style={appStyle.rowLeft}>
                                        <View style={props.selecteddevice && props.selecteddevice.title == device.title ? appStyle.userListEntrySelected:appStyle.userListEntry}>
                                            <AppText style={props.selecteddevice && props.selecteddevice.title == device.title ? { color: 'white'}: { color: 'black'}}>{device.title}</AppText>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }): <View><AppText>No Devices in your Hub...</AppText></View>
                }
            </View>
        </View>
    )
}