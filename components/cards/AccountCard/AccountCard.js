import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import appStyle from '../../../styles/AppStyle';
import AppHeaderText from '../../app/AppHeaderText';
import AppTitleText from '../../app/AppTitleText';
import AppText from '../../app/AppText';
import { Auth } from 'aws-amplify';
import YourHub from './YourHub';
import HubsSharedWithYou from './HubsSharedWithYou';

class AccountCard extends Component 
{

    // Signs the user out and sends them back to the login screen
    signOut = async () => {
        ToastAndroid.show("Signing out!", ToastAndroid.LONG);
        Auth.signOut()
        .then(this.props.navigation.navigate("Auth"));
    }

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

                <HubsSharedWithYou></HubsSharedWithYou>

                <TouchableOpacity style={[{marginHorizontal:50, marginBottom: 10}, appStyle.regularButton]} onPress={this.signOut}>
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