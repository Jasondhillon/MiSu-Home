import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import appStyle from '../../../styles/AppStyle';
import AppHeaderText from '../../app/AppHeaderText';
import AppTitleText from '../../app/AppTitleText';
import AppText from '../../app/AppText';
import { Auth } from 'aws-amplify';
import YourHub from './YourHub';

class AccountCard extends Component 
{

    render () 
    {
        return (
            <View style={appStyle.card}>
                <AppHeaderText style={style.name}>{this.props.name}</AppHeaderText>

                <YourHub 
                    setHubInfo={this.props.setHubInfo}
                    hub_url = {this.props.hub_url}
                    hub_email = {this.props.hub_email}
                    />
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