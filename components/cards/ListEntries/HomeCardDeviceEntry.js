import * as React from 'react';
import { Switch, Text, View, TouchableOpacity } from 'react-native';
import SmallIcon from '../../SmallIcon';
import appStyle from '../../../styles/AppStyle';

const  HomeCardDeviceEntry = (props) => {
    return (
    <TouchableOpacity style={appStyle.deviceItem} onPress={()=> {props.navigation.navigate("Device", { device: props.device })}}>
         <SmallIcon img={require('../../../assets/home.png')} />
            <Text style={{ fontSize:18 , fontWeight:'700', marginTop:20}}>{props.device.name}</Text>
    </TouchableOpacity>)
}

export default HomeCardDeviceEntry