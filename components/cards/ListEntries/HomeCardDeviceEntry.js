import * as React from 'react';
import { Switch, Text, View, TouchableOpacity } from 'react-native';
import SmallIcon from '../../SmallIcon';
import appStyle from '../../../styles/AppStyle';

const  HomeCardDeviceEntry = (props) => {
    return (
    <TouchableOpacity style={appStyle.deviceItem}>
         <SmallIcon img={require('../../../assets/home.png')} />
            <Text style={{ fontSize:25 , fontWeight:'700'}}>{props.device.name}</Text>
            <Text style={{ fontSize:15 , fontWeight:'500'}}>{props.device.description}</Text>
    </TouchableOpacity>)
}

export default HomeCardDeviceEntry