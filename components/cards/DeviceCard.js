import React, { Component } from 'react';
import { View, Image, StyleSheet, Switch, Slider, TouchableOpacity } from 'react-native';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import appStyle from '../../styles/AppStyle';

class DeviceCard extends Component 
{
    state = 
    {
            owned: true,
            switchValue: false,
            minVal: 0,
            maxVal: 100,
            currentVal: 50
    }

    

    render () 
    {
        return (
            <View style={appStyle.card}>

                <View style={appStyle.container}>
                    
                    {/* Render the device icon */}
                    <Image
                        style={[style.icon, {marginBottom:0}]}
                        source={require('../../assets/device.png')}
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
                                                { prop.type == 'boolean' && prop.read_only == 0 && 
                                                    <View style={{flex:1, flexDirection:'row'}}>
                                                        <Switch
                                                        value={this.state.switchValue}
                                                        onValueChange={(switchValue) => this.setState({switchValue})}
                                                        />
                                                    </View> 
                                                }
                                                { (prop.type == 'float' || prop.type == 'integer') && prop.read_only == 0 && 
                                                    <View style={{flex:1, flexDirection:'row'}}>
                                        <Slider style={{width: 200}}
                                        step={1}
                                        minimumValue={this.state.minVal}
                                        maximumValue={this.state.maxVal}
                                        value={this.state.currentVal}
                                        onValueChange={val => this.setState({currentVal:val})}
                                        />
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