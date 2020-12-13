import React, { Component } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import authStyle from '../../styles/AuthStyle';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
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
                {this.state.errorMessage && <AppText style={[authStyle.errorMessage, {fontSize:14, marginBottom:10}]}>{this.state.errorMessage}</AppText>}
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
                                <AppText style={{alignSelf:'flex-end', paddingBottom:10, marginLeft:5, paddingRight:10, color:'grey', fontSize:14}}>.webthings.io</AppText>
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
                                 if(this.state.hub_url == '' || this.state.hub_url == null || this.state.hub_email == '' || this.state.hub_email == null || this.state.hub_password == ''|| this.state.hub_password == null)
                                 {
                                     this.setState({errorMessage: 'Some fields have not been completed'});
                                     return;
                                 }
                                const state = this.props.registerHub({
                                     hub_url: this.state.hub_url, 
                                     hub_email:this.state.hub_email,
                                     hub_password: this.state.hub_password},this.props.idToken)
                                
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