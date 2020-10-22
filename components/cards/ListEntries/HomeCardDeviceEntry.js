import * as React from 'react';
import { Switch, Text, View } from 'react-native';
import SmallIcon from '../../SmallIcon';

const  HomeCardDeviceEntry = (props) => {
    return (<View style={{ flex:1, justifyContent:"center" ,alignItems:"center"}}>
         <SmallIcon img={require('../../../assets/home.png')} />
            <Text style={{ fontSize:25 , fontWeight:'700'}}>{props.device.name}</Text>
            <Text style={{ fontSize:15 , fontWeight:'500'}}>{props.device.description}</Text>
        <Switch/>
    </View>)
}

export default HomeCardDeviceEntry