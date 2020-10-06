import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppTitleText from '../app/AppTitleText';
import AppText from '../app/AppText';

class RegisterHubPopup extends Component 
{
    constructor(props){
        super(props);
    }
    // Holds all of our global variables
    state = 
    {
      hub_url: null,
      hub_email: null, 
    }

    render () 
    {
        // The error element will be set if there is actually an error
        let errorElement = null;
        if(this.state.errorMessage)
        {
            errorElement = (
            <View style={authStyle.errorMessage}>
                {this.state.errorMessage && <Text style={authStyle.errorMessage}>{this.state.errorMessage}</Text>}
            </View>
            )
        }

        return (
            <Modal
                animationType="fade"
                transparent={true}
                style={style.centeredView}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={appStyle.modalOverlay}>
                    
                </View>
                <View style={appStyle.popup}>
                    <View style={appStyle.container}>
                        {/* Title */}
                        <AppHeaderText>Enter Hub Information</AppHeaderText>
                        
                        {/* Render the login form */}
                        <View style={appStyle.container}>
                            <TextInput 
                                style={appStyle.formInput} 
                                autoCapitalize="none" 
                                onChangeText={hub_url => this.setState({hub_url})} 
                                value={this.state.hub_url}
                                placeholder="Hub URL">
                            </TextInput>

                            <TextInput 
                                style={appStyle.formInput} 
                                autoCapitalize="none" 
                                autoCompleteType='email'
                                keyboardType='email-address'
                                onChangeText={hub_email => this.setState({hub_email})} 
                                value={this.state.hub_email}
                                placeholder="Hub Email">
                            </TextInput>
                        </View>

                        {/* Render the error message */}
                        { errorElement }

                        {/* Render the submit button */}
                        <TouchableOpacity style={appStyle.regularButton} onPress={ this.props.Register } >
                            <AppText>Submit</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const style = StyleSheet.create({
    
 });

export default RegisterHubPopup;