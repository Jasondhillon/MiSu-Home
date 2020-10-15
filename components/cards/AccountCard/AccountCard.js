import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import appStyle from '../../../styles/AppStyle';
import AppHeaderText from '../../app/AppHeaderText';
import AppTitleText from '../../app/AppTitleText';
import AppText from '../../app/AppText';
import YourHub from './YourHub';
import HubsSharedWithYou from './HubsSharedWithYou';

class AccountCard extends Component 
{
    // Holds all of our global variables
    state = 
    {
      name: 'Tom Smith'
    }

    render () 
    {
        return (
            <View style={appStyle.card}>
                <AppHeaderText style={style.name}>{this.state.name}</AppHeaderText>

                <YourHub></YourHub>

                <HubsSharedWithYou></HubsSharedWithYou>

                <TouchableOpacity style={[{marginHorizontal:50, marginBottom: 10}, appStyle.regularButton]} onPress={this.forgetHub}>
                    <AppText>Log out</AppText>
                </TouchableOpacity>
            </View>
        );
    }
}

const style = StyleSheet.create({
    name: {
        fontWeight: 'bold'
    }
 });

export default AccountCard;