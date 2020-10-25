import React, { Component } from 'react';
import { View, Image, StyleSheet, Switch, Slider, TouchableOpacity } from 'react-native';
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

                <View style={appStyle.container}>
                    
                    {/* Render the device icon */}
                    <Image
                        style={[style.icon, {marginBottom:0}]}
                        source={require('../../assets/icons/nest_icon.png')}
                    />
                    
                    {/* Render the hub name */}
                    <AppHeaderText style={style.name}>Nest Home</AppHeaderText>
                    
                    {/* Example Boolean */}
                    <View style={appStyle.row}>
                        <AppText style={appStyle.rowLeft}>On/Off</AppText>
                        <View style={appStyle.rowRight}>
                            <Switch/>
                        </View>
                    </View>

                    {/* Example Float */}
                    <View style={appStyle.row}>
                        <AppText style={appStyle.rowLeft}>Brightness</AppText>
                        <View style={appStyle.rowRight}>
                            <Slider style={appStyle.deviceSlider}/>
                        </View>
                    </View>
                </View>
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