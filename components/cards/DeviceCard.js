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
                    <AppHeaderText style={style.name}>{this.props.device.name}</AppHeaderText>
                    
                    {
                        this.props.device.properties.map((prop,index) => { 
                        return  <View key={index} style={appStyle.row}>
                                        <View style={{flex:1, flexDirection:'row'}}>
                                            <View style={appStyle.rowLeft}>
                                                <AppText> {prop.name} </AppText>
                                                { prop.read_only == 1 && <AppText> Read Only</AppText>}
                                            </View>

                                            <View style={appStyle.rowRight}>
                                                { prop.type == 'boolean' && 
                                                    <View style={{flex:1, flexDirection:'row'}}>
                                                        <Switch/>
                                                    </View> 
                                                }
                                                { prop.type == 'float' && 
                                                    <View style={{flex:1, flexDirection:'row'}}>
                                                        <Slider style={appStyle.deviceSlider}/>
                                                    </View> 
                                                }
                                            </View> 
                                        </View> 
                                </View> 
                    })}
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