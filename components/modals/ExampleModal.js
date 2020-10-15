import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppTitleText from '../app/AppTitleText';
import AppText from '../app/AppText';

class ExampleModal extends Component 
{
    constructor(props){
        super(props);
    }
    // Holds all of our global variables
    state = 
    {
      hub_url: null, //'MarkA.mozilla-iot.org',
      hub_email: null, //'Marks House'
    }

    render () 
    {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={appStyle.modalOverlay}>
                    
                </View>
                <View style={appStyle.modal}>
                    <View style={appStyle.container}>
                        <AppText>Hello World!</AppText>

                        <TouchableOpacity style={appStyle.regularButton} onPress={ this.props.Register } >
                            <AppText>Hide Modal</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const style = StyleSheet.create({
    
 });

export default ExampleModal;