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
      hub_password: null, 
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

                <TouchableOpacity onPress= { () => this.props.onCancel() }>
                    <View style={appStyle.modalOverlay}/>
                </TouchableOpacity>

                <View style={appStyle.popup}>
                    <View style={appStyle.container}>
                        {/* Title */}
                        <AppHeaderText>Register your Hub</AppHeaderText>
                        
                        {/* Render the login form */}
                        <View style={appStyle.container}>
                            
                            <View style={appStyle.formInputContainer} >
                                <TextInput 
                                    style={[appStyle.formInputClear, {paddingBottom:20}]}
                                    autoCapitalize="none" 
                                    onChangeText={hub_url => this.setState({hub_url})} 
                                    value={this.state.hub_url}
                                    placeholder="Hub URL">
                                </TextInput>
                                <AppText style={{alignSelf:'flex-end', paddingBottom:10, marginLeft:5, paddingRight:10, color:'grey', fontSize:14}}>.mozilla-iot.org</AppText>
                            </View>

                            <TextInput 
                                style={appStyle.formInput} 
                                autoCapitalize="none" 
                                autoCompleteType='email'
                                keyboardType='email-address'
                                onChangeText={hub_email => this.setState({hub_email})} 
                                value={this.state.hub_email}
                                placeholder="Hub Email">
                            </TextInput>

                            <TextInput 
                                style={appStyle.formInput} 
                                autoCapitalize="none" 
                                secureTextEntry 
                                onChangeText={hub_password => this.setState({hub_password})} 
                                value={this.state.hub_password}
                                placeholder="Hub Password">
                            </TextInput>
                        </View>

                        {/* Render the error message */}
                        { errorElement }

                        {/* Render the submit button */}
                        <TouchableOpacity style={appStyle.regularButton} onPress={ () =>
                             { 
                                 this.props.onCancel(); 
                                 this.props.setHubInfo(this.state.hub_url, this.state.hub_email, this.state.hub_password) 
                             }} >
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