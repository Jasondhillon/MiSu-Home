import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppTitleText from '../app/AppTitleText';
import AppText from '../app/AppText';


export const DeviceList = (props) => {
    //console.log({p:props.selecteduser})
    //console.log({
    //   dec: props.devices
    //})

    const titleString = `${props.selecteduser.guest_email?props.selecteduser.guest_email:props.selecteduser}`
    const fontSiz = titleString.length <=  10 ? 25 :18
    return (
        <View style={appStyle.container}>
            <AppHeaderText style={{textAlign:'center', marginBottom:0}}>What device would you like to Share with</AppHeaderText>
            <AppTitleText>{titleString}</AppTitleText>
            { props.devices && Array.isArray(props.devices)?
                props.devices.map( (device ,index) =>{
                    return(
                        <TouchableOpacity 
                            key={index}
                                onPress={()=> console.log("Example"), props.setDevice(device)}>
                            
                            <View style={appStyle.row}>
                                <View style={appStyle.rowLeft}>
                                    <View style={props.selecteddevice && props.selecteddevice.title == device.title ? appStyle.userListEntrySelected:appStyle.userListEntry}>
                                        <AppText style={props.selecteddevice && props.selecteddevice.title == device.title ? { color: 'white'}: { color: 'black'}}>{device.title}</AppText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }):null
            }
        </View>
    )
}