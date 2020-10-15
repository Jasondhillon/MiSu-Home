import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import appStyle from '../../styles/AppStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DeviceCard from '../../components/cards/Devices/DeviceCard'; 

export default class DeviceScreen extends React.Component 
{
    static navigationOptions = ({ navigate, navigation }) => ({
        headerTitle: 'Device',
        headerLeft: () => (
            <View>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => navigation.navigate("Home")}>
                    <Icon name="arrow-back" size={35} style={{ marginLeft:16, marginBottom:10 }}/>
                </TouchableOpacity>
            </View>
        ),
        headerRight: () => ( <View></View>)
    });

    // Checks if component is mounted(implemented due to warnings during emulation)
    _isMounted = false;

    // Holds information retrieved from firestore(DB) to display on UI
    state = 
    {
    }

    // Called when the component is mounted, refreshes information when screen is shown
    componentDidMount()
    {
        // Stops async calls from changing state when the component is hidden
        this._isMounted = true;
        if(this._isMounted)
        {
            // Gets information from firebase auth and loads DB information for the user
            // Waits till the state is set before loading user information from User Collection DB
            // Loads information from Shared_Accounts Collection DB
        }
    }

    // Stops async calls from changing state when the component is hidden
    componentWillUnmount()
    {
        this._isMounted = false;
    }
   
    render()
    {
        return(
            
            <View style={appStyle.container}>
                <View style={appStyle.cardContainer}>
                    <ScrollView style={appStyle.scrollView}>
                        <DeviceCard/>
                    </ScrollView>
                </View>
            </View> 
        );
    }
}