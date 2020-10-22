import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import appStyle from '../../styles/AppStyle';

class DeviceCard extends Component 
{
    state = 
    {
      owned: true
    }

    render () 
    {
        return (
            <View style={appStyle.card}>

                <TouchableOpacity style={appStyle.container} onPress={() => { console.log("hi"); } }>
                    
                    {/* Render the device icon */}
                    <Image
                        style={[style.icon, {marginBottom:10}]}
                        source={require('../../../assets/icons/hub.png')}
                    />
                    
                    {/* Render the hub name */}
                    <AppHeaderText style={style.name}>Office Light</AppHeaderText>
                    

                </TouchableOpacity>
            </View>
        );
    }
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

export default DeviceCard;