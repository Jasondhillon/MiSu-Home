import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import appStyle from '../../styles/AppStyle';

class UserCard extends Component 
{
    state = 
    {
      owned: true
    }
    
    constructor(props){
        super(props)

        this.state  = {

        }
    }  

    render () 
    {
        return (
            <View style={[appStyle.card, {paddingHorizontal:20}]}>
                <AppHeaderText style={style.name}>Hi!</AppHeaderText>
            </View>
        );
    };

}

const DeviceItem = (props) => {
      
    return (
        <TouchableOpacity onPress={() => props.navigation.navigate('Device')}>
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

const List  = (props) => {
    return (
        <View >
            {props.devices[0].map((device,index)=> <DeviceItem key={index} device={device} navigation={props.navigation} />)}
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

const style = StyleSheet.create({
    name: {
        fontSize:24,
        height:30,
    },
    icon: {
        marginTop:10,
        height:100,
        width: 100,
    }
 });

export default UserCard;