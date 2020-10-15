import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import appStyle from '../../styles/AppStyle';
import authStyle from '../../styles/AuthStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppTitleText from '../app/AppTitleText';
import AppText from '../app/AppText';

class ConfirmCodePopup extends Component 
{
    constructor(props){
        super(props);
    }
    // Holds all of our global variables
    state = 
    {
      username: "",
      authCode: "", 
    }

    // Called when when the screen is about to load, use the username from the props for the username
    componentDidMount() {
        this.setState( { username : this.props.username } );
    }

    render () 
    {

        return (
            <Modal
                animationType="fade"
                transparent={true}
                style={style.centeredView}
            >
                <TouchableOpacity onPress= { () => this.props.onCancel() }>
                    <View style={appStyle.modalOverlay}/>
                </TouchableOpacity>

                <View style={appStyle.popup}>
                    <View style={appStyle.container}>
                        {/* Title */}
                        <AppHeaderText>Enter Confirm Code</AppHeaderText>
                        
                        {/* Render the login form */}
                        <View style={appStyle.container}>
                            <TextInput 
                                style={appStyle.formInput} 
                                autoCapitalize="none" 
                                onChangeText={username => this.setState({username})} 
                                value={this.state.username}
                                placeholder="Email">
                            </TextInput>

                            <TextInput 
                                style={appStyle.formInput} 
                                autoCapitalize="none" 
                                keyboardType='numeric'
                                onChangeText={authCode => this.setState({authCode})} 
                                value={this.state.authCode}
                                placeholder="Confirm Code">
                            </TextInput>
                        </View>
                        
                        {/* Render the submit button */}
                        <TouchableOpacity style={appStyle.regularButton} onPress={ () => this.props.onSubmit(this.state.username, this.state.authCode) } >
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

export default ConfirmCodePopup;