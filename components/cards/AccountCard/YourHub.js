import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import appStyle from '../../../styles/AppStyle';
import AppHeaderText from '../../app/AppHeaderText';
import AppTitleText from '../../app/AppTitleText';
import AppText from '../../app/AppText';
import RegisterHubPopup from '../../popup/RegisterHubPopup';

class YourHub extends Component 
{
    constructor(props)
    {
        super(props);
        this.registeredHub = this.registeredHub.bind(this);
    }
    // Holds all of our global variables
    state = 
    {
      hub_url: null,
      hub_email: null,
      registering: false
    }

    registerHub = async () => {
        console.log("Registering hub");
        this.setState({
            registering: true
        });
    }

    forgetHub = async () => {
        console.log("Forgetting hub");
        this.setState({
            hub_url: null,
            hub_email: null,
            registering: false
        });
    }

    registeredHub = async () => {
        console.log("Registered hub");
        this.setState({
            hub_url: 'MarkA.mozilla-iot.org',
            hub_email: 'MarksHome@gmail.com',
            registering: false
        });
    }

    render () 
    {
        return (
            <View style={appStyle.container}>
                

                {/********************************************
                  *************** Show Popups ****************
                  ********************************************/}
                  
                {/* Show RegisterHubPopup when registering */}
                {this.state.registering == true && 
                    <RegisterHubPopup Register = {this.registeredHub}>
                    </RegisterHubPopup>
                }

                
                {/********************************************
                  *************** Show Title *****************
                  ********************************************/}
                  
                {/* Your Hub Title */}
                <View style={appStyle.row}>
                    <AppTitleText style={appStyle.rowLeft}>Your Hub</AppTitleText>
                </View>
                
                {/********************************************
                  *************** IF Has Hub Set *************
                  ********************************************/}
                
                {/* Hub URL Text */}
                {this.state.hub_url && 
                    <View style={appStyle.row}>
                        <AppText style={appStyle.rowLeft}>Hub URL:</AppText>
                        <View style={appStyle.rowRight}>
                            <AppText>{this.state.hub_url}</AppText>
                        </View>
                    </View>
                }
                {/* Hub Email Text */}
                {this.state.hub_url && 
                    <View style={appStyle.row}>
                        <AppText style={appStyle.rowLeft}>Hub Email:</AppText>
                        <View style={appStyle.rowRight}>
                            <AppText>{this.state.hub_email}</AppText>
                        </View>
                    </View>
                }
                {/* Forget Button */}
                {this.state.hub_url && 
                    <TouchableOpacity style={appStyle.regularButton} onPress={this.forgetHub}>
                        <AppText>Forget Hub</AppText>
                    </TouchableOpacity>
                }


                {/********************************************
                  ************** IF No Hub Set ***************
                  ********************************************/}

                {/* No Hub */}
                {this.state.hub_url == null && 
                    <View style={appStyle.row}>
                        <AppText style={appStyle.rowLeft}>No device is registered...</AppText>
                    </View>
                }
                {/* Register Button */}
                {this.state.hub_url == null && 
                    <TouchableOpacity style={appStyle.regularButton} onPress={this.registerHub}>
                        <AppText>Register my Hub</AppText>
                    </TouchableOpacity>
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

export default YourHub;