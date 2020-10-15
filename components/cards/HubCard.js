import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import appStyle from '../../styles/AppStyle';
import ExampleModal from '../modals/ExampleModal';
import { withNavigation } from 'react-navigation';

class HubCard extends Component 
{
    state = 
    {
      owned: true
    }

    render () 
    {
        return (
            <View style={appStyle.card}>

                <TouchableOpacity style={appStyle.container} onPress={() => { this.props.navigation.navigate("Device"); } }>
                    {/* Render the hub name */}
                    <AppHeaderText style={style.name}>Home Hub</AppHeaderText>

                    {/* Render the hub icon */}
                    <Image
                        style={style.icon}
                        source={require('../../assets/icons/hub.png')}
                    />
                    
                    {/* Start the hub's sharing view */}
                    <View style={appStyle.row}>
                        {/* Render the hub sharing description */}
                        <AppText style={appStyle.rowLeft}>Sharing with...</AppText>

                        <View style={appStyle.rowRight}>
                            {/* Render the hub sharing details */}
                            <AppText style={appStyle.sharingUser}>Jason</AppText>
                        </View>
                    </View>
                    
                    {/* Render the hub devices */}

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
        height:150,
        width: 150,
    }
 });

export default withNavigation(HubCard);