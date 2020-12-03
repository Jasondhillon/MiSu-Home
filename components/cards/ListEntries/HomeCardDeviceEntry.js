import * as React from 'react';
import { Switch, Text, View, TouchableOpacity } from 'react-native';
import SmallIcon from '../../SmallIcon';
import appStyle from '../../../styles/AppStyle';
import getDeviceIcon from '../../app/DeviceIcons';

const  HomeCardDeviceEntry = (props) => {
    const name = props.device.name.substring(0, 15);

    return (
    <TouchableOpacity style={appStyle.deviceItem} onPress={()=> {props.navigation.navigate("Device", { device: props.device, owner:props.owner })}}>
        {
            props.device.name == "Google Home Mini" &&
            <SmallIcon img={getDeviceIcon("Google Home Mini")} />
        }
        {
            props.device.name !== "Google Home Mini" &&
            <SmallIcon img={getDeviceIcon(props.device.description)} />
        }
            <Text style={{ fontSize:16 , fontWeight:'700', marginTop:5}}>{name}</Text>
    </TouchableOpacity>)
}

export default HomeCardDeviceEntry