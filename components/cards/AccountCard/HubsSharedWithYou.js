import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import appStyle from '../../../styles/AppStyle';
import AppHeaderText from '../../app/AppHeaderText';
import AppTitleText from '../../app/AppTitleText';
import AppText from '../../app/AppText';
import RegisterHubPopup from '../../popup/RegisterHubPopup';

class HubsSharedWithYou extends Component 
{
    constructor(props)
    {
        super(props);
    }
    // Holds all of our global variables
    state = 
    {
      hubs: null,
    }

    render () 
    {
        return (
            <View style={appStyle.container}>
                
                
                {/********************************************
                  *************** Show Title *****************
                  ********************************************/}
                  
                {/* Hubs Shared with You Title */}
                <View style={appStyle.row}>
                    <AppTitleText style={appStyle.rowLeft}>Hubs Shared with You</AppTitleText>
                </View>

                {/********************************************
                  *************** IF Has Hub Set *************
                  ********************************************/}
                
                {/* Has Hub */}
                

                {/********************************************
                  ************** IF No Hub Set ***************
                  ********************************************/}

                {/* No Hub */}
                {this.state.hubs == null && 
                    <View style={appStyle.row}>
                        <AppText style={appStyle.rowLeft}>No devices are shared with you...</AppText>
                    </View>
                }
            </View>
        );
    }
}

const style = StyleSheet.create({
    name: {
        fontWeight: 'bold'
    }
 });

export default HubsSharedWithYou;